const { invoke } = window.__TAURI__.core;

const input = document.getElementById("input");
const output = document.getElementById("output");
const error = document.getElementById("error");

document.getElementById("generate").addEventListener("click", async () => {
    error.textContent = "";

    try {
        output.innerHTML = await invoke("generate_qr", { text: input.value });
    } catch (err) {
        output.innerHTML = "";
        error.textContent = String(err);
    }
});