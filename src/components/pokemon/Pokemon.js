import React, { Component } from 'react'
import axios from 'axios';
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
    const height = Math.round(pokemonRes.data.height / 10);
    //converte de hectograma para quilo
    const weight= Math.round(pokemonRes.data.weight /10);
    
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
      return `${stat.effort} ${stat.stat.name}`
      .toLowerCase() 
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join (' ');
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
      <div>
        <h1>{this.state.name}</h1>
      </div>
    )
  }
}
