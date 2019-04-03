import React, { Component } from 'react';
import axios from'axios';
import PokemonCard from './PokemonCard';

export default class PokemonList extends Component {
  //state para salvar a api de pokemon e o estado incial do pokemon
    state= {
      url: "https://pokeapi.co/api/v2/pokemon/?limit=150&offset=0",
      pokemon: null
  } ;

  //indica que o metedo é asincrono
  async componentDidMount() {
    const res = await axios.get(this.state.url);
    //set state vai rerun a função render e dessa forma ira rendereizar novamente as coisas que podem ter mudado
    this.setState({pokemon: res.data['results']});//baseado no json da api, atualiza o valor do state pokemon
  }
    render() {
    return (
      <React.Fragment>
          {this.state.pokemon ? 
            (
                <div className="row">
                    {this.state.pokemon.map(pokemon => (
                    <PokemonCard
                        key={pokemon.name}
                        name={pokemon.name}
                        url={pokemon.url}
                    /> 
                    ))}
                </div>
            ) : (<h1>Carregando pokemon</h1>)}
      </React.Fragment>
    )
  }
}
