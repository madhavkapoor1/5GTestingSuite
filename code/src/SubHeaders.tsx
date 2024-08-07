import './SubHeaders.css'
import TestsBox from './TestsBox'
import StatusBox from './StatusBox'
import ResultsBox from './ResultsBox'

function SubHeaders() {
    return (
    <>
        <div className='root'>

            <div className='subheading'>
                <h2>Test Options</h2>
                <TestsBox />
            </div>
            
            <div className='subheading'>
                <h2>Status</h2>
                <StatusBox />  
            </div>
            
            <div className='subheading'>
                <h2>Results</h2>
                <ResultsBox />
            </div>
        
        </div>
    </>
    )
}

export default SubHeaders