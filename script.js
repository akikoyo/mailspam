let apiList = {};

document.addEventListener("DOMContentLoaded", async () => {
  const apiSelect = document.getElementById("apiSelect");
  const log = document.getElementById("log");

  try {
    const response = await fetch("api-list.json");
    apiList = await response.json();

    apiSelect.innerHTML = "";
    for (const name in apiList) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      apiSelect.appendChild(option);
    }
  } catch (err) {
    log.textContent = "APIリストの読み込み失敗";
    return;
  }

  document.getElementById("startBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const count = parseInt(document.getElementById("count").value, 10);
    const proxy = document.getElementById("proxy").value.trim();
    const selected = apiList[apiSelect.value];

    if (!email || isNaN(count) || !selected) {
      log.textContent = "入力内容を確認してください";
      return;
    }

    const raw = JSON.stringify(selected.payload);
    const finalPayload = JSON.parse(raw.replace(/%EMAIL%/g, email));
    const requestBody = {
      target: selected.url,
      payload: finalPayload,
      proxy
    };

    log.textContent = `送信中...\n`;

    const tasks = [];
    for (let i = 0; i < count; i++) {
      tasks.push(
        fetch("https://your-api-host.example.com/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        })
        .then(res => res.status)
        .catch(() => "ERR")
      );
    }

    const results = await Promise.all(tasks);
    results.forEach((status, idx) => {
      log.textContent += `[#${idx + 1}] -> ${status}\n`;
    });
  });
});
