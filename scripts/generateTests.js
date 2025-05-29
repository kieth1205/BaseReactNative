const fs = require('fs');
const path = require('path');

const TEST_TEMPLATE = `import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { %componentName% } from '../%componentName%';

describe('%componentName%', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<%componentName% />);
    expect(getByTestId('%componentName%')).toBeTruthy();
  });
});
`;

const HOOK_TEST_TEMPLATE = `import { renderHook, act } from '@testing-library/react-hooks';
import { %hookName% } from '../%hookName%';

describe('%hookName%', () => {
  it('should work correctly', () => {
    const { result } = renderHook(() => %hookName%());
    expect(result.current).toBeDefined();
  });
});
`;

const SERVICE_TEST_TEMPLATE = `import { %serviceName% } from '../%serviceName%';

describe('%serviceName%', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should work correctly', () => {
    expect(%serviceName%).toBeDefined();
  });
});
`;

function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateTestFile(filePath, template, componentName) {
  const testDir = path.join(path.dirname(filePath), '__tests__');
  createDirectoryIfNotExists(testDir);

  const fileName = path.basename(filePath, path.extname(filePath));
  const testFileName = `${fileName}.test${path.extname(filePath)}`;
  const testFilePath = path.join(testDir, testFileName);

  const testContent = template.replace(/%componentName%|%hookName%|%serviceName%/g, componentName);

  if (!fs.existsSync(testFilePath)) {
    fs.writeFileSync(testFilePath, testContent);
    console.log(`Created test file: ${testFilePath}`);
  } else {
    console.log(`Test file already exists: ${testFilePath}`);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('__') && file !== 'node_modules') {
      processDirectory(filePath);
    } else if (stat.isFile() && file.endsWith('.tsx') && !file.includes('.test.')) {
      const componentName = path.basename(file, '.tsx');
      generateTestFile(filePath, TEST_TEMPLATE, componentName);
    } else if (stat.isFile() && file.endsWith('.ts') && !file.includes('.test.')) {
      const fileName = path.basename(file, '.ts');
      if (file.startsWith('use')) {
        generateTestFile(filePath, HOOK_TEST_TEMPLATE, fileName);
      } else if (file.endsWith('Service.ts')) {
        generateTestFile(filePath, SERVICE_TEST_TEMPLATE, fileName);
      }
    }
  });
}

// Start processing from src directory
const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
} else {
  console.error('src directory not found');
}
