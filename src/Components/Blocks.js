import { useState, useContext, useEffect } from 'react';
import { APIContext } from '../Context';

import BlockRow from './BlockRow';

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

export default Blocks;