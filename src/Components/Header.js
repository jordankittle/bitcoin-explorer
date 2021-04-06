import { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { APIContext } from '../Context';
import  useWindowSize from '../Hooks/useWindowSize';

const Header = ()  => {

    const [ menu, setMenu ] = useState(false);
    const [ search, setSearch ] = useState('');
    const { actions } = useContext(APIContext);
    const { width } = useWindowSize();

    const history = useHistory();

    // Check search query and handled appropriately
    // There is a very small possibility a transaction hash will be queried as a block hash - unsure how to handle this
    const handleSubmit = async (e) => {
        e.preventDefault();
        const query = search.replace(/\s+/g, '');
        if( query.match(/^[0-9]+$/) ){
            await actions.getBlockHash(query)
                .then(response => {
                    if(response.status === 200){
                        response.text().then(data => history.push(`/block/${data}`) );
                    } else if(response.status === 404) {
                        history.push('/not-found');
                    } else if(response.status === 500){
                        history.push('/error');
                    } else {
                        throw new Error('An unknown error has occured');
                    }
                })
                .catch(error => console.log(error));
            
        } else if( query.match(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{14,74}$/) ){
            history.push(`/address/${query}`);
        } else if (query.match(/^[0]{8}[a-fA-F0-9]{56}$/)){
            history.push(`/block/${query}`);
        } else if(query.match(/^[a-fA-F0-9]{64}$/)){
            history.push(`/tx/${query}`);
        } else {
            console.log('Invalid search');
        }
        setSearch('');     
    };

    // Update search form state
    const change = (e) => {
        setSearch(e.target.value);
    };

    // Hide and show menu
    const toggleBurger = (e) => {
        e.preventDefault();
        setMenu(menu ? false : true);
    };

    return (
        <header>
            <div className="wrap header-flex">
                <h1 className="header-logo">
                    <Link to="/">Bitcoin Explorer</Link>
                </h1>
                <nav>
                    {
                        width > 768 || menu ?
                                <ul className="header-links">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/about">About</Link></li>                       
                                </ul>
                            :
                                null
                    }
                    {
                        <div className="burger">
                            <a href="/" onClick={toggleBurger}>
                                <div className="burgerDiv" ></div>
                                <div className="burgerDiv" ></div>
                                <div className="burgerDiv" ></div>
                            </a>
                        </div>
                    }
                    
                    
                </nav>
            </div>
            <div className="search">
                <form className="searchform" onSubmit={handleSubmit}>
                    <label htmlFor="search"></label>
                    <input type="text" id="search" name="search" value={search} onChange={change} placeholder="Search by Block Height, Block Hash, TxID, or Address"></input>
                    <button type="submit"><i class="fa fa-search"></i></button>
                </form>
            </div>
        </header>
    );
};



export default Header;