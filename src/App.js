import { 
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './Components/global.css';

import Header from './Components/Header';
import Blocks from './Components/Blocks';
import Block from './Components/Block';
import Error from './Components/Error';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Switch>
          <Route exact path="/" component={Blocks} />
          <Route path="/block/:hash" component={Block} />
          <Route path="/error" component={Error} />
        </Switch>
      </main>

    </Router>
  );
}

export default App;
