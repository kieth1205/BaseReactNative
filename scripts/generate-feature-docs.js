const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FEATURES_DIR = path.join(__dirname, '../src/features');
const DOCS_DIR = path.join(__dirname, '../docs/features');
const CHANGES_FILE = path.join(__dirname, '../.changes.json');

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Helper function to safely read file
const safeReadFile = filePath => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
    return '';
  }
};

// Helper function to extract feature description
const extractFeatureDescription = featurePath => {
  const readmePath = path.join(featurePath, 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = safeReadFile(readmePath);
    const descriptionMatch = content.match(/## Description\n\n([^\n]+)/);
    return descriptionMatch
      ? descriptionMatch[1]
      : `This feature provides functionality for ${path.basename(featurePath).toLowerCase()} management.`;
  }
  return `This feature provides functionality for ${path.basename(featurePath).toLowerCase()} management.`;
};

// Track changes
const trackChanges = (featureName, changes) => {
  try {
    let changesData = {};
    if (fs.existsSync(CHANGES_FILE)) {
      changesData = JSON.parse(fs.readFileSync(CHANGES_FILE, 'utf8'));
    }

    changesData[featureName] = {
      ...changesData[featureName],
      ...changes,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(CHANGES_FILE, JSON.stringify(changesData, null, 2));
  } catch (error) {
    console.warn(`Warning: Could not track changes for ${featureName}: ${error.message}`);
  }
};

const analyzeFeature = featurePath => {
  const featureName = path.basename(featurePath);
  const components = [];
  const screens = [];
  const hooks = [];
  const services = [];
  const changes = {
    components: [],
    screens: [],
    hooks: [],
    services: [],
  };

  // Scan components
  const componentsDir = path.join(featurePath, 'components');
  if (fs.existsSync(componentsDir)) {
    fs.readdirSync(componentsDir).forEach(file => {
      if (file.endsWith('.tsx')) {
        const content = safeReadFile(path.join(componentsDir, file));
        const componentName = path.basename(file, '.tsx');

        // Extract props interface
        const propsMatch = content.match(/interface\s+(\w+)Props\s*{([^}]*)}/);
        const props = propsMatch
          ? propsMatch[2]
              .split('\n')
              .map(p => p.trim())
              .filter(Boolean)
          : [];

        // Extract dependencies
        const dependencies = content.match(/from ['"]([^'"]+)['"]/g) || [];

        // Extract methods
        const methods = content.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g) || [];

        // Extract component description from comments
        const descriptionMatch = content.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/);
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';

        components.push({
          name: componentName,
          props,
          dependencies: dependencies.map(d => d.replace(/from ['"]([^'"]+)['"]/, '$1')),
          methods: methods.map(m => m.match(/const\s+(\w+)\s*=/)[1]),
          description,
        });

        changes.components.push({
          name: componentName,
          props: props.length,
          methods: methods.length,
          description,
        });
      }
    });
  }

  // Scan screens
  const screensDir = path.join(featurePath, 'screens');
  if (fs.existsSync(screensDir)) {
    fs.readdirSync(screensDir).forEach(file => {
      if (file.endsWith('.tsx')) {
        const content = safeReadFile(path.join(screensDir, file));
        const screenName = path.basename(file, '.tsx');

        // Extract navigation
        const navigation = content.match(/navigation\.navigate\(['"]([^'"]+)['"]/g) || [];

        // Extract state management
        const stateHooks = content.match(/useState|useReducer|useContext/g) || [];

        // Extract dependencies
        const dependencies = content.match(/from ['"]([^'"]+)['"]/g) || [];

        // Extract methods
        const methods = content.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g) || [];

        // Extract screen description from comments
        const descriptionMatch = content.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/);
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';

        screens.push({
          name: screenName,
          navigation: navigation.map(n => n.match(/['"]([^'"]+)['"]/)[1]),
          stateManagement: [...new Set(stateHooks)],
          dependencies: dependencies.map(d => d.replace(/from ['"]([^'"]+)['"]/, '$1')),
          methods: methods.map(m => m.match(/const\s+(\w+)\s*=/)[1]),
          description,
        });

        changes.screens.push({
          name: screenName,
          navigation: navigation.length,
          stateHooks: stateHooks.length,
          methods: methods.length,
          description,
        });
      }
    });
  }

  // Scan hooks
  const hooksDir = path.join(featurePath, 'hooks');
  if (fs.existsSync(hooksDir)) {
    fs.readdirSync(hooksDir).forEach(file => {
      if (file.endsWith('.ts')) {
        const content = safeReadFile(path.join(hooksDir, file));
        const hookName = path.basename(file, '.ts');

        // Extract return type
        const returnType = content.match(/:\s*([^{]+)\s*{/)?.[1] || 'void';

        // Extract dependencies
        const dependencies = content.match(/from ['"]([^'"]+)['"]/g) || [];

        // Extract methods
        const methods = content.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g) || [];

        // Extract hook description from comments
        const descriptionMatch = content.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/);
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';

        hooks.push({
          name: hookName,
          returnType,
          dependencies: dependencies.map(d => d.replace(/from ['"]([^'"]+)['"]/, '$1')),
          methods: methods.map(m => m.match(/const\s+(\w+)\s*=/)[1]),
          description,
        });

        changes.hooks.push({
          name: hookName,
          returnType,
          methods: methods.length,
          description,
        });
      }
    });
  }

  // Scan services
  const servicesDir = path.join(featurePath, 'services');
  if (fs.existsSync(servicesDir)) {
    fs.readdirSync(servicesDir).forEach(file => {
      if (file.endsWith('.ts')) {
        const content = safeReadFile(path.join(servicesDir, file));
        const serviceName = path.basename(file, '.ts');

        // Extract methods
        const methods = content.match(/async\s+(\w+)\s*\([^)]*\)/g) || [];

        // Extract dependencies
        const dependencies = content.match(/from ['"]([^'"]+)['"]/g) || [];

        // Extract service description from comments
        const descriptionMatch = content.match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/);
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';

        services.push({
          name: serviceName,
          methods: methods.map(m => m.match(/async\s+(\w+)\s*\(/)[1]),
          dependencies: dependencies.map(d => d.replace(/from ['"]([^'"]+)['"]/, '$1')),
          description,
        });

        changes.services.push({
          name: serviceName,
          methods: methods.length,
          description,
        });
      }
    });
  }

  // Track changes
  trackChanges(featureName, changes);

  return {
    featureName,
    description: extractFeatureDescription(featurePath),
    components,
    screens,
    hooks,
    services,
  };
};

