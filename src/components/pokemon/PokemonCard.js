import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import spinner from './spinner.gif';


const Special = styled.img `
  width: 5em;
  height: 5em;
  display: none;
  
`;

const Card = styled.div `
  box-shadow: 0 1px 3px rgba(0, 0, 0 , 0.12), 0 1px 2 px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, .25, 1 );
  &:hover{
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px rgba(0, 0, 0, 0.22);
  }
  -moz-user-select: none;
  -website-user-select: none;
  -user-select: none;
  -o-user-select: none;
`;
// os quatro ultimos do Card servem para que os usuarionão possam arrastar certos item do Card, como a imagem dos pokemons
const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

export default class PokemonCard extends Component {
  state= {
      name: '',
      imageUrl: '',
      pokemonIndex: '',
      imageLoading: true,
      toManyRequests: false

  }

  componentDidMount() {
    const {name, url} = this.props;
    const pokemonIndex = url.split("/")[url.split('/').length - 2];//para separar a url por / e pegar os numeros no fim
    const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;
  
    this.setState({
      name: name, 
      imageUrl: imageUrl, 
      pokemonIndex: pokemonIndex
    });
  }
    render() {
   
    return (
      <div className="col-md-3 col-sm-6 mb-5">
      <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
          <Card className="card">
            <h5 className ="card-header">{this.state.pokemonIndex}</h5> 
            {this.state.imageLoading ? (
              <img 
              src={spinner}
              style={{width: '5em', height: '5em'}}
              className="card-img-top rounded mx-auto mt-2" 
              />
            ) : null}
            <Special className="card-img-top rounded mx-auto mt=2"
            onLoad={() => this.setState({ imageLoading: false })}
            onError={() => this.setState({ toManyRequests: true })}
            src= {this.state.imageUrl}
            style={
              this.state.toManyRequestsc ? {display:"none"} :
              this.state.imageLoading ? null : {display: "block"}
            } 
            />

            {this.state.toManyRequests ? (
              <h6 className="mx-auto">
                <span className="badge badge-danger mt-2">Muitas requisições sendo feitas!</span>
              </h6>
            ): null}
            <div className="card-body mx-auto">
              <h6 className="card-title">
                {this.state.name
                  .toLowerCase()
                  .split(' ')
                  .map(
                    letter => letter.charAt(0).toUpperCase() + letter.substring(1)
                    )
                    .join(' ')} 
                    {/* serve apenas para formar as letras dos nomes para seguir um padrão */}
              </h6>
            </div> 
          </Card>
        </StyledLink>
      </div>
    )
  }
}
