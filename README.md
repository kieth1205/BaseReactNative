# Base React Native

A modern React Native boilerplate with TypeScript, feature-based architecture, and best practices.

## Features

- 🚀 TypeScript support
- 📱 Feature-based architecture
- 🔄 CI/CD with GitHub Actions
- 📦 Automated documentation
- 🎨 Modern UI components
- 🔐 Authentication flow
- 🌐 API integration
- 📊 State management
- 🧪 Testing setup
- 📝 Code quality tools

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kieth1205/BaseReactNative.git
cd BaseReactNative
```

2. Install dependencies:
```bash
yarn install
```

3. Install iOS dependencies:
```bash
cd ios && pod install && cd ..
```

4. Start the development server:
```bash
yarn start
```

5. Run the app:
```bash
# For iOS
yarn ios

# For Android
yarn android
```

## Project Structure

```
src/
├── features/          # Feature-based modules
│   ├── auth/         # Authentication feature
│   ├── pokemon/      # Pokemon feature
│   └── trade/        # Trade feature
├── shared/           # Shared components and utilities
├── navigation/       # Navigation configuration
├── services/         # API services
├── hooks/            # Custom hooks
├── utils/            # Utility functions
└── types/            # TypeScript types
```

## Available Scripts

- `yarn start` - Start the development server
- `yarn android` - Run on Android
- `yarn ios` - Run on iOS
- `yarn test` - Run tests
- `yarn lint` - Run linter
- `yarn docs:features` - Generate feature documentation
- `yarn squash` - Squash commits

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Native
- TypeScript
- React Navigation
- React Query
- And all other amazing libraries used in this project
