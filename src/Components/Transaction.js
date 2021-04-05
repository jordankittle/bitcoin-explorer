import { useState, useEffect, useContext } from 'react';
import { APIContext } from '../Context';
import { useParams, useHistory } from 'react-router-dom';

import Inputs from './Inputs';
import Outputs from './Outputs';

const Transaction = () => {

    const [ transaction, setTransaction ] = useState();
    const [ inputs, setInputs ] = useState();
    const [ outputs, setOutputs ] = useState();
    const { actions } = useContext(APIContext);
    const { txid } = useParams();

    const history = useHistory();

    useEffect(() => {
        const getTx = async () => {
            await actions.getTxById(txid)
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => {
                            setTransaction(data);
                            setInputs(data.vin.map((txin, index) => <div key={index}>{txin.is_coinbase?'Coinbase':<Inputs txin={txin} />}</div> ));
                            setOutputs(data.vout.map((txout, index) => <div key={index}>{<Outputs txout={txout} />}</div>)); 
                        })
                        .catch(error => console.log('unknown error', error));
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
        getTx();
    }, [actions, txid, history]);

    return (
        <div className="container">
            <div className="transaction-details">
                {
                    transaction?
                        <TxDetails transaction={transaction} inputs={inputs} outputs={outputs} />
                    :
                        <div className="container"><h2>Loading...</h2></div>
                }
            </div>
        </div>
    );
};

function TxDetails({ transaction, inputs, outputs }){
    return (
        <>
            <div className="txrow">
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Status:
                    </div>
                    <div className="txrow-value">
                        {transaction.status.confirmed ? "True" : "Unconfirmed"}
                    </div>
                </div>
                
            </div>
            <div className="txrow">
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Fee:
                    </div>
                    <div className="txrow-value">
                        {transaction.fee} sats
                    </div>
                </div>
            </div>
            <div className="txrow">
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Size:
                    </div>
                    <div className="txrow-value">
                        {transaction.size} B
                    </div>
                </div>
            </div>
            <div className="txrow">
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Inputs:
                    </div>
                    <div className="txrow-value">
                        {inputs}
                    </div>
                </div>
            </div>
            <div className="txrow">
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Outputs:
                    </div>
                    <div className="txrow-value">
                        {outputs}
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default Transaction;