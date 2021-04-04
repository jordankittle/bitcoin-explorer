import { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { APIContext } from '../Context';

const Header = ()  => {

    const [ search, setSearch ] = useState('');
    const { actions } = useContext(APIContext);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(search.match(/^[0-9]+$/) ){
            await actions.getBlockHash(search)
                .then(response => {
                    if(response.status === 200){
                        response.text().then(data => history.push(`/block/${data}`) );
                    } else {
                        //handle error
                    }
                })
                .catch(error => console.log(error));
            
        }     
    };

    const change = (e) => {
        setSearch(e.target.value);
    };

    return (
        <header>
            <div className="wrap header-flex">
                <h1 className="header-logo">
                    <Link to="/">Bitcoin Explorer</Link>
                </h1>
                <nav>
                    <ul className="header-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/">About</Link></li>                       
                    </ul>
                </nav>
            </div>
            <div className="search">
                <form onSubmit={handleSubmit}>
                    <input type="text" id="search" onChange={change} placeholder="Search by Block Height, Block Hash, TxID, or Address"></input>
                </form>
            </div>
        </header>
    );
};

export default Header;