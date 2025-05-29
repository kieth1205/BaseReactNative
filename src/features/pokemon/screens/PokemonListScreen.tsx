import React, {useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Text,
} from 'react-native';
import {PokemonCard} from '../components/PokemonCard';
import {Pokemon} from '../types/pokemon';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {usePokemon} from '../hooks/usePokemon';

type RootStackParamList = {
  PokemonList: undefined;
  PokemonDetail: {pokemon: Pokemon};
};

type PokemonListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PokemonList'>;
};

export const PokemonListScreen: React.FC<PokemonListScreenProps> = ({
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {pokemonList, loading, error, searchPokemon} = usePokemon();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      searchPokemon(text);
    }
  };

  const filteredPokemon = pokemonList.filter((pokemon: Pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Pokemon..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredPokemon}
        renderItem={({item}) => (
          <PokemonCard
            pokemon={item}
            onPress={() =>
              navigation.navigate('PokemonDetail', {pokemon: item})
            }
          />
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  searchInput: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  list: {
    padding: 5,
  },
});
