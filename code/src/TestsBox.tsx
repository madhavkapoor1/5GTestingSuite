import { useState } from 'react';
import './TestsBox.css';

export default function TestsBox() {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Call the function to run the bash script based on the selected tests
    runTests(ipAddress, selectedTests);
  };

  const runTests = (ip: string, tests: string[]) => {
    // This function will run the appropriate bash script based on the selected tests
    console.log(`Running tests on IP: ${ip}`);
    tests.forEach((test) => {
      console.log(`Running ${test}`);
      // Implement the logic to run the bash script here
    });
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
                value='IPERF3'
                checked={selectedTests.includes('IPERF3')}
                onChange={handleTestChange}
              />
              iPerf3 Tests
            </label>
            <br />
            <label>
              <input
                type='checkbox'
                value='LATENCY'
                checked={selectedTests.includes('LATENCY')}
                onChange={handleTestChange}
              />
              ICMP Latency
            </label>
            <br />
            <label>
              <input
                type='checkbox'
                value='MTR'
                checked={selectedTests.includes('MTR')}
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
            {/* Add more test options as needed */}
          </div>

          <div className='SubmitButton'>
            <button type='submit'>Run Tests</button>
          </div>
        </form>
      </div>
    </>
  );
}
