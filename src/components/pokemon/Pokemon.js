import React, { Component } from 'react'
import axios from 'axios';
//array com as cores de cada tipo de pokemon
const TYPE_COLORS ={
  bug:'BCCA21',
  dark:'8C6855',
  dragon:'8A76FF',
  electric:'FDE53C',
  fairy:'FAADFF',
  fighting:'A85644',
  fire:'FA5543',
  flying:'79A4FF',
  ghots:'7975D6',
  grass:'8CD751',
  ground:'EDCC56',
  ice:'96F1FF',
  normal:'BABAAC',
  poison:'AB5DA3',
  psychic:'F662B2',
  rock:'CDBD72',
  steel:'C3C1D8',
  water:'55ACFF'
}
export default class Pokemon extends Component {
  
  state = {
      name: '',
      pokemonIndex: '',
      imageUrl: '',
      types : [],
      description: '',
      stats: {
        hp: "",
        attack: "",
        defense: "",
        speed: "",
        specialAttack: "",
        specialDefese: ""
      },
      height: '',
      weight: '',
      eggGroup: '',
      abilities: '',
      genderRatioMale: '',
      genderRatioFemale: '',
      evs: '',
      hatchSteps: ''
  };

  async componentDidMount() {
    const { pokemonIndex } = this.props.match.params;

    //Urls para informações dos pokemons
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

    //Pegar informações dos pokemons
    const pokemonRes= await axios.get(pokemonUrl);

    const name = pokemonRes.data.name;
    const imageUrl = pokemonRes.data.sprites.front_default;

    let { hp, attack, defense, speed, specialAttack, specialDefese } = ''; 

    pokemonRes.data.stats.map(stat => {
      switch(stat.stat.name){
        case 'hp': 
          hp=stat['base_stat'];
          break;
          case 'attack': 
          attack=stat['base_stat'];
          break;
          case 'defense': 
          defense=stat['base_stat'];
          break;
          case 'speed': 
          speed=stat['base_stat'];
          break;
          case 'special-attack': 
          specialAttack=stat['base_stat'];
          break;       
          case 'special-defense': 
          specialDefese=stat['base_stat'];
          break; 
        default: 
          break;
      }
    });
    //converte de decimetros para metros
    const height = Math.round(pokemonRes.data.height  )/10;
    //converte de hectograma para quilo
    const weight= Math.round(pokemonRes.data.weight )/10;
    
    const types = pokemonRes.data.types.map(type => type.type.name);

    const abilities = pokemonRes.data.abilities.map(ability  => {
      //todas as funções utilizadas no retorno servem para organizar os nomes de habilidade, quando existir '-' ele ser excluido e trocado po espaço simples
      return ability.ability.name
      .toLowerCase()
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join (' ');
    });

    const evs = pokemonRes.data.stats.filter(stat => {
        if(stat.effort > 0) {
          return true;
        }
        return false;
    }).map(stat => {
      return `${stat.effort} ${stat.stat.name
        .toLowerCase() 
        .split('-')
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join (' ')}`;
    }).join(', ');

    // pegando descrição do pokemon
     await axios.get(pokemonSpeciesUrl).then(res => {
       let description ='';
       res.data.flavor_text_entries.some(flavor => {
          if(flavor.language.name === 'en' || flavor.language.name === 'pt'){
            description =  flavor.flavor_text;
            return;
          }
       });
       
       const femaleRate = res.data['gender_rate'];
       const genderRatioFemale = 12.5 * femaleRate;
       const genderRatioMale = 12.5 * (8- femaleRate);

       const cathRate = Math.round((100/255) * res.data['capture_rate']);

       const eggGroup = res.data['egg_groups'].map(group => {
          return group.name
          .toLowerCase() 
          .split('-')
          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
          .join (' ');
       }).join(', ');

       const hatchSteps = 255 * (res.data['hatch_counter'] + 1);
       //não é necessário passar os states com descicao: descrica, pois como os nomes de var sao iguais o react faz isso por padrao
       this.setState({
         description,
         genderRatioFemale,
         genderRatioMale,
         cathRate,
         eggGroup,
         hatchSteps
       });
     });

     this.setState({
      imageUrl,
      pokemonIndex,
      name,
      types,
      stats:{
        hp,
        attack,
        defense,
        speed,
        specialAttack,
        specialDefese
      },
      height,
      weight,
      abilities,
      evs
     });

  }
  render() {
    return (
      <div className="col">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-5">
                <h5> {this.state.pokemonIndex}</h5>
              </div>
              <div className="col-7">
                <div className="float-right">
                  {this.state.types.map(type => (
                     <span key={type}
                     className="badge badge-primary badge-pill mr-1" 
                     style={{backgroundColor:`#${TYPE_COLORS[type]}`,
                     color:'white'}}
                     >
                     {type.toLowerCase()
                          .split('-')
                          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                          .join (' ')}
                     </span> 
                  ))}
                </div>
              </div>
              </div>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
               {/* imagem */}
              <div className="col-md-3">
                <img src={this.state.imageUrl} 
                className="card-img-top rounded mx-auto mt-2"
                />
              </div>
              <div className="col-md-9">
                 {/* nome do pokemon*/}
                <h4 className="mx-auto">
                {this.state.name.toLowerCase()
                                .split('-')
                                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                .join (' ')}
                </h4>
                 {/* barra de hp */}
                <div className="row align-items-center">  
                  <div className="col-12 col-md-3">HP</div>
                  <div className="col-12 col-md -9">
                    <div className="progress">
                      <div className="progress-bar"
                      role="progressBar"
                      style={{width:`${this.state.stats.hp}%`}}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"> <small>{this.state.stats.hp}</small>
                      </div>
                    </div>
                  </div>
                </div>
                 {/* barra de Attack */}
                <div className="row align-items-center">
                    <div className="col-12 col-md-3">Attack</div>
                  <div className="col-12 col-md -9">
                    <div className="progress">
                      <div className="progress-bar"
                      role="progressBar"
                      style={{width:`${this.state.stats.attack}%`}}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"> <small>{this.state.stats.attack}</small>
                      </div>
                    </div>
                  </div>
                </div>
                 {/* barra de Defense */}
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Defense</div>
                  <div className="col-12 col-md -9">
                    <div className="progress">
                      <div className="progress-bar"
                      role="progressBar"
                      style={{width:`${this.state.stats.defense}%`}}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"> <small>{this.state.stats.defense}</small>
                      </div>
                    </div>
                  </div>
                </div>
                 {/* barra de speed */}
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Speed</div>
                  <div className="col-12 col-md -9">
                    <div className="progress">
                      <div className="progress-bar"
                      role="progressBar"
                      style={{width:`${this.state.stats.speed}%`}}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"> <small>{this.state.stats.speed}</small>
                      </div>
                    </div>
                  </div>
                </div>
                 {/* barra de SpecialAttack */}
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Special Attack</div>
                  <div className="col-12 col-md -9">
                    <div className="progress">
                      <div className="progress-bar"
                      role="progressBar"
                      style={{width:`${this.state.stats.specialAttack}%`}}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"> <small>{this.state.stats.specialAttack}</small>
                      </div>
                    </div>
                  </div>
                </div>
                 {/* barra de Special Defense */}
                <div className="row align-items-center">
                  <div className="col-12 col-md-3">Special Defense</div>
                  <div className="col-12 col-md -9">
                    <div className="progress">
                      <div className="progress-bar"
                      role="progressBar"
                      style={{width:`${this.state.stats.specialDefese}%`}}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"> <small>{this.state.stats.specialDefese}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-1">
                  <div className="col">
                    <p className="p-2">{this.state.description}</p>
                  </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="card-body">
            <h5 className="card-title text-center"> Profile</h5>
            <div className="row">
               <div className="col-md-6">
                  <div className="row">
                    {/* coluna de altura */}
                    <div className="col-md-6">
                        <h6 className="float-right"> Height:</h6>
                    </div>
                    <div className="col-md-6">
                        <h6 className="float-left">{this.state.height}mt.</h6>
                    </div>
                    {/* coluna de peso */}
                    <div className="col-md-6">
                        <h6 className="float-right"> Weight:</h6>
                    </div>
                    <div className="col-md-6">
                        <h6 className="float-left">{this.state.weight}kg.</h6>
                    </div>
                    {/* coluna de catch ratio */}
                    <div className="col-md-6">
                        <h6 className="float-right"> Catch Rate:</h6>
                    </div>
                    <div className="col-md-6">
                        <h6 className="float-left">{this.state.cathRate}%</h6>
                    </div>
                    {/* coluna de gender ratio */}
                    <div className="col-md-6">
                        <h6 className="float-right"> Gender Ratio:</h6>
                    </div>
                    <div className="col-md-6">
                        <div class="progress">
                          <div class="progress-bar"
                          role="progressbar"
                          style={{width:`${this.state.genderRatioFemale}%`,
                          backgroundColor: '#c2185b'}}
                          aria-valuenow="15"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          >
                            <small>{this.state.genderRatioFemale}</small>
                          </div>
                          <div class="progress-bar"
                          role="progressbar"
                          style={{width:`${this.state.genderRatioMale}%`,
                          backgroundColor: '#1976d2'}}
                          aria-valuenow="30"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          >
                            <small>{this.state.genderRatioMale}</small>
                          </div>
                    </div>
                  </div>      
               </div>
            </div>
            <div className="col-md-6">
                  <div className="row">
                    {/* coluna de eggGroup */}
                    <div className="col-6">
                      <h6 className="float-right">Egg Group:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{this.state.eggGroup}</h6>
                    </div>
                  {/* coluna de hatchSteps */}
                  <div className="col-6">
                      <h6 className="float-right">Hatch Steps:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{this.state.hatchSteps}</h6>
                    </div>
                    {/* coluna de habilidade */}
                    <div className="col-6">
                      <h6 className="float-right">Abilities:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{this.state.abilities}</h6>
                    </div>
                    {/* coluna de EVS */}
                    <div className="col-6">
                      <h6 className="float-right">Evs:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{this.state.evs}</h6>
                    </div>
                  </div>
            </div>
          </div>
        </div>
        <div className="card-footer text-muted">
           Dados retirados de {' '}
           <a href="https://pokeapi.co/" 
           target="_blank" 
           className="card-link">
           PokeAPI.co
           </a>
        </div>
      </div>
      </div>
    );
  }
}
