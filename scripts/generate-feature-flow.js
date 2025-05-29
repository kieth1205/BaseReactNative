const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FEATURES_DIR = path.join(__dirname, '../src/features');
const DOCS_DIR = path.join(__dirname, '../docs/features');

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

const analyzeFeatureFlow = featurePath => {
  const featureName = path.basename(featurePath);
  const flows = [];

  // Analyze screens for user flows
  const screensDir = path.join(featurePath, 'screens');
  if (fs.existsSync(screensDir)) {
    fs.readdirSync(screensDir).forEach(file => {
      if (file.endsWith('.tsx')) {
        const content = fs.readFileSync(path.join(screensDir, file), 'utf8');
        const screenName = path.basename(file, '.tsx');

        // Extract user interactions
        const userInteractions = content.match(/onPress|onChange|onSubmit|handle[A-Z]\w+/g) || [];

        // Extract state management
        const stateHooks = content.match(/useState|useReducer|useContext/g) || [];
        const customHooks = content.match(/use[A-Z]\w+/g) || [];

        // Extract API calls
        const apiCalls = content.match(/\.(get|post|put|delete|patch)\s*\(/g) || [];

        flows.push({
          screen: screenName,
          userInteractions: [...new Set(userInteractions)],
          stateManagement: [...new Set([...stateHooks, ...customHooks])],
          apiCalls: [...new Set(apiCalls)],
        });
      }
    });
  }

  // Analyze services for business logic
  const servicesDir = path.join(featurePath, 'services');
  const businessLogic = [];
  if (fs.existsSync(servicesDir)) {
    fs.readdirSync(servicesDir).forEach(file => {
      if (file.endsWith('.ts')) {
        const content = fs.readFileSync(path.join(servicesDir, file), 'utf8');
        const serviceName = path.basename(file, '.ts');

        // Extract methods
        const methods = content.match(/async\s+(\w+)\s*\([^)]*\)/g) || [];

        // Extract error handling
        const errorHandling = content.match(/try\s*{|catch\s*\(/g) || [];

        // Extract data transformations
        const transformations = content.match(/\.map|\.filter|\.reduce|\.transform/g) || [];

        businessLogic.push({
          service: serviceName,
          methods: methods.map(m => m.match(/async\s+(\w+)\s*\(/)[1]),
          errorHandling: errorHandling.length > 0,
          dataTransformations: [...new Set(transformations)],
        });
      }
    });
  }

  // Analyze hooks for state management
  const hooksDir = path.join(featurePath, 'hooks');
  const stateManagement = [];
  if (fs.existsSync(hooksDir)) {
    fs.readdirSync(hooksDir).forEach(file => {
      if (file.endsWith('.ts')) {
        const content = fs.readFileSync(path.join(hooksDir, file), 'utf8');
        const hookName = path.basename(file, '.ts');

        // Extract state variables
        const stateVars = content.match(/useState\([^)]*\)/g) || [];

        // Extract effects
        const effects = content.match(/useEffect\(/g) || [];

        // Extract dependencies
        const dependencies = content.match(/from ['"]([^'"]+)['"]/g) || [];

        stateManagement.push({
          hook: hookName,
          stateVariables: stateVars.length,
          effects: effects.length,
          dependencies: dependencies.map(d => d.replace(/from ['"]([^'"]+)['"]/, '$1')),
        });
      }
    });
  }

  return {
    featureName,
    flows,
    businessLogic,
    stateManagement,
  };
};

const generateFeatureFlowDoc = analysis => {
  const { featureName, flows, businessLogic, stateManagement } = analysis;
  const featureDocsDir = path.join(DOCS_DIR, featureName.toLowerCase());

  if (!fs.existsSync(featureDocsDir)) {
    fs.mkdirSync(featureDocsDir, { recursive: true });
  }

  const flowDoc = `# ${featureName} Feature Flow

## User Flows

${flows
  .map(
    flow => `### ${flow.screen} Screen
- **User Interactions**:
${flow.userInteractions.map(interaction => `  - ${interaction}`).join('\n')}
- **State Management**:
${flow.stateManagement.map(state => `  - ${state}`).join('\n')}
- **API Calls**:
${flow.apiCalls.map(api => `  - ${api}`).join('\n')}
`,
  )
  .join('\n')}

## Business Logic

${businessLogic
  .map(
    logic => `### ${logic.service} Service
- **Methods**:
${logic.methods.map(method => `  - ${method}`).join('\n')}
- **Error Handling**: ${logic.errorHandling ? 'Yes' : 'No'}
- **Data Transformations**:
${logic.dataTransformations.map(transform => `  - ${transform}`).join('\n')}
`,
  )
  .join('\n')}

## State Management

${stateManagement
  .map(
    state => `### ${state.hook} Hook
- **State Variables**: ${state.stateVariables}
- **Effects**: ${state.effects}
- **Dependencies**:
${state.dependencies.map(dep => `  - ${dep}`).join('\n')}
`,
  )
  .join('\n')}

## Feature Flow Diagram

\`\`\`mermaid
graph TD
    %% User Flows
    ${flows.map(flow => `    ${flow.screen}[${flow.screen} Screen]`).join('\n')}
    
    %% Business Logic
    ${businessLogic.map(logic => `    ${logic.service}[${logic.service} Service]`).join('\n')}
    
    %% State Management
    ${stateManagement.map(state => `    ${state.hook}[${state.hook} Hook]`).join('\n')}
    
    %% Connections
    ${flows
      .map(flow =>
        flow.userInteractions
          .map(
            interaction =>
              `${flow.screen} -->|${interaction}| ${flow.stateManagement.find(s => s.includes('use'))?.replace('use', '') || 'State'}`,
          )
          .join('\n'),
      )
      .join('\n')}
    
    ${stateManagement
      .map(state =>
        state.dependencies.map(dep => `${state.hook} -->|uses| ${dep.split('/').pop()}`).join('\n'),
      )
      .join('\n')}
    
    ${businessLogic
      .map(logic => logic.methods.map(method => `${logic.service} -->|${method}| API`).join('\n'))
      .join('\n')}
\`\`\`

## Key Features

${flows
  .map(
    flow => `### ${flow.screen}
- Handles user interactions: ${flow.userInteractions.join(', ')}
- Manages state through: ${flow.stateManagement.join(', ')}
- Makes API calls: ${flow.apiCalls.join(', ')}
`,
  )
  .join('\n')}

## Data Flow

1. **User Interaction**
   - User interacts with UI elements
   - Screen components handle user input
   - State hooks update local state

2. **Business Logic**
   - Services process user input
   - API calls are made
   - Data is transformed and validated

3. **State Updates**
   - Custom hooks manage complex state
   - Effects handle side effects
   - UI updates reflect new state

## Error Handling

${businessLogic
  .map(
    logic => `### ${logic.service}
- ${logic.errorHandling ? 'Implements error handling' : 'No error handling implemented'}
- Methods: ${logic.methods.join(', ')}
`,
  )
  .join('\n')}

## Generated On

${new Date().toISOString()}
`;

  fs.writeFileSync(path.join(featureDocsDir, 'flow.md'), flowDoc);
};

const generateAllFeatureFlows = () => {
  // Get list of features
  const features = fs
    .readdirSync(FEATURES_DIR)
    .filter(file => fs.statSync(path.join(FEATURES_DIR, file)).isDirectory());

  // Generate flow docs for each feature
  features.forEach(feature => {
    const featurePath = path.join(FEATURES_DIR, feature);
    const analysis = analyzeFeatureFlow(featurePath);
    generateFeatureFlowDoc(analysis);
  });

  // Generate main index file
  const indexContent = `# Feature Flows Documentation

## Available Features

${features
  .map(
    feature => `### [${feature}](./${feature.toLowerCase()}/flow.md)
- Detailed flow analysis
- User interactions
- Business logic
- State management
- Error handling
`,
  )
  .join('\n')}

## Documentation Structure

Each feature flow documentation includes:
- User flows and interactions
- Business logic and data processing
- State management details
- Flow diagrams
- Error handling strategies

## Generated On

${new Date().toISOString()}
`;

  fs.writeFileSync(path.join(DOCS_DIR, 'flows.md'), indexContent);
};

// Run the generator
generateAllFeatureFlows();
console.log('Feature flow documentation generated successfully!');
