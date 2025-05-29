const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FEATURES_DIR = path.join(__dirname, '../src/features');
const DOCS_DIR = path.join(__dirname, '../docs');

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

const generateFeatureDocs = (featureName, components) => {
  const featureDocsDir = path.join(DOCS_DIR, 'features', featureName.toLowerCase());
  if (!fs.existsSync(featureDocsDir)) {
    fs.mkdirSync(featureDocsDir, { recursive: true });
  }

  // Generate sequence diagram
  const sequenceDiagram = `# ${featureName} Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Screen
    participant Component
    participant Hook
    participant Service
    participant API

    %% User Interactions
    User->>Screen: Interact with UI
    activate Screen
    
    %% Component Flow
    Screen->>Component: Render Components
    activate Component
    Component->>Hook: Use Custom Hooks
    activate Hook
    
    %% Data Flow
    Hook->>Service: Call Service Methods
    activate Service
    Service->>API: Make API Requests
    API-->>Service: Return Data
    Service-->>Hook: Process Data
    deactivate Service
    
    %% State Updates
    Hook-->>Component: Update State
    deactivate Hook
    Component-->>Screen: Update UI
    deactivate Component
    
    %% Response
    Screen-->>User: Show Updated UI
    deactivate Screen
\`\`\``;

  // Generate components documentation
  const componentsDoc = `# ${featureName} Components

## Overview
This document describes all components used in the ${featureName} feature.

${components
  .filter(comp => comp.type === 'Component')
  .map(
    comp => `## ${comp.name}
- **Type**: Component
- **Location**: \`${comp.path}\`
- **Dependencies**: ${comp.dependencies.join(', ')}
- **Purpose**: ${comp.purpose || 'Not documented'}
- **Props**:
${comp.props ? comp.props.map(prop => `  - \`${prop.name}\`: ${prop.type} - ${prop.description}`).join('\n') : '  - No props documented'}
`,
  )
  .join('\n')}`;

  // Generate screens documentation
  const screensDoc = `# ${featureName} Screens

## Overview
This document describes all screens used in the ${featureName} feature.

${components
  .filter(comp => comp.type === 'Screen')
  .map(
    comp => `## ${comp.name}
- **Type**: Screen
- **Location**: \`${comp.path}\`
- **Dependencies**: ${comp.dependencies.join(', ')}
- **Purpose**: ${comp.purpose || 'Not documented'}
- **Navigation**: ${comp.navigation || 'Not documented'}
- **State Management**: ${comp.stateManagement || 'Not documented'}
`,
  )
  .join('\n')}`;

  // Generate hooks documentation
  const hooksDoc = `# ${featureName} Hooks

## Overview
This document describes all custom hooks used in the ${featureName} feature.

${components
  .filter(comp => comp.type === 'Hook')
  .map(
    comp => `## ${comp.name}
- **Type**: Hook
- **Location**: \`${comp.path}\`
- **Dependencies**: ${comp.dependencies.join(', ')}
- **Purpose**: ${comp.purpose || 'Not documented'}
- **Returns**: ${comp.returns || 'Not documented'}
- **Usage Example**:
\`\`\`typescript
${comp.example || '// Example not documented'}
\`\`\`
`,
  )
  .join('\n')}`;

  // Generate services documentation
  const servicesDoc = `# ${featureName} Services

## Overview
This document describes all services used in the ${featureName} feature.

${components
  .filter(comp => comp.type === 'Service')
  .map(
    comp => `## ${comp.name}
- **Type**: Service
- **Location**: \`${comp.path}\`
- **Dependencies**: ${comp.dependencies.join(', ')}
- **Purpose**: ${comp.purpose || 'Not documented'}
- **API Endpoints**: ${comp.endpoints || 'Not documented'}
- **Methods**:
${comp.methods ? comp.methods.map(method => `  - \`${method.name}\`: ${method.description}`).join('\n') : '  - No methods documented'}
`,
  )
  .join('\n')}`;

  // Generate feature overview
  const overviewDoc = `# ${featureName} Feature Overview

## Description
${components.find(comp => comp.type === 'Screen')?.purpose || 'Not documented'}

## Architecture
The ${featureName} feature follows a modular architecture with the following components:

### Screens
${components
  .filter(comp => comp.type === 'Screen')
  .map(comp => `- [${comp.name}](./screens.md#${comp.name.toLowerCase()})`)
  .join('\n')}

### Components
${components
  .filter(comp => comp.type === 'Component')
  .map(comp => `- [${comp.name}](./components.md#${comp.name.toLowerCase()})`)
  .join('\n')}

### Hooks
${components
  .filter(comp => comp.type === 'Hook')
  .map(comp => `- [${comp.name}](./hooks.md#${comp.name.toLowerCase()})`)
  .join('\n')}

### Services
${components
  .filter(comp => comp.type === 'Service')
  .map(comp => `- [${comp.name}](./services.md#${comp.name.toLowerCase()})`)
  .join('\n')}

## Data Flow
1. User interacts with the UI
2. Screen components handle user input
3. Custom hooks manage state and business logic
4. Services handle API calls and data processing
5. Components re-render with updated data

## Usage Example
\`\`\`typescript
import { ${featureName}Screen } from '@/features/${featureName.toLowerCase()}/screens';

const App = () => {
  return <${featureName}Screen />;
};
\`\`\`

## Generated On
${new Date().toISOString()}`;

  // Write all documentation files
  fs.writeFileSync(path.join(featureDocsDir, 'sequence.md'), sequenceDiagram);
  fs.writeFileSync(path.join(featureDocsDir, 'components.md'), componentsDoc);
  fs.writeFileSync(path.join(featureDocsDir, 'screens.md'), screensDoc);
  fs.writeFileSync(path.join(featureDocsDir, 'hooks.md'), hooksDoc);
  fs.writeFileSync(path.join(featureDocsDir, 'services.md'), servicesDoc);
  fs.writeFileSync(path.join(featureDocsDir, 'README.md'), overviewDoc);
};

