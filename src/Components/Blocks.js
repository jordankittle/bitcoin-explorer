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

    const loadMore = () => {
        console.log('Load more blocks');
    }

    return(
        <>
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
                            <div className="container">Loading...</div>
                    }
                </div>
            </div>
            <div className="container">
                <div className="load-more flex-between">
                    <span>
                        <a href="#" onClick={loadMore}>Load next 10 Blocks</a>
                    </span>
                </div>
            </div>
        </>
        
    );
};

function BlockRow({ block }){
    return (
        <div className="blockrow">
            <span className="blockrow-height"><Link to={`/block/${block.id}`}>{block.height}</Link></span>
            <span className="blockrow-time"><Link to={`/block/${block.id}`}>{ new Date(block.timestamp * 1000).toLocaleString() }</Link></span>
            <span className="blockrow-transactions"><Link to={`/block/${block.id}`}>{block.tx_count}</Link></span>
            <span className="blockrow-size"><Link to={`/block/${block.id}`}>{(block.size/1000).toFixed(2)}</Link></span>
        </div>
    );
    

    
}

export default Blocks;