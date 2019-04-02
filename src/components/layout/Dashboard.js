import React, { Component } from 'react';
import PokeonList from '../pokemon/PokemonList';
export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <div className="row">
            <div className="col">
                <PokeonList />
            </div>
        </div>
      </div>
    )
  }
}
