import { useEffect, useState } from "react";
import "./StatusBox.css";

export default function StatusBox() {
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchLog = async () => {
    try {
      const response = await fetch("http://localhost:4000/teststatus");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.text();
      const logLines = data.split('\n').filter(line => line.trim() !== ""); // Filter out empty lines
      setLog(logLines);
      setLoading(false);
      setError(false); // Reset error state if fetching is successful
    } catch (error) {
      console.error("Failed to fetch test status:", error);
      setLog([]); // Set log to empty if there's an error
      setLoading(false);
      setError(true); // Set error state to true
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLog();

    // Polling for updates every 5 seconds
    const interval = setInterval(fetchLog, 5000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="root3">
      <div className="status">
        <h2>Status</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error || log.length === 0 ? ( // Check if there's an error or if log is empty
          <p>No status</p>
        ) : (
          <ul>
            {log.map((line, index) => (
              <li key={index}>{line}</li> // Render each line as a list item
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
