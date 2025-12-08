// page3.js - AI 추천 페이지 로직 (백엔드 응답 구조에 맞게 수정)

console.log('========================================');
console.log('🚀 Page 3 로드됨');
console.log('========================================');

// 페이지 로드 시 데이터 표시
window.addEventListener("DOMContentLoaded", () => {
    console.log("📖 DOM Loaded");

    const saved = localStorage.getItem("recommendations");
    const userInput = localStorage.getItem("userInput");

    if (!saved || !userInput) {
        alert("추천 데이터가 없습니다.");
        window.location.href = "page2.html";
        return;
    }

    const data = JSON.parse(saved);

    console.log("✅ Recommend Response:", data);

    document.getElementById("pageTitle").textContent = `"${userInput}"`;

    if (!Array.isArray(data.recommendations)) {
        console.error("❌ recommendations missing:", data);
        alert("추천 데이터 형식 오류");
        return;
    }

    displayRecommendations(data.recommendations, userInput);
});


function displayRecommendations(recommendations, userInput) {

    const cards = document.querySelectorAll(".ai-card");

    recommendations.forEach((rec, index) => {
        if (cards[index]) updateCard(cards[index], rec, userInput);
    });
}


async function refinePrompt(query, toolName) {
    const res = await fetch("http://127.0.0.1:8000/api/v1/situations/refine-prompt/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: query,
            tool_name: toolName
        })
    });

    const data = await res.json();

    if (data.refined_prompt?.refined_prompt_text) {
        return data.refined_prompt.refined_prompt_text;
    }

    return null;
}

function updateCard(card, rec, userInput) {

    const toolName = rec.tool_name;
    const toolUrl = rec.tool_url;
    const reasoning = rec.reasoning || "추천된 AI 도구입니다.";

    console.log(`업데이트 중인 card: ${toolName}`);

    // ===== NAME =====
    card.querySelector(".ai-name").textContent = toolName;

    // ===== DESCRIPTION =====
    card.querySelector(".ai-description").textContent = reasoning;

    // ===== LOGO + TAGS =====
    updateLogo(card, toolName);
    updateTags(card, toolName);

    // ===== PROMPT FIELD =====
    const promptBox = card.querySelector(".prompt-text-editable");
    promptBox.value = "프롬프트 생성 중...";

    refinePrompt(userInput, toolName).then(refined => {
        promptBox.value = refined || `${userInput}을(를) 도와주세요.`;
    });

    // ===== DATASET =====
    card.dataset.toolUrl = toolUrl;
    card.dataset.toolId = rec.tool_id || "";

    card.classList.add("loaded");
}


/**
 * AI 이름에 따라 로고 이미지 업데이트
 */
function updateLogo(card, toolName) {
    const logoImg = card.querySelector('.ai-logo');
    if (!logoImg || !toolName) return;
    
    const nameLower = toolName.toLowerCase();
    
    if (nameLower.includes('gpt') || nameLower.includes('chatgpt') || nameLower.includes('openai')) {
        logoImg.src = 'images/chatgpt-logo.png';
        logoImg.alt = toolName;
    } else if (nameLower.includes('claude') || nameLower.includes('anthropic')) {
        logoImg.src = 'images/claude-logo.png';
        logoImg.alt = toolName;
    } else if (nameLower.includes('gemini') || nameLower.includes('google')) {
        logoImg.src = 'images/gemini-logo.png';
        logoImg.alt = toolName;
    } else if (nameLower.includes('jasper')) {
        logoImg.src = 'images/jasper-logo.png';
        logoImg.alt = toolName;
    } else if (nameLower.includes('midjourney')) {
        logoImg.src = 'images/midjourney-logo.png';
        logoImg.alt = toolName;
    } else if (nameLower.includes('dall') || nameLower.includes('dalle')) {
        logoImg.src = 'images/dalle-logo.png';
        logoImg.alt = toolName;
    }
    
    console.log(`  ✓ 로고 업데이트: ${toolName}`);
}

/**
 * AI 이름에 따라 태그 업데이트
 */
function updateTags(card, toolName) {
    const tagsContainer = card.querySelector('.tags');
    if (!tagsContainer) return;
    
    const nameLower = toolName.toLowerCase();
    let tags = [];
    
    if (nameLower.includes('gpt') || nameLower.includes('chatgpt')) {
        tags = ['텍스트 생성', '대화형', '다용도'];
    } else if (nameLower.includes('claude')) {
        tags = ['긴 문맥', '분석력', '안전성'];
    } else if (nameLower.includes('gemini')) {
        tags = ['멀티모달', '검색 통합', '빠른 응답'];
    } else if (nameLower.includes('midjourney')) {
        tags = ['이미지 생성', '예술적', '고품질'];
    } else if (nameLower.includes('dall')) {
        tags = ['이미지 생성', 'OpenAI', '창의적'];
    } else {
        tags = ['AI 도구', '자동화', '생산성'];
    }
    
    tagsContainer.innerHTML = tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
}

