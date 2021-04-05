import { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { APIContext } from '../Context';

const Address = () => {

    const [ addressInfo, setAddressInfo ] = useState();
    const { address } = useParams();
    const { actions } = useContext(APIContext);

    const history = useHistory();

    // Set Address Info to state
    useEffect(() => {
        const getTx = async () => {
            await actions.getAddress(address)
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => {
                            setAddressInfo(data);
                        })
                        .catch(error => console.log('unknown error', error));
                    } else if(response.status === 404) {
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
    }, [actions, address, history]);

    return (
        <div className="container">
            <div className="transaction-details">
                {
                    addressInfo?
                        <AddressInfo addressInfo={addressInfo} />
                    :
                        <div className="container"><h2>Loading...</h2></div>
                }
            </div>
        </div>
        
    );
};

// Display all address information in state
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