const { invoke } = window.__TAURI__.core;

document.getElementById("test").addEventListener("click", async () => {
    document.getElementById("out").textContent = await invoke("ping", { name: "world" });
});