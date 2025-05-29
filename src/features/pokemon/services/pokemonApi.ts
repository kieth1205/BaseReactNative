import axios from 'axios';
import {Pokemon} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  getPokemon: async (id: number): Promise<Pokemon> => {
    const response = await axios.get(`${BASE_URL}/pokemon/${id}`);
    return response.data;
  },

  getPokemonList: async (limit: number = 20, offset: number = 0) => {
    const response = await axios.get(
      `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    );
    return response.data;
  },

  searchPokemon: async (name: string): Promise<Pokemon> => {
    const response = await axios.get(
      `${BASE_URL}/pokemon/${name.toLowerCase()}`,
    );
    return response.data;
  },
};
