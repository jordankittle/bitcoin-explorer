import { Link } from 'react-router-dom';

const TransactionRow = ({ transaction, blockTipHeight }) => (
    <div className="txrow">
        <div className="txrow-labels">
            <div>
                TxID:
            </div>
            <div>
                Amount:
            </div>
            <div>
                Confirmations:
            </div>
        </div>
        <div className="txrow-data">
            <div>
                {transaction.txid}
            </div>
            <div>
                {(transaction.vout.reduce((acc, txout) => (txout.value/100000000) + acc, 0)).toFixed(8)} BTC
            </div>
            <div>
                {+blockTipHeight - transaction.status.block_height + 1}
            </div>
        </div>
    </div>
    
    
);

export default TransactionRow;