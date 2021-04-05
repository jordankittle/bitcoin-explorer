import { Link } from 'react-router-dom';

const BlockRow = ({ block }) => (
    
    <div className="blockrow">
        
        <Link to={`/block/${block.id}`}><span className="blockrow-height">{block.height}</span></Link>
        <Link to={`/block/${block.id}`}><span className="blockrow-time">{ new Date(block.timestamp * 1000).toLocaleString() }</span></Link>
        <Link to={`/block/${block.id}`}><span className="blockrow-transactions">{block.tx_count}</span></Link>
        <Link to={`/block/${block.id}`}><span className="blockrow-size">{(block.size/1000).toFixed(2)}</span></Link>
    </div>

    
);

export default BlockRow;