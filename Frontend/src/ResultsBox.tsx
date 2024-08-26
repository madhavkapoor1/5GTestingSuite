import { useEffect, useState } from 'react';
import './ResultsBox.css';

export default function ResultsBox() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/files');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFiles(data.files);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]); // If there is an error, set files to empty
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchFiles();

    // Polling for updates every 5 seconds
    const interval = setInterval(fetchFiles, 5000); // Adjust the interval as needed

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='root3'>
      {loading ? (
        <p>Loading files...</p>
      ) : files.length === 0 ? (
        <p>No files available</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a href={`http://localhost:4000/download/${file}`} download>
                {file}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
