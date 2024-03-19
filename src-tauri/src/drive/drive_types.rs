use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Drive {
  pub partlabel: Option<String>,

  pub name: Option<String>,

  pub path: Option<String>,

  pub size: Option<String>,

  #[serde(rename = "fssize")]
  pub fs_size: Option<String>,

  #[serde(rename = "fsused")]
  pub fs_size_used: Option<String>,

  #[serde(rename = "mountpoint")]
  pub mount_point: Option<String>,

  #[serde(rename = "fsavail")]
  pub fs_size_available: Option<String>,

  #[serde(rename = "fsuse%")]
  pub fs_used_percentage: Option<String>,

  #[serde(rename = "type")]
  pub drive_type: Option<String>,

  pub children: Option<Box<Vec<Drive>>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LsblkJsonOutput {
  pub blockdevices: Vec<Drive>,
}
