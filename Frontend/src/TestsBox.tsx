import { useState } from 'react';
import './TestsBox.css';

export default function TestsBox() {

  type TestResult = 
  | { test: string; data: any; } 
  | { test: string; error: string; };
  
  const [ipAddress, setIpAddress] = useState<string>('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

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
  };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!ipAddress) {
    alert("Please enter an IP address.");
    return;
  }

  const testPromises = selectedTests.map((test) => {
    const url = new URL(`http://localhost:4000/${test}`);
    url.searchParams.append('ip', ipAddress);

    return fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Test ${test} failed with status: ${response.status}`);
      }
      const data = await response.json();
      return { test, data };  // return an object with a 'data' property
    })
    .catch((error) => {
      return { test, error: error.message };  // return an object with an 'error' property
    });
  });

  try {
    const results: TestResult[] = await Promise.all(testPromises);

    // Use type guards to handle different result types
    results.forEach((result) => {
      if ('data' in result) {
        console.log(`Test ${result.test} completed successfully:`, result.data);
        // Update the UI to display the success result
      } else if ('error' in result) {
        console.error(`Test ${result.test} failed:`, result.error);
        // Update the UI to display the error message
      }
    });

    //setTestResults(results);  // Update the state with the results
  } catch (err) {
    console.error('An error occurred while running tests:', err);
  }
};



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
                value='5GPARAMS'
                checked={selectedTests.includes('5GPARAMS')}
                onChange={handleTestChange}
              />
              5G Signal Parameters
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
          </div>

          <div className='SubmitButton'>
            <button type='submit'>Run Tests</button>
          </div>
        </form>
      </div>
    </>
  );
}