const generateFeatureDocs = analysis => {
  const { featureName, description, components, screens, hooks, services } = analysis;
  const featureDocsDir = path.join(DOCS_DIR, featureName.toLowerCase());

  if (!fs.existsSync(featureDocsDir)) {
    fs.mkdirSync(featureDocsDir, { recursive: true });
  }

  // Generate overview
  const overviewDoc = `# ${featureName} Feature

## Overview
${description}

## Architecture
- Components: ${components.length}
- Screens: ${screens.length}
- Hooks: ${hooks.length}
- Services: ${services.length}

## Components
${components.map(c => `- ${c.name}: ${c.props.length} props, ${c.methods.length} methods${c.description ? ` - ${c.description}` : ''}`).join('\n')}

## Screens
${screens.map(s => `- ${s.name}: ${s.navigation.length} navigation routes, ${s.methods.length} methods${s.description ? ` - ${s.description}` : ''}`).join('\n')}

## Hooks
${hooks.map(h => `- ${h.name}: returns ${h.returnType}, ${h.methods.length} methods${h.description ? ` - ${h.description}` : ''}`).join('\n')}

## Services
${services.map(s => `- ${s.name}: ${s.methods.length} methods${s.description ? ` - ${s.description}` : ''}`).join('\n')}

## Data Flow
1. User interacts with screens
2. Screens use hooks for state management
3. Hooks call services for data operations
4. Services communicate with external APIs
5. Components render UI based on state

## Usage Example
\`\`\`typescript
// Example usage of ${featureName} feature
import { ${components[0]?.name} } from '@/features/${featureName.toLowerCase()}/components';
import { ${screens[0]?.name} } from '@/features/${featureName.toLowerCase()}/screens';
import { ${hooks[0]?.name} } from '@/features/${featureName.toLowerCase()}/hooks';
import { ${services[0]?.name} } from '@/features/${featureName.toLowerCase()}/services';

// Use in your app
\`\`\`

## Generated On
${new Date().toISOString()}
`;

  fs.writeFileSync(path.join(featureDocsDir, 'README.md'), overviewDoc);

  // Generate sequence diagram
  const sequenceDoc = `# ${featureName} Feature Sequence

## Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Screen
    participant Component
    participant Hook
    participant Service
    participant API

    User->>Screen: Interact
    Screen->>Hook: Update State
    Hook->>Service: Call Method
    Service->>API: Request
    API-->>Service: Response
    Service-->>Hook: Process Data
    Hook-->>Screen: Update State
    Screen-->>Component: Render
    Component-->>User: Display
\`\`\`

## Components
${components
  .map(
    c => `
### ${c.name}
${c.description ? `- Description: ${c.description}\n` : ''}
- Props: ${c.props.join(', ')}
- Methods: ${c.methods.join(', ')}
- Dependencies: ${c.dependencies.join(', ')}
`,
  )
  .join('\n')}

## Screens
${screens
  .map(
    s => `
### ${s.name}
${s.description ? `- Description: ${s.description}\n` : ''}
- Navigation: ${s.navigation.join(', ')}
- State Management: ${s.stateManagement.join(', ')}
- Methods: ${s.methods.join(', ')}
- Dependencies: ${s.dependencies.join(', ')}
`,
  )
  .join('\n')}

## Hooks
${hooks
  .map(
    h => `
### ${h.name}
${h.description ? `- Description: ${h.description}\n` : ''}
- Return Type: ${h.returnType}
- Methods: ${h.methods.join(', ')}
- Dependencies: ${h.dependencies.join(', ')}
`,
  )
  .join('\n')}

## Services
${services
  .map(
    s => `
### ${s.name}
${s.description ? `- Description: ${s.description}\n` : ''}
- Methods: ${s.methods.join(', ')}
- Dependencies: ${s.dependencies.join(', ')}
`,
  )
  .join('\n')}

## Generated On
${new Date().toISOString()}
`;

  fs.writeFileSync(path.join(featureDocsDir, 'sequence.md'), sequenceDoc);
};

