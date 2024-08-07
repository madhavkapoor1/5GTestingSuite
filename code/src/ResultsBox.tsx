import { useEffect, useState } from 'react';
import './ResultsBox.css';

export default function ResultsBox() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files');
        const data = await response.json();
        setFiles(data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className='root3'>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <a href={`/api/files/download/${file}`} download>
              {file}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
