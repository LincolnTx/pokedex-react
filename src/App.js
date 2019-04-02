import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';// importanto bootstrap dps de usar npm install bootstrap
//app.css fica embaixo por causa do cascate, caso queria sobrescrever o bottstrap
import './App.css';
import NavBar from './components/layout/NavBar';
import DashBoard from './components/layout/Dashboard';

class App extends Component {
  render() {
    return (
      <div className="App">
         <NavBar />
        <div className="container">
          <DashBoard />
        </div> 
      </div>
    );
  }
}

export default App;
