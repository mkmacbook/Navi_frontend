// api.js - NAVI API 연결 함수

// 백엔드 서버 주소
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Mock 모드 비활성화 (실제 서버 사용)
const USE_MOCK = false;  // true = Mock 데이터 사용, false = 실제 서버 사용

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🧪 Mock 모드:', USE_MOCK ? '활성화' : '비활성화');

/**
 * API 호출 공통 함수
 */
async function callAPI(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`📡 API 호출: ${method} ${url}`);
    if (data) {
        console.log('📦 보내는 데이터:', data);
    }
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data && method === 'POST') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        
        console.log('📊 응답 상태:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ 받은 데이터:', result);
        
        return result;
        
    } catch (error) {
        console.error('❌ API 에러:', error);
        throw error;
    }
}

/**
 * 1. AI 추천 받기 API
 * POST /api/v1/situations/recommend/
 * Body: { "query": "사용자 입력" }
 */
async function getRecommendations(situation) {
    console.log('🤖 AI 추천 요청:', situation);
    
    // Mock 모드
    if (USE_MOCK) {
        console.log('🧪 Mock 데이터 반환');
        await new Promise(r => setTimeout(r, 1000));
        
        return {
            recommendations: [
                {
                    tool_name: "ChatGPT",
                    description: "자연스러운 대화체 스타일 창의적인 아이디어 문구 작성에 최적화되어 있습니다.",
                    prompt: "인스타그램 마케팅 목적으로 [브랜드명]의 [제품명]을 홍보하는 20-30자 이내의 매력적인 문구를 작성해주세요."
                },
                {
                    tool_name: "Claude",
                    description: "긴 문맥 이해에 뛰어나며 복잡한 내용을 다루는데 강점이 있습니다.",
                    prompt: "우리 브랜드의 핵심 가치는 [가치]입니다. [타겟 고객]을 위한 인스타그램 마케팅 문구를 20-30자로 작성해주세요."
                },
                {
                    tool_name: "Gemini",
                    description: "마케팅 전용 AI툴로, SNS 콘텐츠와 광고 문구 작성에 특화되어 있습니다.",
                    prompt: "제품: [제품명], 타겟: [고객층], 20-30자 인스타그램 마케팅 문구 작성"
                }
            ]
        };
    }
    
    // ✅ 수정: 백엔드 실제 URL
    return await callAPI('/situations/recommend-tools/', 'POST', {
        query: situation
    });
}

/**
 * 2. 프롬프트 개선 API
 * POST /api/v1/situations/refine-prompt/
 */
async function refinePrompt(prompt) {
    console.log('✨ 프롬프트 개선 요청:', prompt);
    
    return await callAPI('/situations/refine-prompt/', 'POST', {
        prompt: prompt
    });
}

/**
 * 3. AI 인라인 실행 API
 * POST /api/v1/actions/inline-run/
 */
async function runAIInline(toolName, prompt) {
    console.log('⚡ AI 인라인 실행:', toolName);
    
    // Mock 모드
    if (USE_MOCK) {
        console.log('🧪 Mock AI 응답');
        await new Promise(r => setTimeout(r, 1500));
        
        return {
            response: `[${toolName}의 응답]\n\n새로운 시작, 특별한 하루 ✨\n지금 바로 만나보세요!\n\n#브랜드 #신제품 #특별한순간\n\n※ Mock 데이터입니다.`,
            tool_name: toolName
        };
    }
    
    // 실제 API 호출 (백엔드는 "query" 필드를 받음)
    return await callAPI('/actions/inline-run/', 'POST', {
        query: prompt
    });
}

/**
 * 4. 피드백 API
 * POST /api/v1/actions/feedback/
 */
async function sendFeedback(data) {
    console.log('📝 피드백 전송:', data);
    
    return await callAPI('/actions/feedback/', 'POST', data);
}

/**
 * 5. 해시로 결과 조회 API
 * GET /api/v1/situations/by-hash/<query_hash>/
 */
async function getByHash(queryHash) {
    console.log('🔍 해시로 조회:', queryHash);
    
    return await callAPI(`/situations/by-hash/${queryHash}/`, 'GET');
}

// 전역으로 내보내기
window.API = {
    getRecommendations,
    refinePrompt,
    runAIInline,
    sendFeedback,
    getByHash
};

console.log('✅ API 모듈 로드 완료');