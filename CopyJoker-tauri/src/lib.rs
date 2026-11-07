#[tauri::command]
fn ping(name: &str) -> String {
    format!("Hello, {name}! Rust is working.")
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![ping])
    .run(tauri::generate_context!())
    .expect("error while running app");
}