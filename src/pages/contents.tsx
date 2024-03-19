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
    res.sort((a, b) => (a.is_dir ? -1 : 1));
    setDriveContents(res);
  }

  useEffect(() => {
    getFolderContents(pathname);
  }, [pathname]);

  return (
    <>
      <button onClick={() => navigate(-1)}>Go Back</button>

      <div className='m-0 p-4 max-h-[calc(100vh-24px)] min-h-[calc(100vh-24px)] overflow-y-auto flex flex-col bg-[#2f2f2f] gap-4'>
        {driveContents.map((driveFile) => {
          return (
            <div
              key={driveFile.name}
              onClick={() => navigate('/app' + driveFile.mount_point || '')}
              className={`cursor-pointer rounded-md w-full p-1 pl-6 flex ${
                driveFile.is_dir ? 'bg-[#7b7b7b69]' : ''
              }`}
            >
              {driveFile.name + '  ' + driveFile.mount_point}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DirectoryContents;
