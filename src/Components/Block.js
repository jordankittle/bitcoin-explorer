import { useState, useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { APIContext } from '../Context';

import TransactionRow from './TransactionRow';


const Block = () => {

    const [ block, setBlock ] = useState();
    const [ transactions, setTransactions ] = useState();
    const [ txIndex, setTxIndex ] = useState(0);
    const [ blockTipHeight, setBlockTipHeight ] = useState();
    const { actions } = useContext(APIContext);
    const { hash } = useParams();
    const history = useHistory();

    useEffect(() => {
        const getBlock = async () => {
            await actions.getBlock(hash)
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => setBlock(data));
                    } else {
                        // handle error case
                    }
                    
                })
                .catch(error => console.log(error));
            await actions.getBlockTxIdsByIndex(hash, txIndex)
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => setTransactions(data));
                    } else {
                        // handle error case
                    }
                })
                .catch(error => console.log(error));
            await actions.getBlocksTip()
                .then(response => {
                    if(response.status === 200){
                        response.text().then(data => setBlockTipHeight(data));
                    } else {
                        //handle error case
                    }
                })
                .catch(error => console.log(error));
        };
        getBlock();
    }, [actions, hash]);

    return(
        <div className="block">
            {
                block?
                    <>
                        <div className="container">
                            <div className="block-details">
                                <div className="block-detail-labels">
                                    <div>Block Height:</div>
                                    <div>Time:</div>
                                    <div>Transactions:</div>
                                    <div>Size (KB):</div>
                                </div>
                                <div className="block-detail-data">
                                    <div>{block.height}</div>
                                    <div>{new Date(block.timestamp * 1000).toLocaleString()}</div>
                                    <div>{block.tx_count}</div>
                                    <div>{(block.size/1000).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                                <Transactions transactions={transactions} blockTipHeight={blockTipHeight} />
                        </div>
                    </>
                :
                    <span>Loading...</span>
            }
        </div>
    );
};

function Transactions({ transactions, blockTipHeight }){

    return(
        <div className="transaction-list">
            {
                transactions? 
                transactions.map((transaction, index) => <TransactionRow key={index} transaction={transaction} blockTipHeight={blockTipHeight} />)
            :
                <span>Loading...</span>
            }
            
        </div>
    );
}

export default Block;