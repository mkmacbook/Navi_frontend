// page4.js - AI 결과 페이지 로직

console.log('========================================');
console.log('🚀 Page 4 로드됨');
console.log('========================================');

function renderAIResult(resultData, container) {
    container.innerHTML = "";
    
    // resultData는 backend로부터 받은 'wrapped'구조임
    const response = resultData.response; 
    
    if (!response || !response.type) {
        container.innerText = "결과가 없습니다. (No response data or type.)";
        return;
    }

    // TEXT only response
    if (response.type === "text") {
        const p = document.createElement("p");
        // Apply simple formatting to the plain text
        p.innerHTML = formatPlainText(response.text || "(빈 결과)");
        container.appendChild(p);
        return;
    }

    // MULTIMODAL (text + image)
    if (response.type === "multimodal" && response.content) {
        response.content.forEach(part => {

            // TEXT
            if (part.type === "text") {
                const p = document.createElement("p");
                p.innerHTML = formatPlainText(part.text || "");
                container.appendChild(p);
            }

            // IMAGE
            else if (part.type === "image" && part.url) {
                renderImageUrl(part.url, container);
            }

            // ERROR
            else if (part.type === "error") {
                const err = document.createElement("p");
                err.innerText = "이미지 생성 실패";
                err.style.color = "red";
                container.appendChild(err);
            }
        });
        return;
    }

    // FALLBACK
    container.innerText = "지원되지 않는 결과 형식입니다. (Unsupported result format.)";
}

function formatPlainText(text) {
    if (typeof text !== 'string') {
        text = JSON.stringify(text, null, 2);
    }
    
    // 줄바꿈 처리
    text = text.replace(/\n/g, '<br>');
    
    // 마크다운 스타일 간단 변환 (볼드, 이탤릭)
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    return text; 
}

function renderImageUrl(url, container) {

    const img = document.createElement("img");
    
    img.src = `http://127.0.0.1:8000${url}`; 

    img.style.maxWidth = "100%";
    img.style.borderRadius = "12px";
    img.style.marginTop = "15px";

    container.appendChild(img);
}

// 페이지 로드 시 결과 표시
window.addEventListener('DOMContentLoaded', function() {
    console.log('📖 DOM 로드 완료');
    
    // localStorage에서 데이터 불러오기
    const resultDataJSON = localStorage.getItem('aiResult');
    const selectedAI = localStorage.getItem('selectedAI');
    const selectedPrompt = localStorage.getItem('selectedPrompt');
    
    console.log('📦 저장된 데이터 확인:');
    console.log('  - aiResult:', resultDataJSON ? '있음' : '없음');
    console.log('  - selectedAI:', selectedAI);
    console.log('  - selectedPrompt:', selectedPrompt?.substring(0, 50) + '...');
    
    if (!resultDataJSON) {
        console.error('❌ 결과 데이터 없음 - Page 2로 리다이렉트');
        alert('결과가 없습니다. 처음부터 다시 시작해주세요.');
        window.location.href = 'page2.html';
        return;
    }
    
    try {
        console.log('🔄 JSON 파싱 중...');
        const resultData = JSON.parse(resultDataJSON);
        console.log('✅ 파싱 완료:', resultData);
        
        console.log('🎨 화면에 표시 시작...');
        displayResult(resultData, selectedAI, selectedPrompt);
        console.log('✅ 화면 표시 완료!');
        
    } catch (error) {
        console.error('❌ JSON 파싱 에러:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다.');
        window.location.href = 'page2.html';
    }
});

/**
 * AI 결과를 화면에 표시
 */
function displayResult(result, selectedAI, selectedPrompt) { // 텍스트 결과만 display할 수 있음
    console.log('--- displayResult 함수 시작 ---');
    console.log('받은 결과:', result);

    // UI 상태 변경: 로딩 숨기기, 최종 응답 및 푸터 보이기
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('finalResponse').style.display = 'flex';
    document.getElementById('bottomLogos').style.display = 'block';
    document.getElementById('footerSection').style.display = 'block';
    
    // AI 이름 표시
    const aiNameElements = document.querySelectorAll('.ai-name, .selected-ai, h3');
    console.log(`📝 AI 이름 요소 개수: ${aiNameElements.length}`);
    
    aiNameElements.forEach((element, index) => {
        if (selectedAI && element.textContent.trim().length < 30) { // 제목 같은 짧은 텍스트만
            element.textContent = selectedAI + ' 응답';
            console.log(`✓ AI 이름 ${index + 1} 설정:`, element.textContent);
        }
    });

    document.getElementById('userPrompt').textContent = selectedPrompt;
    
    // AI 응답 내용 표시
    const responseContainer = document.getElementById('aiResponseContent');
    
    if (!responseContainer) {
        console.error('❌ 응답 표시 영역 (#aiResponseContent)을 찾을 수 없습니다!');
        return;
    }

    console.log('renderAIResult 호출: Multimodal/Text 응답을 DOM에 렌더링');
    renderAIResult(result, responseContainer);
    
    console.log('--- displayResult 함수 종료 ---\n');
}

// 다시 시도 버튼 (있다면)
const retryButtons = document.querySelectorAll('.retry-button, .back-button');
retryButtons.forEach((button, index) => {
    console.log(`🔄 다시 시도 버튼 ${index + 1} 이벤트 등록`);
    
    button.addEventListener('click', function() {
        console.log('🔙 Page 2로 돌아가기');
        
        // localStorage 정리 (선택사항)
        // localStorage.clear();
        
        window.location.href = 'page2.html';
    });
});

// 새로운 추천 받기 버튼
const newRecommendationButtons = document.querySelectorAll('.new-recommendation');
newRecommendationButtons.forEach(button => {
    button.addEventListener('click', function() {
        console.log('🆕 새로운 추천 받기');
        localStorage.clear();
        window.location.href = 'page2.html';
    });
});

console.log('✅ Page 4 초기화 완료');
console.log('========================================');
