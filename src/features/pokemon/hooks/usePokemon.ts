import {useState, useEffect} from 'react';
import {Pokemon} from '../types/pokemon';
import {pokemonService} from '../services/pokemonService';

export const usePokemon = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPokemon();
  }, []);

  const loadPokemon = async () => {
    try {
      setLoading(true);
      const data = await pokemonService.getPokemonList();
      setPokemonList(data);
      setError(null);
    } catch (err) {
      setError('Failed to load Pokemon');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchPokemon = async (name: string) => {
    try {
      setLoading(true);
      const pokemon = await pokemonService.searchPokemon(name);
      setPokemonList([pokemon]);
      setError(null);
    } catch (err) {
      setError('Pokemon not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    pokemonList,
    loading,
    error,
    searchPokemon,
  };
};
