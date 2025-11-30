const BACKEND = "http://127.0.0.1:8000";

window.onload = async () => {
    setTitleFromQuery();
    await configureAllButtons();
    attachButtonHandlers();
};

function setTitleFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    document.getElementById("result-title").innerText =
        query ? `“${query}”` : "“선택된 주제가 없습니다”";
}


async function configureAllButtons() {
    const buttons = document.querySelectorAll(".result-btn");

    for (const button of buttons) {
        const card = button.closest(".card");
        const toolName = card.querySelector(".ai-name").innerText.trim();
        const prompt = card.querySelector(".prompt-text").innerText.trim();

        try {
            const res = await fetch(`${BACKEND}/api/v1/situations/can-inline-run/`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    tool_name: toolName,
                    query: prompt
                })
            });

            const decision = await res.json();
            console.log(`Decision for ${toolName}:`, decision);

            applyDecision(button, decision, prompt);

        } catch (err) {
            console.error("Init button error:", err);
            button.innerText = "연결 실패";
            button.disabled = true;
        }
    }
}


function attachButtonHandlers() {
    document.querySelectorAll(".result-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
        });
    });
}


function applyDecision(button, decision, prompt) {

    if (decision.can_inline) {
        button.innerText = "NAVI에서 바로 실행하기";
        button.onclick = () => inlineRun(prompt);
        return;
    }

    /* INLINE 실행 불가 */
    let message = "해당 툴 사이트로 이동하기";

    button.innerText = message;
    button.onclick = () => window.open(decision.tool_url, "_blank");
}


async function inlineRun(prompt) {

    const res = await fetch(`${BACKEND}/api/v1/actions/inline-run/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ query: prompt })
    });

    const data = await res.json();

    console.log("INLINE RUN RESULT:", data);

    sessionStorage.setItem("inline_result", JSON.stringify(data));
    window.location.href = "result.html";
}