use qrcode::QrCode;
use qrcode::render::svg;

#[tauri::command]
fn generate_qr(text: String) -> Result<String, String> {
    if text.trim().is_empty() {
        return Err("Enter Some Text first".into());
    }

    let code = QrCode::new(text.as_bytes()).map_err(|e| e.to_string())?;

    let svg = code.render::<svg::Color>().min_dimensions(256, 256).build();

    Ok(svg)
}

#[tauri::command]
fn scan_qr(bytes: Vec<u8>) -> Result<Vec<String>, String> {
    let img = image::load_from_memory(&bytes)
        .map_err(|e| format!("Could not read image: {e}"))?
        .to_luma8();

    let mut prepared = rqrr::PreparedImage::prepare(img);
    let grids = prepared.detect_grids();

    let results: Vec<String> = grids
        .into_iter()
        .filter_map(|grid| grid.decode().ok().map(|(_meta, content)| content))
        .collect();

    if results.is_empty() {
        return Err("No QR code found in this  image".into());
    }

    Ok(results)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![generate_qr, scan_qr])
        .run(tauri::generate_context!())
        .expect("error while running app");
}
