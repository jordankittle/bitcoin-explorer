import { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { APIContext } from '../Context';

const Blocks = () => {

    const [ blocks, setBlocks ] = useState();
    const [ index, setIndex ] = useState();
    const { actions } = useContext(APIContext);

    const history = useHistory();

    // Get latest 10 blocks and block tip height and set to state
    useEffect(() => {
        const getBlocks = async () => {
            await actions.getBlocks()
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => {
                            setBlocks(data);
                            setIndex(data[0].height)
                        });
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
        getBlocks();
    }, [actions, history]);

    const loadMore = async (e) => {
        await actions.getBlocks(index - 10)
            .then(response => {
                if(response.status === 200){
                    response.json().then(data => setBlocks(prevBlocks => [...prevBlocks,...data]))
                } else if(response.status === 404) {
                    history.push('/not-found');
                } else if(response.status === 500){
                    history.push('/error');
                } else {
                    throw new Error('An unknown error has occured');
                }
            })
        ;
        setIndex(prevIndex => prevIndex -  10);
    }

    return(
        <>
            <div className="container">
                <div className="blocks">
                    <div className="blockrow blockrow-title">
                        <span className="blockrow-height">Block Height</span>
                        <span className="blockrow-time">Time</span>
                        <span className="blockrow-transactions">Transactions</span>
                        <span className="blockrow-size">Size(KB)</span>
                    </div>
                    {
                        blocks?
                            blocks.map((block, index) => <BlockRow key={index} block={block} />)
                        :
                            <div className="container">Loading...</div>
                    }
                </div>
            </div>
            <div className="container">
                <div className="load-more flex-evenly">
                    <span>
                        <button onClick={loadMore}>Load next 10 Blocks</button>
                    </span>
                </div>
            </div>
        </>
        
    );
};

function BlockRow({ block }){
    return (
        <Link to={`/block/${block.id}`}>
            <div className="blockrow">
                <span className="blockrow-height">{block.height}</span>
                <span className="blockrow-time">{ new Date(block.timestamp * 1000).toLocaleString() }</span>
                <span className="blockrow-transactions">{block.tx_count}</span>
                <span className="blockrow-size">{(block.size/1000).toFixed(2)}</span>
            </div>
        </Link>
    );
    

    
}

export default Blocks;