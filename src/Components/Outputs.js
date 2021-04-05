import { Link } from 'react-router-dom';

function Outputs({ txout }) {

    return(
        <div className="multiline">
            <div className="txout-left">
            <Link to={`/address/${txout.scriptpubkey_address}`}>
                {txout.scriptpubkey_address}
            </Link>
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
export default Outputs;