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

async function svgToPngBytes(file) {
    
    const svgText = await file.text();

    const blob = new Blob(
        [svgText],
        { type: "image/svg+xml" }
    );

    const url = URL.createObjectURL(blob);

    try {

        const image = new Image();

        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
            image.src = url;
        });

        const canvas = document.createElement("canvas");
        const size = 1024;

        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d");

        context.drawImage(
            image,
            0,
            0,
            size,
            size
        );

        const pngBlob = await new Promise((resolve) => {
            canvas.toBlob(resolve, "image/png");
        });

        if (!pngBlob) {
            throw new Error("Could not convert SVG to PNG");
        }

        return Array.from(
            new Uint8Array(await pngBlob.arrayBuffer())
        );
    } finally {

    }
}


document.getElementById("file").addEventListener("change", async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    error.textContent = "";
    document.getElementById("scan-result").textContent = "";

    try {
        let bytes;

        // SVG needs to be converted into PNG first
        if (
            file.type === "image/svg+xml" ||
            file.name.toLowerCase().endsWith(".svg")
        ) {
            bytes = await svgToPngBytes(file);
        } else {
            bytes = Array.from(
                new Uint8Array(await file.arrayBuffer())
            );
        }

        const results = await invoke("scan_qr", { bytes });

        document.getElementById("scan-result").textContent = results.join("\n");
    } catch (err) {
        error.textContent = String(err);
    }
});