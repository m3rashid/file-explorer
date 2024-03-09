// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod drive;

use drive::{Drive, LsblkJsonOutput};
use std::process::Command;
// use tauri::Manager;

fn get_usable_drives(output: LsblkJsonOutput) -> Vec<Drive> {
  let mut drives: Vec<Drive> = vec![];

  for drive in output.blockdevices {
    match drive.drive_type {
      None => (),
      Some(ref t) => {
        if t == "disk" {
          // drives.push(drive);
          // mount only the partitions, not the whole drive
          match drive.children {
            None => (),
            Some(t) => {
              for item in *t {
                drives.push(item)
              }
            }
          }
        }
      }
    }
  }

  drives
}

#[tauri::command]
fn list_drives() -> Vec<Drive> {
  let output = Command::new("lsblk")
    .args(&["--output-all", "--json"])
    .output()
    .expect("failed to execute lsblk");

  if output.status.success() {
    let json_data = String::from_utf8_lossy(&output.stdout);
    let disk_data: Result<LsblkJsonOutput, serde_json::Error> = serde_json::from_str(&json_data);
    return match disk_data {
      Ok(d) => get_usable_drives(d),
      Err(_) => vec![],
    };
  }

  println!("Could not get drives from the host");
  vec![]
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![list_drives])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
