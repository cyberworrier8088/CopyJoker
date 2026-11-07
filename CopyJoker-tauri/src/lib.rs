use qrcode::render::svg;
use qrcode::QrCode;

#[tauri::command]
fn generate_qr(text: String) -> Result<String, String> {

  if text.trim().is_empty() {
    return Err("Enter Some Text first".into());
  } 

  let code = QrCode::new(text.as_bytes()).map_err(|e| e.to_string())?;

  let svg = code
    .render::<svg::Color>()
    .min_dimensions(256, 256)
    .build();

  Ok(svg)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![generate_qr])
    .run(tauri::generate_context!())
    .expect("Errror while running app");
}