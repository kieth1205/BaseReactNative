# Pokemon Trading App

## Table of Contents

- [Project Structure](#project-structure)
- [Performance Optimization](#performance-optimization)
- [Naming Conventions](#naming-conventions)
- [Development Guidelines](#development-guidelines)
- [Deployment Process](#deployment-process)

## Project Structure

```
src/
├── configs/           # App configurations
├── features/          # Feature-based modules
│   ├── pokemon/      # Pokemon feature
│   ├── trade/        # Trading feature
│   └── auth/         # Authentication feature
├── navigation/        # Navigation configuration
├── providers/         # Context providers
├── services/         # API and storage services
├── shared/           # Shared components and utilities
└── theme/            # Theme configuration
```

## Performance Optimization

### 1. React Native Performance

- Use `React.memo()` for components that re-render frequently
- Implement `useCallback` for function props
- Use `useMemo` for expensive computations
- Avoid inline styles and functions in render
- Use `FlatList` with proper `keyExtractor` and `getItemLayout`

### 2. Image Optimization

- Use `FastImage` for better image caching
- Implement progressive image loading
- Compress images before uploading
- Use appropriate image formats (WebP for Android)

### 3. State Management

- Use React Query for server state
- Implement proper caching strategies
- Use MMKV for local storage
- Avoid unnecessary re-renders

### 4. Network Optimization

- Implement request caching
- Use pagination for large lists
- Implement proper error handling
- Use compression for API responses

## Naming Conventions

### 1. Files and Directories

- Feature directories: lowercase with hyphens (e.g., `pokemon-trade`)
- Component files: PascalCase (e.g., `PokemonCard.tsx`)
- Hook files: camelCase with 'use' prefix (e.g., `usePokemon.ts`)
- Service files: camelCase (e.g., `pokemonService.ts`)
- Type files: PascalCase with 'Type' suffix (e.g., `PokemonType.ts`)

### 2. Code Naming

- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase
- Variables: camelCase
- Private methods: \_camelCase

### 3. Import Aliases

```typescript
// Use these aliases for imports
import { Component } from '@components';
import { Screen } from '@screens';
import { Service } from '@services';
import { Hook } from '@hooks';
import { Type } from '@types';
```

## Development Guidelines

### 1. Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful comments
- Keep functions small and focused
- Use proper error handling

### 2. Component Structure

```typescript
// Component template
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { useTheme } from '@providers/ThemeProvider';

interface Props {
  // Props definition
}

export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>Content</Text>
    </View>
  );
};
```

### 3. State Management

```typescript
// React Query usage
const { data, isLoading } = useQuery({
  queryKey: [QUERY_KEYS.POKEMON.LIST],
  queryFn: () => pokemonService.getList(),
});

// Local state
const [state, setState] = useState<StateType>(initialState);
```

## Deployment Process

### 1. Environment Setup

```bash
# Install dependencies
yarn install

# Setup environment variables
cp .env.example .env
```

### 2. Building for Production

```bash
# Android
yarn build:android --env production

# iOS
yarn build:ios --env production
```

### 3. Version Management

- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Update version in package.json
- Update build numbers in native projects

### 4. Release Checklist

- [ ] Run all tests
- [ ] Check performance metrics
- [ ] Verify all features
- [ ] Update documentation
- [ ] Create release notes
- [ ] Build production version
- [ ] Test production build
- [ ] Deploy to stores

### 5. CI/CD Pipeline

```yaml
# Example GitHub Actions workflow
name: Deploy
on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
      - name: Install dependencies
        run: yarn install
      - name: Build Android
        run: yarn build:android
      - name: Build iOS
        run: yarn build:ios
```

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [MMKV Documentation](https://github.com/mrousavy/react-native-mmkv)
