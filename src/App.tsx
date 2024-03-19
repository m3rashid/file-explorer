import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

import { Drive } from './types';

function App() {
  const [drives, setDrives] = useState<Drive[]>([]);
  useEffect(() => {
    (async () => {
      setDrives(await invoke('list_all_drives'));
    })();
  }, []);

  return (
    <div className='m-0 h-screen flex flex-col justify-center items-center text-center bg-[#2f2f2f]'>
      <h1 className='mt-16 mb-8 font-bold text-5xl text-[#f6f6f6]'>
        File Explorer
      </h1>

      <div className='flex flex-1 flex-col justify-start text-left gap-2 select-none'>
        {drives.map((drive) => {
          const name = drive.partlabel || drive.name;
          return (
            <div
              key={name}
              className='flex flex-row justify-start align-middle items-center p-4 gap-2 cursor-default rounded-md hover:bg-[#7b7b7b69]'
            >
              <img
                width={64}
                height={64}
                src='/drive.ico'
                className='self-center'
              />

              <div className='p-0 m-0 flex flex-col'>
                <h1 className='text-[#f6f6f6]'>{name}</h1>
                <h4 className='mt-1 text-[#f6f6f6]'>
                  {drive.fsavail === null
                    ? 'Drive not mounted yet, click to mount'
                    : `${drive.fsavail} / ${drive.fssize} available (${drive.fsused} used)`}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
