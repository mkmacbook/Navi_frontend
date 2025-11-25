// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('NAVI 웹사이트가 로드되었습니다.');
    
    // 복사 버튼 기능
    const copyButtons = document.querySelectorAll('.copy-button, .copy-button-bottom');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                // 복사할 텍스트 찾기
                const promptBox = this.closest('.prompt-box');
                if (promptBox) {
                    const promptText = promptBox.querySelector('.prompt-text').textContent;
                    copyToClipboard(promptText);
                } else {
                    const responseContent = document.querySelector('.response-content');
                    if (responseContent) {
                        copyToClipboard(responseContent.textContent);
                    }
                }
                
                // 버튼 텍스트 변경
                const originalText = this.textContent;
                this.textContent = '복사됨!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }
        });
    });
    
    // Textarea 자동 높이 조절
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
    
    // 제안 칩 클릭 시 텍스트 입력
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            const textarea = document.querySelector('.input-box textarea');
            if (textarea) {
                textarea.value = this.textContent;
                textarea.focus();
                // 높이 자동 조절
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            }
        });
    });
});

// 클립보드에 텍스트 복사
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('텍스트가 복사되었습니다.');
        }).catch(err => {
            console.error('복사 실패:', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// 구형 브라우저를 위한 복사 기능
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        console.log('텍스트가 복사되었습니다 (fallback).');
    } catch (err) {
        console.error('복사 실패 (fallback):', err);
    }
    
    document.body.removeChild(textArea);
}

// 부드러운 스크롤
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}