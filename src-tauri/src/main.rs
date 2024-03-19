// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod drive;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      drive::list_all_drives,
      drive::get_directory_contents,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
