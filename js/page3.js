// page3.js - AI 추천 페이지 로직 (백엔드 응답 구조에 맞게 수정)

console.log('========================================');
console.log('🚀 Page 3 로드됨');
console.log('========================================');

// 페이지 로드 시 데이터 표시
window.addEventListener('DOMContentLoaded', function() {
    console.log('📖 DOM 로드 완료');
    
    // localStorage에서 데이터 불러오기
    const savedData = localStorage.getItem('recommendations');
    const userInput = localStorage.getItem('userInput');
    
    console.log('📦 저장된 데이터 확인:');
    console.log('  - recommendations:', savedData ? '있음' : '없음');
    console.log('  - userInput:', userInput);
    
    // 제목 업데이트
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle && userInput) {
        pageTitle.textContent = `"${userInput}"`;
    }
    
    if (!savedData) {
        console.error('❌ 추천 데이터 없음 - Page 2로 리다이렉트');
        alert('데이터가 없습니다. 입력 페이지로 돌아갑니다.');
        window.location.href = 'page2.html';
        return;
    }
    
    try {
        console.log('🔄 JSON 파싱 중...');
        const data = JSON.parse(savedData);
        console.log('✅ 파싱 완료:', data);
        console.log('📋 데이터 키들:', Object.keys(data));
        
        console.log('🎨 화면에 표시 시작...');
        displayRecommendations(data);
        console.log('✅ 화면 표시 완료!');
        
    } catch (error) {
        console.error('❌ JSON 파싱 에러:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다.');
        window.location.href = 'page2.html';
    }
});

/**
 * AI 추천 결과를 화면에 표시
 * 
 * 백엔드 응답 구조:
 * {
 *   "situation": {...},
 *   "recommendations": [
 *     {
 *       "recommendation": { "id": "...", "tool_id": "...", "reasoning": "..." },
 *       "prompt_suggestion": { "prompt_text": "..." },
 *       "tool_name": "ChatGPT",  // API에서 추가됨
 *       "tool_url": "https://..."  // API에서 추가됨
 *     }
 *   ]
 * }
 */
function displayRecommendations(data) {
    console.log('--- displayRecommendations 함수 시작 ---');
    console.log('받은 데이터:', data);
    
    // 백엔드 응답 구조에서 recommendations 찾기
    let recommendations = data.recommendations || data.tools || [];
    
    console.log('🔍 찾은 recommendations:', recommendations);
    
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
        console.error('❌ recommendations가 없거나 비어있습니다');
        console.error('   전체 데이터:', JSON.stringify(data, null, 2));
        alert('추천 데이터가 없습니다.');
        return;
    }
    
    console.log('📊 추천 항목 개수:', recommendations.length);
    
    // AI 카드 요소들 찾기
    const cards = document.querySelectorAll('.ai-card');
    console.log('🎴 찾은 카드 개수:', cards.length);
    
    if (cards.length === 0) {
        console.error('❌ AI 카드를 찾을 수 없습니다!');
        return;
    }
    
    // 사용자 입력 가져오기
    const userInput = localStorage.getItem('userInput') || '작업';
    
    // 각 추천 항목을 카드에 표시
    recommendations.forEach((rec, index) => {
        console.log(`\n카드 ${index + 1} 처리 중:`);
        console.log('  - 전체 데이터:', rec);
        
        if (cards[index]) {
            updateCard(cards[index], rec, index, userInput);
            console.log(`✅ 카드 ${index + 1} 업데이트 완료`);
        } else {
            console.warn(`⚠️ 카드 ${index + 1}이 없습니다`);
        }
    });
    
    console.log('--- displayRecommendations 함수 종료 ---\n');
}

/**
 * 개별 카드 업데이트
 * 
 * 백엔드 응답의 각 recommendation 구조:
 * {
 *   "recommendation": { "reasoning": "..." },
 *   "prompt_suggestion": { "prompt_text": "..." },
 *   "tool_name": "ChatGPT",
 *   "tool_url": "https://..."
 * }
 */
function updateCard(card, rec, index, userInput) {
    // ✅ 백엔드 구조에 맞게 데이터 추출
    // rec.recommendation.reasoning 또는 rec.reasoning
    const reasoning = rec.recommendation?.reasoning || rec.reasoning || rec.description || '추천된 AI 도구입니다.';
    
    // rec.prompt_suggestion.prompt_text 또는 rec.prompt
    const promptText = rec.prompt_suggestion?.prompt_text || rec.prompt || rec.template || '';
    
    // rec.tool_name (API에서 추가됨)
    const toolName = rec.tool_name || rec.name || 'AI Tool';
    
    // rec.tool_url (API에서 추가됨)
    const toolUrl = rec.tool_url || rec.url || '';
    
    console.log(`  - tool_name: ${toolName}`);
    console.log(`  - reasoning: ${reasoning.substring(0, 30)}...`);
    console.log(`  - prompt: ${promptText.substring(0, 30)}...`);
    
    // AI 이름 설정
    const nameElement = card.querySelector('.ai-name');
    if (nameElement) {
        nameElement.textContent = toolName;
        console.log(`  ✓ 이름 설정: ${toolName}`);
        
        // 로고 이미지도 업데이트
        updateLogo(card, toolName);
    }
    
    // 설명 (reasoning) 설정
    const descElement = card.querySelector('.ai-description');
    if (descElement) {
        descElement.textContent = reasoning;
        console.log(`  ✓ 설명 설정 완료`);
    }
    
    // 태그 업데이트
    updateTags(card, toolName);
    
    // 프롬프트 설정
    const promptElement = card.querySelector('.prompt-text-editable');
    if (promptElement) {
        if (promptText) {
            promptElement.value = promptText;
        } else {
            // 프롬프트가 없으면 기본 프롬프트 생성
            promptElement.value = `${userInput}을(를) 도와주세요.\n\n구체적이고 창의적인 결과물을 만들어주세요.`;
        }
        console.log(`  ✓ 프롬프트 설정 완료`);
    }
    
    // tool_url 저장 (나중에 사용)
    if (toolUrl) {
        card.dataset.toolUrl = toolUrl;
        console.log(`  ✓ URL 저장: ${toolUrl}`);
    }
    
    // tool_id 저장
    if (rec.recommendation?.tool_id) {
        card.dataset.toolId = rec.recommendation.tool_id;
    }
    
    // 카드 활성화
    card.classList.add('loaded');
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