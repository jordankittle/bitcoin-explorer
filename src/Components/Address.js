import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { APIContext } from '../Context';

const Address = () => {

    const [ addressInfo, setAddressInfo ] = useState();
    const { address } = useParams();
    const { actions } = useContext(APIContext);

    useEffect(() => {
        const getTx = async () => {
            await actions.getAddress(address)
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => {
                            setAddressInfo(data);
                        })
                        .catch(error => console.log('unknown error', error));
                    } else {
                        // handle error case
                    }
                    
                })
                .catch(error => console.log(error));
        };
        getTx();
    }, [actions, address]);

    return (
        <div className="container">
            <div className="transaction-details">
                {
                    addressInfo?
                        <AddressInfo addressInfo={addressInfo} />
                    :
                        <div className="container">Loading...</div>
                }
            </div>
        </div>
        
    );
};

function AddressInfo({ addressInfo }){
    return (
        <>
            <div className="txrow">
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Address:
                    </div>
                    <div className="txrow-value">
                        {addressInfo.address}
                    </div>
                </div>
                
            </div>
            <div className="txrow">
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Transactions:
                    </div>
                    <div className="txrow-value">
                        {addressInfo.chain_stats.tx_count}
                    </div>
                </div>
            </div>
            <div className="txrow">
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Received:
                    </div>
                    <div className="txrow-value">
                        {(addressInfo.chain_stats.funded_txo_sum/100000000).toFixed(8)} BTC
                    </div>
                </div>
            </div>
            <div className="txrow">
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Spent:
                    </div>
                    <div className="txrow-value">
                    {(addressInfo.chain_stats.spent_txo_sum/100000000).toFixed(8)} BTC
                    </div>
                </div>
            </div>
            <div className="txrow">
                <div className="txrow-row flex-between">
                    <div className="txrow-property">
                        Balance:
                    </div>
                    <div className="txrow-value">
                        {((addressInfo.chain_stats.funded_txo_sum - +addressInfo.chain_stats.spent_txo_sum)/10000000).toFixed(8)} BTC
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default Address;