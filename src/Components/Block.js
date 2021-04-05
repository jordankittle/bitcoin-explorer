import { useState, useContext, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { APIContext } from '../Context';

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
                                <Transactions transactions={transactions} blockTipHeight={blockTipHeight} />
                        </div>
                        <div className="container">
                            <div className="load-more flex-between">
                                <span>
                                    Load next 25 Transactions
                                </span>
                                <span>
                                    <Link to={`/block/${hash}/all`}>Load All Transactions</Link>
                                </span>
                            </div>
                            
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

function TransactionRow({ transaction, blockTipHeight }){

    const [ collapsed, setCollapsed ] = useState(true);
    const [ confirmations, setConfirmations ] = useState(() => {
        return +blockTipHeight - transaction.status.block_height + 1;
    });
    const [ amount, setAmount ] = useState(() => {
        return transaction.vout.reduce((acc, txout) => (txout.value/100000000) + acc, 0).toFixed(8);
    });

    const [ inputs, setInputs ] = useState(() => {
        return transaction.vin.map((txin, index) => <div key={index}>{txin.is_coinbase?'Coinbase':<Inputs txin={txin} />}</div> );
    });

    const [ outputs, setOutputs ] = useState(() => {
        return transaction.vout.map((txout, index) => <div key={index}>{<Outputs txout={txout} />}</div>);
    });

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
                        {transaction.txid}
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
                    <div className="txrow-proprety">
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
                    <>
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
                    </>
                }
            </div>
            <div className="txrow-toggle">
                    {
                        collapsed?
                            <div>
                                <a href="#" onClick={(e) => toggle(e, false)}>Show More</a>
                            </div>
                        :
                            <div>
                                <a href="#" onClick={(e) => toggle(e, true)}>Show Less</a>
                            </div>
                    }
                    
            </div>
            
        </div>
    );
}

function Inputs({ txin }) {

    return(
        <div>
            <div className="txin-left">
                {txin.prevout.scriptpubkey_address}
            </div>
            <div className="txin-right">
                <div className="flex-around">
                    <span>
                        {(txin.prevout.value/100000000).toFixed(8)}
                    </span>
                    <span>
                        BTC
                    </span>
                </div>
            </div>                   
        </div>

    );
}

function Outputs({ txout }) {

    return(
        <div>
            <div className="txout-left">
                {txout.scriptpubkey_address}
            </div>
            <div className="txout-right">
                <div className="flex-around">
                    <span>
                        {(txout.value/100000000).toFixed(8)}
                    </span>
                    <span>
                        BTC
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Block;