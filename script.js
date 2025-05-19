let apiList = {};

document.addEventListener("DOMContentLoaded", async () => {
  const apiSelect = document.getElementById("apiSelect");
  const log = document.getElementById("log");
  const form = document.getElementById("form");
  const button = document.getElementById("submitBtn");

  try {
    const res = await fetch("api-list.json");
    apiList = await res.json();

    apiSelect.innerHTML = "";
    Object.keys(apiList).forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      apiSelect.appendChild(opt);
    });

    button.disabled = false;
  } catch {
    log.textContent = "APIリスト読み込み失敗";
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const count = parseInt(document.getElementById("count").value, 10);
    const selected = apiList[apiSelect.value];

    if (!email || isNaN(count) || !selected) {
      log.textContent = "入力内容が不正です。";
      return;
    }

    const rawPayload = JSON.stringify(selected.payload);
    const payload = JSON.parse(rawPayload.replace(/%EMAIL%/g, email));

    button.disabled = true;
    button.textContent = "送信中...";

    const jobs = [];
    for (let i = 0; i < count; i++) {
      jobs.push(
        fetch("https://your-cloudflare-worker.workers.dev/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target: selected.url,
            payload
          })
        }).then(res => res.status).catch(() => "ERR")
      );
    }

    const results = await Promise.all(jobs);
    log.textContent = results.map((status, i) => `[#${i + 1}] → ${status}`).join("\n");

    button.disabled = false;
    button.textContent = "送信開始";
  });
});
