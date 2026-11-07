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


document.getElementById("file").addEventListener("change", async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    error.textContent = "";
    document.getElementById("scan-result").textContent = "";

    try {
        const bytes = Array.from(new Uint8Array(await file.arrayBuffer()));
        const result = await invoke("scan_qr", { bytes });
        document.getElementById("scan-result").textContent = results.join("\n");
    } catch (err) {
        error.textContent = String(err);
    }
})