import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Pokemon} from '../../../shared/types/pokemon';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

type RootStackParamList = {
  PokemonList: undefined;
  PokemonDetail: {pokemon: Pokemon};
};

type PokemonDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PokemonDetail'>;
  route: RouteProp<RootStackParamList, 'PokemonDetail'>;
};

export const PokemonDetailScreen: React.FC<PokemonDetailScreenProps> = ({
  route,
}) => {
  const {pokemon} = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{uri: pokemon.sprites.front_default}}
          style={styles.image}
        />
        <Text style={styles.name}>{pokemon.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Types</Text>
        <View style={styles.types}>
          {pokemon.types.map((type, index) => (
            <Text key={index} style={styles.type}>
              {type.type.name}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        {pokemon.stats.map((stat, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statName}>{stat.stat.name}</Text>
            <Text style={styles.statValue}>{stat.base_stat}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.tradeButton}
        onPress={() => {
          // TODO: Implement trade functionality
          console.log('Trade button pressed');
        }}>
        <Text style={styles.tradeButtonText}>Trade This Pokemon</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: 10,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  type: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statName: {
    textTransform: 'capitalize',
    color: '#666',
  },
  statValue: {
    fontWeight: 'bold',
  },
  tradeButton: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  tradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
