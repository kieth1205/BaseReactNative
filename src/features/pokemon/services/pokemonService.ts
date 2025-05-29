import {pokemonApi} from './pokemonApi';
import {Pokemon} from '../types/pokemon';

export const pokemonService = {
  getPokemonList: async (limit: number = 20, offset: number = 0) => {
    try {
      const response = await pokemonApi.getPokemonList(limit, offset);
      const pokemonDetails = await Promise.all(
        response.results.map(async (pokemon: {url: string}) => {
          const id = pokemon.url.split('/').filter(Boolean).pop();
          return pokemonApi.getPokemon(Number(id));
        }),
      );
      return pokemonDetails;
    } catch (error) {
      console.error('Error in pokemonService.getPokemonList:', error);
      throw error;
    }
  },

  getPokemonById: async (id: number): Promise<Pokemon> => {
    try {
      return await pokemonApi.getPokemon(id);
    } catch (error) {
      console.error('Error in pokemonService.getPokemonById:', error);
      throw error;
    }
  },

  searchPokemon: async (name: string): Promise<Pokemon> => {
    try {
      return await pokemonApi.searchPokemon(name);
    } catch (error) {
      console.error('Error in pokemonService.searchPokemon:', error);
      throw error;
    }
  },
};
