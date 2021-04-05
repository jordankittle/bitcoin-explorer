import { useState, useContext, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { APIContext } from '../Context';

import Inputs from './Inputs';
import Outputs from './Outputs';

const Block = () => {

    const [ block, setBlock ] = useState();
    const [ transactions, setTransactions ] = useState([]);
    const [ index, setIndex ] = useState(25);
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
                    } else if(response.status === 400) {
                        history.push('/not-found');
                    } else if(response.status === 500){
                        history.push('/error');
                    } else {
                        throw new Error('An unknown error has occured');
                    }
                    
                })
                .catch(error => console.log(error));
            await actions.getBlockTxsByIndex(hash, 0)
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => setTransactions(data));
                    } else if(response.status === 400) {
                        history.push('/not-found');
                    } else if(response.status === 500){
                        history.push('/error');
                    } else {
                        throw new Error('An unknown error has occured');
                    }
                })
                .catch(error => console.log(error));
            await actions.getBlocksTip()
                .then(response => {
                    if(response.status === 200){
                        response.text().then(data => setBlockTipHeight(data));
                    } else if(response.status === 400) {
                        history.push('/not-found');
                    } else if(response.status === 500){
                        history.push('/error');
                    } else {
                        throw new Error('An unknown error has occured');
                    }
                })
                .catch(error => console.log(error));
        };
        getBlock();
    }, [actions, hash, history]);

    // Load the next
    const loadMore = async (e) => {
        await actions.getBlockTxsByIndex(hash, index)
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => setTransactions(prevTransactions => [...prevTransactions,...data]));
                    } else if(response.status === 400) {
                        history.push('/not-found');
                    } else if(response.status === 500){
                        history.push('/error');
                    } else {
                        throw new Error('An unknown error has occured');
                    }
                })
        setIndex(prevIndex => prevIndex +  25);
    }

    return(
        <div className="block">
            {
                block && transactions && blockTipHeight?
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
                                {
                                    transactions?
                                        <Transactions transactions={transactions} blockTipHeight={blockTipHeight} />
                                    :
                                        null
                                }
                                
                        </div>
                        <div className="container">
                            <div className="load-more flex-between">
                                <span>
                                    <button onClick={loadMore}>Load next 25 Transactions</button>
                                </span>
                                <span>
                                    <button onClick={() => history.push(`/block/${hash}/all`)}>Load All Transactions</button>
                                </span>
                            </div>
                            
                        </div>
                    </>
                :
                    <div className="container"><h2>Loading...</h2></div>
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

function TransactionRow({ transaction, blockTipHeight }){

    const [ collapsed, setCollapsed ] = useState(true);
    const [ confirmations, setConfirmations ] = useState();
    const [ amount, setAmount ] = useState();
    const [ inputs, setInputs] = useState();
    const [ outputs, setOutputs ] = useState();

    useEffect(() => {
        setConfirmations(+blockTipHeight - transaction.status.block_height + 1);
        setAmount(transaction.vout.reduce((acc, txout) => (txout.value/100000000) + acc, 0).toFixed(8));
        setInputs(transaction.vin.map((txin, index) => <div key={index}>{txin.is_coinbase?'Coinbase':<Inputs txin={txin} />}</div> ));
        setOutputs(transaction.vout.map((txout, index) => <div key={index}>{<Outputs txout={txout} />}</div>));
    },[setConfirmations, setAmount, setInputs, setOutputs, blockTipHeight, transaction.status.block_height, transaction.vin, transaction.vout]);

    const toggle = (e, value) => {
        e.preventDefault();
        setCollapsed(value);
    };

    return(
        <div className="txrow">
            <div>
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        TxID:
                    </div>
                    <div className="txrow-value">
                        <Link to={`/tx/${transaction.txid}`}>
                            {transaction.txid}
                        </Link>
                    </div>
                </div>
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Amount:
                    </div>
                    <div className="txrow-value">
                        {amount} BTC
                    </div>
                </div>
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Confirmations:
                    </div>
                    <div className="txrow-value">
                        {confirmations}
                    </div>
                </div>
                {
                    collapsed?
                    null
                    :
                    <div className="multiline">
                        <div className="txrow-row flex-between">
                            <div className="txrow-property">
                                Inputs:
                            </div>
                            <div className="txrow-value">
                                {inputs}
                            </div>
                        </div>
                        <div className="txrow-row flex-between">
                            <div className="txrow-property">
                                Outputs:
                            </div>
                            <div className="txrow-value">
                                {outputs}
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="txrow-toggle">
                    {
                        collapsed?
                            <div>
                                <button onClick={(e) => toggle(e, false)}>Show More</button>
                            </div>
                        :
                            <div>
                                <button onClick={(e) => toggle(e, true)}>Show Less</button>
                            </div>
                    }
                    
            </div>
            
        </div>
    );
}

export default Block;