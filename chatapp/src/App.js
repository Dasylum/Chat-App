import './style.css';
import Chat from './components/chat';
import Dashboard from './components/dashboard';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/chat" component={Chat}/>
        <Route path="/" component={Dashboard}/>
      </Switch>
    </Router>
  );
}

export default App;
