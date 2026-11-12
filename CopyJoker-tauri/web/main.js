const { invoke } = window.__TAURI__.core;

const input = document.getElementById("input");
const output = document.getElementById("output");
const error = document.getElementById("error");
const downloadButton = document.getElementById("download");
const startCameraButton = document.getElementById("start-camera");
const stopCameraButton = document.getElementById("stop-camera");
const camera = document.getElementById("camera");
const cameraContainer = document.getElementById("camera-container");
const scanResult = document.getElementById("scan-result");
const copyResultButton = document.getElementById("copy-result");

let cameraStrean = null;
let scanningCamera = false;

let generatedQrSvg = null;


function setScanResult(text) {
    scanResult.textContent = text;
    copyResultButton.disabled = !text;
}

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

startCameraButton.addEventListener("click", async () => {

    try {
        error.textContent = "";

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            },
            audio: false
        });

        camera.srcObject = cameraStream

        cameraContainer.hidden = false;

        startCameraButton.disabled = true;
        stopCameraButton.disabled = false;

        scanningCamera = true;
        scanCamera();
    } catch (err) {
        error.textContent = "Could not access camera: " + String(err);
    }
});

async function scanCamera() {
    
    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    while (scanningCamera) {

        if (
            camera.readyState === camera.HAVE_ENOUGH_DATA
        ) {
            canvas.width = camera.videoWidth;

            canvas.height = camera.videoHeight;

            context.drawImage(
                camera,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const blob = await new Promise(resolve => {
                canvas.toBlob(
                    resolve,
                    "image/png"
                );
            });

            if (blob) {

                try {
                    const bytes = Array.from(
                        new Uint8Array(
                            await blob.arrayBuffer()
                        )
                    );

                    const results = await invoke(
                        "scan_qr",
                        { bytes }
                    );

                    if ( results && results.length > 0) {
                        setScanResult(results.join("\n"));

                        stopCamera();
                        return;
                    }
                } catch {
                    // No QR Found in this frame yet.
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

function stopCamera() {

    scanningCamera = false;

    if (cameraStream) {
        cameraStream
            .getTracks()
            .forEach(track => track.stop());
        cameraStream = null;
    }

    camera.srcObject = null;
    cameraContainer.hidden = true;
    startCameraButton.disabled = false;
    stopCamera.disabled = true;
}

stopCameraButton.addEventListener(
    "click",
    stopCamera
);

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
        URL.revokeObjectURL(url);
    }
}


document.getElementById("file").addEventListener("change", async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    error.textContent = "";
    setScanResult("");

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

        setScanResult(results.join("\n"));
    } catch (err) {
        error.textContent = String(err);
    }
});

copyResultButton.addEventListener("click", async () => {
    const text = scanResult.textContent.trim();

    if (!text) {
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        const originalText = copyResultButton.textContent;
        copyResultButton.textContent = "Copied!";

        setTimeout(() => {
            copyResultButton.textContent = originalText;
        }, 1500);
    } catch (err) {
        error.textContent = "Could not copy text: " + String(err);
    }
});