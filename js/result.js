window.addEventListener("load", () => {
    loadInlineResult();
});

function loadInlineResult() {
    const data = sessionStorage.getItem("inline_result");

    if (!data) {
        alert("결과 데이터를 찾을 수 없습니다.");
        return;
    }

    const parsed = JSON.parse(data);

    console.log("INLINE RESULT:", parsed);

    // 1. 가져온 텍스트를 상단 박스에 넣기
    const prompt = parsed.query || "프롬프트 없음";
    document.getElementById("userPromptDisplay").innerText = prompt;

    // 2. AI output 렌더링
    renderAIResult(parsed.response, parsed.saved_images);

    // 3. 로딩 시뮬레이션 (2.5초 뒤에 로딩화면 끄고 결과화면 켜기)
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none"; // 로딩 숨김
        document.getElementById("result-content").style.display = "flex"; // 결과 보임
    }, 2500); // 2500ms = 2.5초
}


/* ---------------------------
    AI Output 렌더링 (Text / Image)
---------------------------- */
function renderAIResult(response) {
    const container = document.querySelector(".answer-text");
    container.innerHTML = "";

    if (!response || !response.type) {
        container.innerText = "결과가 없습니다.";
        return;
    }

    // TEXT만 있는 response
    if (response.type === "text") {
        const p = document.createElement("p");
        p.innerText = response.text || "(빈 결과)";
        container.appendChild(p);
        return;
    }

    // MULTIMODAL (text + image)
    if (response.type === "multimodal") {
        response.content.forEach(part => {

            // TEXT
            if (part.type === "text") {
                const p = document.createElement("p");
                p.innerText = part.text || "";
                container.appendChild(p);
            }

            // IMAGE
            else if (part.type === "image") {
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
    container.innerText = "지원되지 않는 결과 형식입니다.";
}

function renderImageUrl(url, container) {

    const img = document.createElement("img");

    // Django MEDIA url 그대로 사용
    img.src = `http://127.0.0.1:8000${url}`;

    img.style.maxWidth = "100%";
    img.style.borderRadius = "12px";
    img.style.marginTop = "15px";

    container.appendChild(img);
}




