import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

import { Drive } from './types';

function App() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const drives: Drive[] = await invoke('list_drives');
      console.log(drives);
      setDrives(drives);
    })();
  }, []);

  return (
    <div className='container'>
      <h1>File Explorer</h1>

      <div className='drives noselect'>
        {drives.map((drive) => {
          const name = drive.partlabel || drive.name;
          return (
            <div
              key={name}
              className='drive'
              data-selected={selectedDrive === name}
              onClick={() => setSelectedDrive(name)}
            >
              <img src='/drive.ico' alt='Drive' />
              <div>
                <h1>{name}</h1>
                <h4>{`${drive.fsavail} / ${drive.fssize} available (${drive.fsused} used)`}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
