import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TransactionRow = ({ transaction, blockTipHeight }) => {

    const [ collapsed, setCollapsed ] = useState(true);
    const [ confirmations, setConfirmations ] = useState(() => {
        return +blockTipHeight - transaction.status.block_height + 1;
    });
    const [ amount, setAmount ] = useState(() => {
        return transaction.vout.reduce((acc, txout) => (txout.value/100000000) + acc, 0).toFixed(8);
    });

    // const [ inputs, setInputs ] = useState(() => {
    //     ;
    // });

    const [ outputs, setOutputs ] = useState(() => {
        return transaction.vout.map((txout, index) => <Outputs key={index} txout={txout} />);
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
                                {transaction.vin.map((txin, index) => <div key={index}>{txin.is_coinbase?'Coinbase':<Inputs txin={txin} />}</div> )}
                            </div>
                        </div>
                        <div className="txrow-row flex-between">
                            <div className="txrow-property">
                                Outputs:
                            </div>
                            <div className="txrow-value">
                                {transaction.vout.map((txout, index) => <div key={index}>{<Outputs txout={txout} />}</div>)}
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

    // return(
    //     <div className="txrow">
    //         <div className="txrow-labels">
    //             <div>
    //                 TxID:
    //             </div>
    //             <div>
    //                 Amount:
    //             </div>
    //             <div>
    //                 Confirmations:
    //             </div>
    //             {
    //                 collapsed?
    //                     null
    //                 :
    //                     <>
    //                         <div>
    //                             Inputs:
    //                         </div>
    //                         {
    //                             transaction.vin.map((txin, index, arr) => index == arr.length -1 ? null : <br key={index} />)
    //                         }
    //                         <div>
    //                             Outputs:
    //                         </div>
    //                     </>
    //             }
                
    //         </div>
    //         <div className="txrow-data">
    //             <div>
    //                 {transaction.txid}
    //             </div>
    //             <div>
    //                 {(transaction.vout.reduce((acc, txout) => (txout.value/100000000) + acc, 0)).toFixed(8)} BTC
    //             </div>
    //             <div>
    //                 {+blockTipHeight - transaction.status.block_height + 1}
    //             </div>
    //             {
    //                 collapsed?
    //                     null
    //                 :
    //                     <>
    //                         <div>
    //                             {transaction.vin.map((txin, index) => <div key={index}>{txin.is_coinbase?'Coinbase':<Inputs txin={txin} />}</div> )}   
    //                         </div>
    //                         <div>
    //                             {transaction.vout.map((txout, index) => <div key={index}>{<Outputs txout={txout} />}</div>)}
    //                         </div>
    //                     </>
    //             }
    //         </div>
            // <div className="txrow-toggle">
            //     {
            //         collapsed?
            //             <div>
            //                 <a href="#" onClick={(e) => toggle(e, false)}>Show More</a>
            //             </div>
            //         :
            //             <div>
            //                 <a href="#" onClick={(e) => toggle(e, true)}>Show Less</a>
            //             </div>
            //     }
                
            // </div>
    //     </div>
    // );
    
    
    
};

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

export default TransactionRow;