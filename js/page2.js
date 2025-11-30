// page2.js - 입력 페이지 로직

console.log('========================================');
console.log('🚀 Page 2 로드됨');
console.log('========================================');

// 페이지 로드 시 localStorage 상태 확인
console.log('📂 현재 localStorage 상태:');
console.log('  - recommendations:', localStorage.getItem('recommendations'));
console.log('  - userInput:', localStorage.getItem('userInput'));

// 폼 요소 찾기
const form = document.querySelector('form');
const textarea = document.querySelector('textarea');
const submitButton = document.querySelector('.submit-button, button[type="submit"]');

if (!form) {
    console.error('❌ form 태그를 찾을 수 없습니다!');
}
if (!textarea) {
    console.error('❌ textarea를 찾을 수 없습니다!');
}
if (!submitButton) {
    console.warn('⚠️ 제출 버튼을 찾을 수 없습니다!');
}

// 폼 제출 이벤트 리스너
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // 페이지 새로고침 방지
        
        console.log('========================================');
        console.log('📝 폼 제출 시작');
        
        const userInput = textarea ? textarea.value.trim() : '';
        
        console.log('👤 사용자 입력:', userInput);
        console.log('📏 입력 길이:', userInput.length);
        
        // 빈 입력 체크
        if (!userInput) {
            console.log('❌ 입력값 없음 - 알림 표시');
            alert('내용을 입력해주세요!');
            return;
        }
        
        // 로딩 시작
        showLoading();
        
        try {
            console.log('📡 API 호출 시작...');
            
            // 실제 API 호출
            const data = await API.getRecommendations(userInput);
            
            console.log('✅ API 응답 받음:', data);
            
            // 데이터 저장
            console.log('💾 localStorage에 저장 중...');
            localStorage.setItem('recommendations', JSON.stringify(data));
            localStorage.setItem('userInput', userInput);
            console.log('✅ 저장 완료!');
            
            // Page 3으로 이동
            console.log('🔄 Page 3으로 이동 중...');
            window.location.href = 'page3.html';
            
        } catch (error) {
            console.error('❌ 에러 발생:', error);
            
            hideLoading();
            
            // 사용자에게 에러 메시지 표시
            alert('오류가 발생했습니다.\n' + 
                  '백엔드 서버가 실행 중인지 확인해주세요.\n\n' +
                  '에러: ' + error.message);
        }
        
        console.log('========================================');
    });
}

// 추천 칩 클릭 이벤트 (예시 문구 자동 입력)
const chips = document.querySelectorAll('.chip, .example-chip');
console.log(`🎯 찾은 칩 개수: ${chips.length}`);

chips.forEach((chip, index) => {
    chip.addEventListener('click', function() {
        console.log(`💡 칩 ${index + 1} 클릭:`, this.textContent);
        if (textarea) {
            textarea.value = this.textContent.trim();
            textarea.focus();
        }
    });
});

// 로딩 표시 함수
function showLoading() {
    console.log('⏳ 로딩 시작...');
    
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent;
        submitButton.textContent = '분석 중...';
        submitButton.style.opacity = '0.6';
        submitButton.style.cursor = 'not-allowed';
    }
    
    if (textarea) {
        textarea.disabled = true;
    }
}

// 로딩 숨기기 함수
function hideLoading() {
    console.log('✅ 로딩 종료');
    
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || '제출';
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
    }
    
    if (textarea) {
        textarea.disabled = false;
    }
}

console.log('✅ Page 2 초기화 완료');
console.log('========================================');
