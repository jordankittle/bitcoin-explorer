import { useState, useEffect, useContext } from 'react';
import { APIContext } from '../Context';
import { useParams } from 'react-router-dom';

const Transaction = () => {

    const [ transaction, setTransaction ] = useState();
    const { actions } = useContext(APIContext);
    const { txid } = useParams();

    useEffect(() => {
        console.log('calling');
        const getTx = async () => {
            await actions.getTxById(txid)
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => setTransaction(data));
                    } else {
                        // handle error case
                    }
                    
                })
                .catch(error => console.log(error));
        };
        getTx();
    }, [actions]);

    return (
        <div className="container">
            <div className="transaction-details">
                {
                    transaction?
                        <TxDetails transaction={transaction} />
                    :
                        <span>Loading...</span>
                }
            </div>
        </div>
    );
};

function TxDetails({ transaction }){
    return (
        <>
            <div className="txrow flex-between">
                <div className="txrow-property">
                    Status:
                </div>
                <div className="txrow-value">
                    {transaction.status.confirmed ? "True" : "Unconfirmed"}
                </div>
            </div>
            <div className="txrow flex-between">
                <div className="txrow-property">
                    Fee:
                </div>
                <div className="txrow-value">
                    {transaction.fee} sats
                </div>
            </div>
            <div className="txrow flex-between">
                <div className="txrow-property">
                    Size:
                </div>
                <div className="txrow-value">
                    {transaction.size} B
                </div>
            </div>
        </>
    );
}

export default Transaction;