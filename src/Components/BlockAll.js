import { useState, useContext, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { APIContext } from '../Context';


const BlockAll = () => {

    const [ block, setBlock ] = useState();
    const [ transactions, setTransactions ] = useState();
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
            await actions.getAllBlockTxs(hash)
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
                                <TransactionsAll transactions={transactions} blockTipHeight={blockTipHeight} />
                        </div>
                    </>
                :
                    <div className="container"><h2>Loading...</h2></div>
            }
        </div>
    );
};

function TransactionsAll({ transactions, blockTipHeight }){

    return(
        <div className="transaction-list transaction-list-spaced">
            {
                transactions? 
                    transactions.map((transaction, index) => 
                        <div key={index}>
                                {`${index+1}.) `}<Link to={`/tx/${transaction}`}>{`${transaction}`}</Link>
                        </div> )
            :
                <span>Loading...</span>
            }
            
        </div>
    );
}

export default BlockAll;