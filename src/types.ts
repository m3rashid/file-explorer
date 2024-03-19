type Option<T> = T | null;

export type Drive = {
  name: Option<string>;
  partlabel: Option<string>;
  path: Option<string>;
  size: Option<string>;
  fssize: Option<string>;
  fsused: Option<string>;
  mountpoint: Option<string>;
  fsavail: Option<string>;
  'fsuse%': Option<string>;
  type: Option<string>;
  children: Option<Array<Drive>>;
};

export type DriveContent = {
  name: Option<string>;
  is_dir: boolean;
  mount_point: Option<string>;
};
