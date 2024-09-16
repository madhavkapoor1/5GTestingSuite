import { useState, useEffect, useRef } from 'react';
import './TestsBox.css';

export default function TestsBox() {

  const [ipAddress, setIpAddress] = useState<string>('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [repeatMode, setRepeatMode] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false); // Track if tests are currently running
  const shouldContinue = useRef<boolean>(true); // Use this to control the repeat loop

  const handleIpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(event.target.value);
  };

  const handleTestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const test = event.target.value;
    setSelectedTests((prevSelectedTests) =>
      prevSelectedTests.includes(test)
        ? prevSelectedTests.filter((t) => t !== test)
        : [...prevSelectedTests, test]
    );
    if (test === 'repeat') {
      setRepeatMode(!repeatMode); // Toggle repeat mode
    }
  };

  const runTest = async (test: string) => {
    const url = new URL(`http://localhost:4000/${test}`);
    url.searchParams.append('ip', ipAddress);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Test ${test} failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Test ${test} completed successfully:`, data);
      // Update the UI to display the success result

      // If repeat mode is enabled, rerun the test
      if (repeatMode && shouldContinue.current) {
        runTest(test); // Recursive call for continuous testing
      }
    } catch (error: any) {
      console.error(`Test ${test} failed:`, error.message);
      // Update the UI to display the error message

      // If repeat mode is enabled, rerun the test even after an error
      if (repeatMode && shouldContinue.current) {
        runTest(test); // Recursive call for continuous testing
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ipAddress) {
      alert("Please enter an IP address.");
      return;
    }

    setIsRunning(true); // Set running state to true when tests start
    shouldContinue.current = true; // Allow tests to run

    // Start each test independently
    selectedTests.filter(test => test !== 'repeat').forEach(test => {
      runTest(test);
    });
  };

  const handleStopTests = () => {
    setIsRunning(false); // Set running state to false
    shouldContinue.current = false; // Stop further tests
  };

  useEffect(() => {
    // Cleanup logic if component unmounts
    return () => {
      shouldContinue.current = false; // Ensure the repeat loop stops on unmount
    };
  }, []);

  return (
    <>
      <div className='root2'>
        <form onSubmit={handleSubmit}>
          <div className='IP'>
            <label>
              Target IP Address:
              <input
                type='text'
                value={ipAddress}
                onChange={handleIpChange}
                placeholder='Enter IP Address'
              />
            </label>
          </div>

          <div className='TestOptions'>
            <h3>Test Options</h3>
            <label>
              <input
                type='checkbox'
                value='iperf3'
                checked={selectedTests.includes('iperf3')}
                onChange={handleTestChange}
              />
              iPerf3 Tests
            </label>
            <br />
            <label>
              <input
                type='checkbox'
                value='ping'
                checked={selectedTests.includes('ping')}
                onChange={handleTestChange}
              />
              ICMP Latency
            </label>
            <br />
            <label>
              <input
                type='checkbox'
                value='TCP'
                checked={selectedTests.includes('TCP')}
                onChange={handleTestChange}
              />
              TCP Latency
            </label>
            <br />
            <label>
              <input
                type='checkbox'
                value='mtr'
                checked={selectedTests.includes('mtr')}
                onChange={handleTestChange}
              />
              MyTraceRoute
            </label>
            <br />
            <label>
              <input
                type='checkbox'
                value='OOKLA'
                checked={selectedTests.includes('OOKLA')}
                onChange={handleTestChange}
              />
              Ookla 5G SpeedTest
            </label>
            <br />
            <label>
              <input
                type='checkbox'
                value='GPS'
                checked={selectedTests.includes('GPS')}
                onChange={handleTestChange}
              />
              Include GPS Coordinates
            </label>
            <br />
            <label>
              <input
                type='checkbox'
                value='repeat'
                checked={repeatMode}
                onChange={handleTestChange}
              />
              Repeat Mode
            </label>
            <br />
          </div>

          <div className='SubmitButton'>
            <button type='submit'>Run Tests</button>
            {isRunning && (
              <button type='button' onClick={handleStopTests}>
                Stop Tests
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
