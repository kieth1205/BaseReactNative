export type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  API_URL: string;
  APP_NAME: string;
  VERSION: string;
  BUILD_NUMBER: string;
  ENV: Environment;
}

const ENV = {
  development: {
    API_URL: 'https://dev-api.pokemon.com',
    APP_NAME: 'Pokemon Dev',
    VERSION: '1.0.0',
    BUILD_NUMBER: '1',
    ENV: 'development' as Environment,
  },
  staging: {
    API_URL: 'https://staging-api.pokemon.com',
    APP_NAME: 'Pokemon Staging',
    VERSION: '1.0.0',
    BUILD_NUMBER: '1',
    ENV: 'staging' as Environment,
  },
  production: {
    API_URL: 'https://api.pokemon.com',
    APP_NAME: 'Pokemon',
    VERSION: '1.0.0',
    BUILD_NUMBER: '1',
    ENV: 'production' as Environment,
  },
};

export const getEnvVars = (env: Environment = 'development'): EnvConfig => {
  return ENV[env];
};
