export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    back_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

export interface PokemonCard {
  id: string;
  pokemon: Pokemon;
  owner: string;
  isForTrade: boolean;
  createdAt: string;
}

export interface TradeOffer {
  id: string;
  offeredCard: PokemonCard;
  requestedCard: PokemonCard;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
