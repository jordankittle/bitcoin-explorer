import { Link } from 'react-router-dom';

function Inputs({ txin }) {

    return(
        <div className="multiline">
            <div className="txin-left">
                <Link to={`/address/${txin.prevout.scriptpubkey_address}`}>
                    {txin.prevout.scriptpubkey_address}
                </Link>
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
export default Inputs;