// AI 카드 호버 효과
document.querySelectorAll('.ai-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        document.querySelectorAll('.ai-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
    });
});

// "위 프롬프트로 결과보기" 버튼 이벤트
document.querySelectorAll('.use-prompt-button').forEach((button, index) => {
    console.log(`🔘 버튼 ${index + 1} 이벤트 등록`);
    
    button.addEventListener('click', async function(e) {
        e.preventDefault();
        
        console.log('\n========================================');
        console.log(`🖱️ 버튼 클릭됨`);
        
        const card = e.target.closest('.ai-card');
        
        if (!card) {
            console.error('❌ 부모 카드를 찾을 수 없습니다!');
            return;
        }
        
        // 선택한 AI 정보 추출
        const toolName = card.querySelector('.ai-name')?.textContent || 'Unknown';
        const prompt = card.querySelector('.prompt-text-editable')?.value || '';
        const toolUrl = card.dataset.toolUrl || '';
        const toolId = card.dataset.toolId || '';
        
        console.log('📋 선택 정보:');
        console.log('  - AI:', toolName);
        console.log('  - 프롬프트:', prompt.substring(0, 50) + '...');
        console.log('  - URL:', toolUrl);
        
        // 로딩 시작
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = '처리 중...';
        button.style.opacity = '0.6';
        
        try {
            console.log('📡 AI 실행 API 호출...');
            
            // 실제 API 호출
            const result = await API.runAIInline(toolName, prompt);
            
            console.log('✅ AI 응답 받음:', result);
            
            // 결과 저장
            console.log('💾 결과 저장 중...');
            localStorage.setItem('selectedAI', toolName);
            localStorage.setItem('selectedPrompt', prompt);
            localStorage.setItem('selectedToolUrl', toolUrl);
            localStorage.setItem('aiResult', JSON.stringify(result));
            console.log('✅ 저장 완료!');
            
            // Page 4로 이동
            console.log('🔄 Page 4로 이동 중...');
            window.location.href = 'page4.html';
            
        } catch (error) {
            console.error('❌ AI 실행 에러:', error);
            
            // 로딩 해제
            button.disabled = false;
            button.textContent = originalText;
            button.style.opacity = '1';
            
            // ⚠️ inline-run API가 안 되면 대안 제시
            const useAlternative = confirm(
                'AI 실행 중 오류가 발생했습니다.\n\n' +
                '대신 프롬프트를 복사하고 AI 사이트로 이동할까요?'
            );
            
            if (useAlternative) {
                // 프롬프트 클립보드에 복사
                try {
                    await navigator.clipboard.writeText(prompt);
                    alert('프롬프트가 복사되었습니다!\n\nAI 사이트에서 붙여넣기 하세요.');
                } catch (e) {
                    console.log('클립보드 복사 실패');
                }
                
                // 결과 저장 후 page4로 이동 (또는 AI 사이트로 이동)
                localStorage.setItem('selectedAI', toolName);
                localStorage.setItem('selectedPrompt', prompt);
                localStorage.setItem('selectedToolUrl', toolUrl);
                localStorage.setItem('aiResult', JSON.stringify({ 
                    response: '(AI 사이트에서 직접 실행해주세요)',
                    tool_name: toolName 
                }));
                
                // AI 사이트 URL이 있으면 새 탭으로 열기
                if (toolUrl) {
                    window.open(toolUrl, '_blank');
                }
                
                window.location.href = 'page4.html';
            }
        }
        
        console.log('========================================\n');
    });
});

// 저장하기 버튼 이벤트
document.querySelectorAll('.save-button').forEach((button, index) => {
    button.addEventListener('click', function(e) {
        const card = e.target.closest('.ai-card');
        const prompt = card.querySelector('.prompt-text-editable')?.value || '';
        const toolName = card.querySelector('.ai-name')?.textContent || 'AI';
        
        // 로컬스토리지에 저장
        const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
        savedPrompts.push({
            toolName: toolName,
            prompt: prompt,
            savedAt: new Date().toISOString()
        });
        localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
        
        // 사용자 피드백
        const originalText = button.textContent;
        button.textContent = '저장됨! ✓';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
        }, 2000);
        
        console.log(`💾 프롬프트 저장됨: ${toolName}`);
    });
});

console.log('✅ Page 3 초기화 완료');
console.log('========================================');