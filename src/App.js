import React, { Component } from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';// importanto bootstrap dps de usar npm install bootstrap
//app.css fica embaixo por causa do cascate, caso queria sobrescrever o bottstrap
import './App.css';
import NavBar from './components/layout/NavBar';
import DashBoard from './components/layout/Dashboard';
import backgroundImage from './pattern_1.png';
import Pokemon from './components/pokemon/Pokemon';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App" style={{background: `url(${backgroundImage})`}}>
          <NavBar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={DashBoard} /> 
              <Route exact path="/pokemon/:pokemonIndex" component={Pokemon} />
            </Switch>
          </div> 
        </div>
      </Router>
    );
  }
}

export default App;
