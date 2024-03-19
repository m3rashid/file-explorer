mod drive_types;
use std::fs;
use std::process::Command;

fn get_usable_drives(output: drive_types::LsblkJsonOutput) -> Vec<drive_types::Drive> {
  let mut drives: Vec<drive_types::Drive> = vec![];

  for device in output.blockdevices {
    match device.drive_type {
      None => (),
      Some(ref t) => {
        if t == "disk" {
          // drives.push(drive);
          // mount only the partitions, not the whole drive
          match device.children {
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
pub fn get_directory_contents(dir_path: &str) -> Vec<drive_types::DriveContent> {
  let mut drive_contents: Vec<drive_types::DriveContent> = Vec::new();
  match fs::read_dir(dir_path) {
    Err(_) => drive_contents,
    Ok(entries) => {
      for entry in entries {
        match entry {
          Err(_) => {}
          Ok(content) => drive_contents.push(drive_types::DriveContent {
            name: content.file_name().into_string().unwrap(),
            is_dir: content.path().is_dir(),
            mount_point: content.path().to_str().unwrap().to_owned(),
          }),
        }
      }
      return drive_contents;
    }
  }
}

#[tauri::command]
pub fn list_all_drives() -> Vec<drive_types::Drive> {
  let output = Command::new("lsblk")
    .args(&["--output-all", "--json"])
    .output()
    .expect("failed to execute lsblk");

  if output.status.success() {
    let json_data = String::from_utf8_lossy(&output.stdout);
    let disk_data: Result<drive_types::LsblkJsonOutput, serde_json::Error> =
      serde_json::from_str(&json_data);
    return match disk_data {
      Ok(d) => get_usable_drives(d),
      Err(_) => vec![],
    };
  }

  println!("Could not get drives from the host");
  vec![]
}
