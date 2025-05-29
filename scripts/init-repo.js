import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_USERNAME = 'kieth1205';
const REPO_NAME = 'BaseReactNative';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GIT_EMAIL = process.env.GIT_EMAIL || 'kieth1205@gmail.com';
const GIT_NAME = process.env.GIT_NAME || 'kieth1205';

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is not set');
  console.log('Please set your GitHub token:');
  console.log('export GITHUB_TOKEN=your_github_token');
  process.exit(1);
}

try {
  // Initialize git repository
  console.log('Initializing git repository...');
  execSync('git init');

  // Configure git user
  console.log('Configuring git user...');
  execSync(`git config user.email "${GIT_EMAIL}"`);
  execSync(`git config user.name "${GIT_NAME}"`);

  // Create .gitignore
  console.log('Creating .gitignore...');
  const gitignoreContent = `# Dependencies
node_modules/
.pnp/
.pnp.js

# Testing
coverage/

# Production
build/
dist/
ios/build/
android/app/build/

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.staging.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.swp
*.swo

# Temporary files
*.log
*.tmp
*.temp

# Generated docs
docs/features/
.changes.json
`;
  fs.writeFileSync('.gitignore', gitignoreContent);

  // Create README.md
  console.log('Creating README.md...');
  const readmeContent = `# Base React Native

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
\`\`\`bash
git clone https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git
cd ${REPO_NAME}
\`\`\`

2. Install dependencies:
\`\`\`bash
yarn install
\`\`\`

3. Install iOS dependencies:
\`\`\`bash
cd ios && pod install && cd ..
\`\`\`

4. Start the development server:
\`\`\`bash
yarn start
\`\`\`

5. Run the app:
\`\`\`bash
# For iOS
yarn ios

# For Android
yarn android
\`\`\`

## Project Structure

\`\`\`
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
\`\`\`

## Available Scripts

- \`yarn start\` - Start the development server
- \`yarn android\` - Run on Android
- \`yarn ios\` - Run on iOS
- \`yarn test\` - Run tests
- \`yarn lint\` - Run linter
- \`yarn docs:features\` - Generate feature documentation
- \`yarn squash\` - Squash commits

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Native
- TypeScript
- React Navigation
- React Query
- And all other amazing libraries used in this project
`;
  fs.writeFileSync('README.md', readmeContent);

  // Create LICENSE
  console.log('Creating LICENSE...');
  const licenseContent = `MIT License

Copyright (c) ${new Date().getFullYear()} ${GITHUB_USERNAME}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
  fs.writeFileSync('LICENSE', licenseContent);

  // Create GitHub repository
  console.log('Creating GitHub repository...');
  execSync(
    `curl -X POST -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user/repos -d '{"name":"${REPO_NAME}","description":"A modern React Native boilerplate with TypeScript, feature-based architecture, and best practices.","private":false,"has_issues":true,"has_wiki":true,"has_downloads":true}'`,
  );

  // Add remote and push
  console.log('Adding remote and pushing initial commit...');
  execSync('git add .');
  execSync('git commit -m "Initial commit"');
  execSync(`git branch -M main`);

  // Check if remote origin exists and remove it if it does
  try {
    execSync('git remote get-url origin');
    console.log('Remote origin exists, removing...');
    execSync('git remote remove origin');
  } catch (error) {
    // Remote origin doesn't exist, continue
  }

  execSync(`git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`);
  execSync('git push -u origin main');

  console.log(`
Repository initialized successfully! 🎉

Next steps:
1. Visit https://github.com/${GITHUB_USERNAME}/${REPO_NAME}
2. Configure branch protection rules
3. Set up GitHub Actions secrets
4. Add collaborators if needed

Happy coding! 🚀
`);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
