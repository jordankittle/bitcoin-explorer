import { 
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './Components/global.css';

import Header from './Components/Header';
import Blocks from './Components/Blocks';
import BlockAll from './Components/BlockAll';
import Block from './Components/Block';
import Transaction from './Components/Transaction';
import Address from './Components/Address';
import About from './Components/About';
import NotFound from './Components/NotFound';
import Error from './Components/Error';

function App() {
  return (
    <Router>
      <Header />                        
      <main>
        <Switch>
          <Route exact path="/" component={Blocks} />
          <Route path="/block/:hash/all" component={BlockAll} />
          <Route path="/block/:hash" component={Block} />
          <Route path="/tx/:txid" component={Transaction} />
          <Route path="/address/:address" component={Address} />
          <Route path="/about/" component={About} />
          <Route path="/error" component={Error} />
          <Route path="/not-found" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>

    </Router>
  );
}

export default App;
