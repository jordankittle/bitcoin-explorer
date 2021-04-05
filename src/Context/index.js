import React from 'react';

export const APIContext = React.createContext();

export const Provider = (props) => {

    // handle API calls then return the response
    const api = (path, method = 'GET', body = null) => {
        const url = 'https://blockstream.info/api' + path;
        const options = {
            method,
        };
        
        if(body !== null){
            options.body = JSON.stringify(body);
        }

        return fetch(url, options)
            .then(response => response)
            .catch(err => {
                console.error(err);
            });  
    };
    
    // Get 10 newest blocks or starting at block height if specififed 
    const getBlocks = async (height = null) => {
        if(height){
            const response =  await api(`/blocks/${height}`);
            return response;
        } else {
            const response =  await api('/blocks');
            return response;
        }
        
    };

    // Get block by block hash
    const getBlock = async (hash) => {
        const response =  await api(`/block/${hash}`);
        return response;
    };

    // Get block hash by height
    const getBlockHash = async (height) => {
        height = +height;
        const response = await api(`/block-height/${height}`);
        return response;
    };

    // Get up to 25 transactions starting at index
    const getBlockTxsByIndex = async (hash, index=0) => {
        const response = await api(`/block/${hash}/txs/${index}`);
        return response;
    };

    // Get all transactions in a block by block hash
    const getAllBlockTxs = async (hash) => {
        const response = await api(`/block/${hash}/txids`);
        return response;
    };

    // Get the latest block tip height
    const getBlocksTip = async () => {
        const response = await api('/blocks/tip/height');
        return response;
    };

    // Get transaction info by transaction ID
    const getTxById = async (txid) => {
        const response = await api(`/tx/${txid}`);
        return response;
    };

    // Get address info for a specific Bitcoin address
    const getAddress = async (address) => {
        const response = await api(`/address/${address}`);
        return response;
    };

    

    return(
        <APIContext.Provider value={{
            actions: {
                getBlocks,
                getBlock,
                getBlockHash,
                getBlockTxsByIndex,
                getAllBlockTxs,
                getBlocksTip,
                getTxById,
                getAddress,
            }
        }}>
        { props.children }

        </APIContext.Provider>
    );
};