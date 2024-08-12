import { useEffect, useState } from "react";
import "./StatusBox.css";

export default function StatusBox() {

    const [status, setStatus] = useState<string>('');
    
    useEffect(() => {
        // This is a mock implementation of a function that fetches the status of the tests
        const fetchStatus = async () => {
        const response = await fetch('http://localhost:3000/status');
        const data = await response.json();
        setStatus(data.status);
        };
    
        fetchStatus();
    }, []);
    
    return (
        <div className='root3'>
        <div className='status'>
            {status === '' ? 'Loading...' : status}
        </div>
        </div>
    );
}