const generateAllFeatureDocs = () => {
  try {
    // Get list of features
    const features = fs
      .readdirSync(FEATURES_DIR)
      .filter(file => fs.statSync(path.join(FEATURES_DIR, file)).isDirectory());

    // Generate docs for each feature
    features.forEach(feature => {
      try {
        const featurePath = path.join(FEATURES_DIR, feature);
        const analysis = analyzeFeature(featurePath);
        generateFeatureDocs(analysis);
        console.log(`Generated documentation for ${feature}`);
      } catch (error) {
        console.error(`Error generating documentation for ${feature}: ${error.message}`);
      }
    });

    // Generate main index file
    const indexContent = `# Features Documentation

## Available Features

${features
  .map(
    feature => `### [${feature}](./${feature.toLowerCase()}/README.md)
- Overview
- Architecture
- Components
- Screens
- Hooks
- Services
- Data Flow
- Usage Examples
`,
  )
  .join('\n')}

## Documentation Structure

Each feature documentation includes:
- Overview and architecture
- Component documentation
- Screen documentation
- Hook documentation
- Service documentation
- Sequence diagrams
- Usage examples

## Generated On

${new Date().toISOString()}
`;

    fs.writeFileSync(path.join(DOCS_DIR, 'README.md'), indexContent);
    console.log('Feature documentation generated successfully!');
  } catch (error) {
    console.error(`Error generating documentation: ${error.message}`);
    process.exit(1);
  }
};

// Run the generator
generateAllFeatureDocs();
