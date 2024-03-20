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
      <div className='p-2 bg-[#7b7b7b69]'>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>

      <div className='m-0 p-4 overflow-y-auto flex flex-wrap bg-[#2f2f2f] gap-4'>
        {driveContents.map((driveFile) => {
          const displayName = driveFile.name?.substring(0, 10) || '';
          return (
            <div
              key={driveFile.name}
              onClick={() => {
                if (!driveFile.is_dir) return;
                navigate('/app' + driveFile.mount_point || '');
              }}
              className='cursor-pointer rounded-md p-1 flex flex-col items-center justify-center w-32 h-32 bg-[#7b7b7b69]'
            >
              <img
                width={driveFile.is_dir ? 100 : 60}
                height={driveFile.is_dir ? 100 : 60}
                src={driveFile.is_dir ? '/folder.ico' : '/file.ico'}
              />
              <p className='break-all text-center'>
                {displayName + (displayName !== driveFile.name ? '...' : '')}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DirectoryContents;
