const { invoke } = window.__TAURI__.core;

const input = document.getElementById("input");
const output = document.getElementById("output");
const error = document.getElementById("error");
const downloadButton = document.getElementById("download");

let generatedQrSvg = null;

document.getElementById("generate").addEventListener("click", async () => {
    error.textContent = "";

    try {
        generatedQrSvg = await invoke("generate_qr", { 
            text: input.value
        });

        output.innerHTML = generatedQrSvg;
        downloadButton.disabled = false;
    } catch (err) {
        output.innerHTML = "";
        generatedQrSvg = null;
        downloadButton.disabled = true;

        error.textContent = String(err);
    }
});

downloadButton.addEventListener("click", () => {
    if (!generatedQrSvg) {
        return;
    }

    const blob = new Blob(
        [generatedQrSvg],
        { type: "image/svg+xml" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "copyjoker-qr.svg";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
});


document.getElementById("file").addEventListener("change", async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    error.textContent = "";
    document.getElementById("scan-result").textContent = "";

    try {
        const bytes = Array.from(new Uint8Array(await file.arrayBuffer()));
        const results = await invoke("scan_qr", { bytes });
        document.getElementById("scan-result").textContent = results.join("\n");
    } catch (err) {
        error.textContent = String(err);
    }
})