const scanFeature = featurePath => {
  const featureName = path.basename(featurePath);
  const components = [];

  // Scan components
  const componentsDir = path.join(featurePath, 'components');
  if (fs.existsSync(componentsDir)) {
    fs.readdirSync(componentsDir).forEach(file => {
      if (file.endsWith('.tsx')) {
        const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
        const dependencies = content.match(/from ['"]([^'"]+)['"]/g) || [];
        const props =
          content
            .match(/interface Props {([^}]*)}/)?.[1]
            ?.split('\n')
            .filter(line => line.includes(':'))
            .map(line => {
              const [name, type] = line.trim().split(':');
              return {
                name: name.trim(),
                type: type.trim().replace(';', ''),
                description: 'Not documented',
              };
            }) || [];

        components.push({
          name: path.basename(file, '.tsx'),
          type: 'Component',
          path: `src/features/${featureName}/components/${file}`,
          dependencies: dependencies.map(d => d.replace(/from ['"]([^'"]+)['"]/, '$1')),
          props,
          purpose: 'Not documented',
        });
      }
    });
  }

  // Scan screens
  const screensDir = path.join(featurePath, 'screens');
  if (fs.existsSync(screensDir)) {
    fs.readdirSync(screensDir).forEach(file => {
      if (file.endsWith('.tsx')) {
        const content = fs.readFileSync(path.join(screensDir, file), 'utf8');
        const dependencies = content.match(/from ['"]([^'"]+)['"]/g) || [];
        components.push({
          name: path.basename(file, '.tsx'),
          type: 'Screen',
          path: `src/features/${featureName}/screens/${file}`,
          dependencies: dependencies.map(d => d.replace(/from ['"]([^'"]+)['"]/, '$1')),
          purpose: 'Not documented',
          navigation: 'Not documented',
          stateManagement: 'Not documented',
        });
      }
    });
  }

  // Scan hooks
  const hooksDir = path.join(featurePath, 'hooks');
  if (fs.existsSync(hooksDir)) {
    fs.readdirSync(hooksDir).forEach(file => {
      if (file.endsWith('.ts')) {
        const content = fs.readFileSync(path.join(hooksDir, file), 'utf8');
        const dependencies = content.match(/from ['"]([^'"]+)['"]/g) || [];
        const returns =
          content
            .match(/return {([^}]*)}/)?.[1]
            ?.split(',')
            .map(item => item.trim())
            .join(', ') || 'Not documented';

        components.push({
          name: path.basename(file, '.ts'),
          type: 'Hook',
          path: `src/features/${featureName}/hooks/${file}`,
          dependencies: dependencies.map(d => d.replace(/from ['"]([^'"]+)['"]/, '$1')),
          purpose: 'Not documented',
          returns,
          example: 'Not documented',
        });
      }
    });
  }

  // Scan services
  const servicesDir = path.join(featurePath, 'services');
  if (fs.existsSync(servicesDir)) {
    fs.readdirSync(servicesDir).forEach(file => {
      if (file.endsWith('.ts')) {
        const content = fs.readFileSync(path.join(servicesDir, file), 'utf8');
        const dependencies = content.match(/from ['"]([^'"]+)['"]/g) || [];
        const methods =
          content.match(/async\s+(\w+)\s*\([^)]*\)/g)?.map(method => ({
            name: method.match(/async\s+(\w+)\s*\(/)[1],
            description: 'Not documented',
          })) || [];

        components.push({
          name: path.basename(file, '.ts'),
          type: 'Service',
          path: `src/features/${featureName}/services/${file}`,
          dependencies: dependencies.map(d => d.replace(/from ['"]([^'"]+)['"]/, '$1')),
          purpose: 'Not documented',
          endpoints: 'Not documented',
          methods,
        });
      }
    });
  }

  return { featureName, components };
};

const generateAllFeatureDocs = () => {
  // Get list of features
  const features = fs
    .readdirSync(FEATURES_DIR)
    .filter(file => fs.statSync(path.join(FEATURES_DIR, file)).isDirectory());

  // Generate docs for each feature
  features.forEach(feature => {
    const featurePath = path.join(FEATURES_DIR, feature);
    const { featureName, components } = scanFeature(featurePath);
    generateFeatureDocs(featureName, components);
  });

  // Generate main index file
  const indexContent = `# Feature Documentation

## Available Features

${features
  .map(
    feature => `### [${feature}](./features/${feature.toLowerCase()}/README.md)
- [Sequence Diagram](./features/${feature.toLowerCase()}/sequence.md)
- [Components](./features/${feature.toLowerCase()}/components.md)
- [Screens](./features/${feature.toLowerCase()}/screens.md)
- [Hooks](./features/${feature.toLowerCase()}/hooks.md)
- [Services](./features/${feature.toLowerCase()}/services.md)
`,
  )
  .join('\n')}

## Documentation Structure

Each feature has its own directory with the following files:
- \`README.md\`: Feature overview and architecture
- \`sequence.md\`: Sequence diagram showing component interactions
- \`components.md\`: Detailed component documentation
- \`screens.md\`: Screen documentation
- \`hooks.md\`: Custom hooks documentation
- \`services.md\`: Services documentation

## Generated On

${new Date().toISOString()}
`;

  fs.writeFileSync(path.join(DOCS_DIR, 'README.md'), indexContent);
};

// Run the generator
generateAllFeatureDocs();
console.log('Feature documentation generated successfully!');
