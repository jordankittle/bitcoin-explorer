import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const APIContext = React.createContext();

export const Provider = (props) => {

    const history = useHistory();

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
            .catch(response => {
                response.status = 500;
                return response;
            })
        ;  
    };
    
    const getBlocks = async (height = null) => {
        if(height){
            const response =  await api(`/blocks/${height}`);
            return response;
        } else {
            const response =  await api('/blocks');
            return response;
        }
        
    };

    const getBlock = async (hash) => {
        const response =  await api(`/block/${hash}`);
        return response;
    };

    const getBlockHash = async (height) => {
        height = +height;
        const response = await api(`/block-height/${height}`);
        return response;
    };

    const getBlockTxIdsByIndex = async (hash, index=0) => {
        const response = await api(`/block/${hash}/txs/${index}`);
        return response;
    };

    const getAllBlockTxs = async (hash) => {
        const response = await api(`/block/${hash}/txids`);
        return response;
    };

    const getBlocksTip = async () => {
        const response = await api('/blocks/tip/height');
        return response;
    };

    const getTxById = async (txid) => {
        const response = await api(`/tx/${txid}`);
        return response;
    };

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
                getBlockTxIdsByIndex,
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