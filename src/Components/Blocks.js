import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APIContext } from '../Context';

const Blocks = () => {

    const [ blocks, setBlocks ] = useState([]);
    const { actions } = useContext(APIContext);

    useEffect(() => {
        const getBlocks = async () => {
            await actions.getBlocks()
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => setBlocks(data));
                    } else {
                        // handle error case
                    }
                    
                })
                .catch(error => console.log(error));
        };
        getBlocks();
    }, [actions]);

    return(
        <div className="container">
            <div className="blocks">
                <div className="blockrow">
                    <span className="blockrow-height">Block Height</span>
                    <span className="blockrow-time">Time</span>
                    <span className="blockrow-transactions">Transactions</span>
                    <span className="blockrow-size">Size(KB)</span>
                </div>
                {
                    blocks?
                        blocks.map((block, index) => <BlockRow key={index} block={block} />)
                    :
                        <span>Loading...</span>
                }
            </div>
        </div>
        
    );
};

function BlockRow({ block }){
    return (
        <div className="blockrow">
            <Link to={`/block/${block.id}`}><span className="blockrow-height">{block.height}</span></Link>
            <Link to={`/block/${block.id}`}><span className="blockrow-time">{ new Date(block.timestamp * 1000).toLocaleString() }</span></Link>
            <Link to={`/block/${block.id}`}><span className="blockrow-transactions">{block.tx_count}</span></Link>
            <Link to={`/block/${block.id}`}><span className="blockrow-size">{(block.size/1000).toFixed(2)}</span></Link>
        </div>
    );
    

    
}

export default Blocks;