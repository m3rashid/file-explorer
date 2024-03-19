import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { useLocation, useNavigate } from 'react-router-dom';

import { DriveContent } from '../types';

function DirectoryContents() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [driveContents, setDriveContents] = useState<DriveContent[]>([]);

  async function getFolderContents(dirPath: string) {
    const res = await invoke<DriveContent[]>('get_directory_contents', {
      dirPath: dirPath.split('/app')[1],
    });
    res.sort((a, _) => (a.is_dir ? -1 : 1));
    setDriveContents(res);
  }

  useEffect(() => {
    getFolderContents(pathname);
  }, [pathname]);

  return (
    <>
      <button onClick={() => navigate(-1)}>Go Back</button>

      <div className='m-0 p-4 max-h-[calc(100vh-24px)] min-h-[calc(100vh-24px)] overflow-y-auto flex flex-wrap bg-[#2f2f2f] gap-4'>
        {driveContents.map((driveFile) => {
          return (
            <div
              key={driveFile.name}
              onClick={() => navigate('/app' + driveFile.mount_point || '')}
              className={`cursor-pointer rounded-md p-1 flex flex-col items-center justify-center w-32 'bg-[#7b7b7b69]`}
            >
              <img
                width={100}
                height={100}
                src={driveFile.is_dir ? '/folder.ico' : '/file.ico'}
              />
              <p className='break-all text-center'>{driveFile.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DirectoryContents;
