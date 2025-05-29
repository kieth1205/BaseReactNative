import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Pokemon} from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress?: () => void;
  showDetails?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onPress,
  showDetails = false,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={{uri: pokemon.sprites.front_default}}
        style={styles.image}
      />
      <Text style={styles.name}>{pokemon.name}</Text>
      {showDetails && (
        <View style={styles.details}>
          <View style={styles.types}>
            {pokemon.types.map((type, index) => (
              <Text key={index} style={styles.type}>
                {type.type.name}
              </Text>
            ))}
          </View>
          <View style={styles.stats}>
            {pokemon.stats.slice(0, 3).map((stat, index) => (
              <Text key={index} style={styles.stat}>
                {stat.stat.name}: {stat.base_stat}
              </Text>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  details: {
    marginTop: 10,
  },
  types: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  type: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 5,
    textTransform: 'capitalize',
  },
  stats: {
    marginTop: 5,
  },
  stat: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
});
