import React, { useEffect, useState } from "react";
import './App.css';

export default function App() {
  const [pokemonListUrl, setPokemonListUrl] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [clicks, setClicks] = useState([]);

  const capitalize = (string) => {
    const capitalizedString = string.charAt(0).toUpperCase() + string.slice(1);
    return capitalizedString;
  }

  const shufflePokemonList = () => {
    setPokemonList((prevPokemonList) => [...prevPokemonList].sort(() => Math.random() - 0.5));
  }

  const handleClick = (e) => {
    const pokemonId = e.target.id;

    if (pokemonId in clicks) {
      if (maxScore < score) setMaxScore(score);
      setScore(0);
      setClicks({});
      shufflePokemonList();
    } else {
      setClicks((clicks) => ({ ...clicks, [pokemonId]: true }));
      setScore((score) => score + 1);
      shufflePokemonList();
    }
  }

  useEffect(() => {
    const fetchPokemonUrl = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=12&offset=${Math.random() * 200}`);
        const data = await response.json();
        setPokemonListUrl(data.results.sort(() => Math.random() - 0.5));
      } catch (error) {
        console.log(error);
      }
    }
    fetchPokemonUrl();
  }, []);

  useEffect(() => {
    const fetchPokemon = () => {
      pokemonListUrl.map(async (pokemon) => {
        try {
          const response = await fetch(pokemon.url);
          const data = await response.json();
          setPokemonList((pokemon) => [...pokemon, data]);
        } catch (error) {
          console.log(error);
        }
      })
    }
    fetchPokemon();
  }, [pokemonListUrl]);


  return (
    <div className="container">
      <div className="score-container">
        {score < pokemonList.length && <h1>Max-Score: {maxScore}</h1>}
        {score > 0 && score >= pokemonList.length ? <h1 className="win">Congrats! You Win!</h1> : <h1>Score: {score}</h1>}
      </div>
      <div className="card-container">
        {pokemonList.map(pokemon => {
          return (
            <div key={pokemon.id} className="card">
              <div className="img-container">
                <img src={pokemon.sprites.front_default} alt={pokemon.name} onClick={(e) => handleClick(e)} id={pokemon.id}/>
              </div>
              <p>{capitalize(pokemon.name)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}