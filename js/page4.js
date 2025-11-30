// page4.js - AI 결과 페이지 로직

console.log('========================================');
console.log('🚀 Page 4 로드됨');
console.log('========================================');

// 페이지 로드 시 결과 표시
window.addEventListener('DOMContentLoaded', function() {
    console.log('📖 DOM 로드 완료');
    
    // localStorage에서 데이터 불러오기
    const resultData = localStorage.getItem('aiResult');
    const selectedAI = localStorage.getItem('selectedAI');
    const selectedPrompt = localStorage.getItem('selectedPrompt');
    
    console.log('📦 저장된 데이터 확인:');
    console.log('  - aiResult:', resultData ? '있음' : '없음');
    console.log('  - selectedAI:', selectedAI);
    console.log('  - selectedPrompt:', selectedPrompt?.substring(0, 50) + '...');
    
    if (!resultData) {
        console.error('❌ 결과 데이터 없음 - Page 2로 리다이렉트');
        alert('결과가 없습니다. 처음부터 다시 시작해주세요.');
        window.location.href = 'page2.html';
        return;
    }
    
    try {
        console.log('🔄 JSON 파싱 중...');
        const result = JSON.parse(resultData);
        console.log('✅ 파싱 완료:', result);
        
        console.log('🎨 화면에 표시 시작...');
        displayResult(result, selectedAI, selectedPrompt);
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
function displayResult(result, selectedAI, selectedPrompt) {
    console.log('--- displayResult 함수 시작 ---');
    console.log('받은 결과:', result);
    
    // AI 이름 표시
    const aiNameElements = document.querySelectorAll('.ai-name, .selected-ai, h3');
    console.log(`📝 AI 이름 요소 개수: ${aiNameElements.length}`);
    
    aiNameElements.forEach((element, index) => {
        if (selectedAI && element.textContent.trim().length < 30) { // 제목 같은 짧은 텍스트만
            element.textContent = selectedAI + ' 응답';
            console.log(`✓ AI 이름 ${index + 1} 설정:`, element.textContent);
        }
    });
    
    // 프롬프트 표시 (있다면)
    const promptElements = document.querySelectorAll('.used-prompt, .prompt-display');
    if (promptElements.length > 0 && selectedPrompt) {
        console.log('📋 프롬프트 표시');
        promptElements.forEach(element => {
            element.textContent = selectedPrompt;
        });
    }
    
    // AI 응답 내용 표시
    const responseElements = document.querySelectorAll(
        '.ai-response-content, ' +
        '.response-content, ' +
        '.ai-result, ' +
        '.result-content'
    );
    
    console.log(`💬 응답 컨테이너 개수: ${responseElements.length}`);
    
    if (responseElements.length === 0) {
        console.error('❌ 응답 표시 영역을 찾을 수 없습니다!');
        // 수동으로 표시
        document.body.innerHTML += `
            <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
                <h2>${selectedAI || 'AI'} 응답</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; white-space: pre-wrap;">
                    ${formatResponse(result)}
                </div>
            </div>
        `;
        return;
    }
    
    // 응답 텍스트 추출 (API 응답 구조에 따라 다를 수 있음)
    const responseText = result.response || 
                        result.content || 
                        result.answer || 
                        result.result ||
                        result.text ||
                        JSON.stringify(result, null, 2);
    
    console.log('📄 응답 내용:', responseText.substring(0, 100) + '...');
    
    // 응답 표시
    responseElements.forEach((element, index) => {
        const formattedResponse = formatResponse(responseText);
        element.innerHTML = formattedResponse;
        console.log(`✓ 응답 ${index + 1} 표시 완료`);
    });
    
    console.log('--- displayResult 함수 종료 ---\n');
}

/**
 * 응답 텍스트 포맷팅
 */
function formatResponse(text) {
    if (typeof text !== 'string') {
        text = JSON.stringify(text, null, 2);
    }
    
    // 줄바꿈 처리
    text = text.replace(/\n/g, '<br>');
    
    // 마크다운 스타일 간단 변환 (선택사항)
    // 볼드: **텍스트** → <strong>텍스트</strong>
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // 이탤릭: *텍스트* → <em>텍스트</em>
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    return `<p>${text}</p>`;
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
