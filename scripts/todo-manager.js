const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Constants
const TODO_PATTERN = /\/\/\s*TODO:?\s*(.+)/g;
const DONE_PATTERN = /\/\/\s*TODO:?\s*\[DONE\]\s*(.+)/g;
const FEATURES_DIR = path.join(__dirname, '../src/features');
const OUTPUT_FILE = path.join(__dirname, '../TODO.md');

// Helper functions
const getAllFiles = dir => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });

  return results;
};

const extractTodos = (content, filePath) => {
  const todos = [];
  let match;

  while ((match = TODO_PATTERN.exec(content)) !== null) {
    const line = content.substring(0, match.index).split('\n').length;
    todos.push({
      text: match[1].trim(),
      file: path.relative(process.cwd(), filePath),
      line,
      done: false,
    });
  }

  while ((match = DONE_PATTERN.exec(content)) !== null) {
    const line = content.substring(0, match.index).split('\n').length;
    todos.push({
      text: match[1].trim(),
      file: path.relative(process.cwd(), filePath),
      line,
      done: true,
    });
  }

  return todos;
};

const groupTodosByFeature = todos => {
  const groups = {};

  todos.forEach(todo => {
    const featureMatch = todo.file.match(/features\/([^/]+)/);
    const feature = featureMatch ? featureMatch[1] : 'Other';

    if (!groups[feature]) {
      groups[feature] = [];
    }

    groups[feature].push(todo);
  });

  return groups;
};

const generateMarkdown = groups => {
  let markdown = '# Project TODOs\n\n';

  Object.entries(groups).forEach(([feature, todos]) => {
    markdown += `## ${feature}\n\n`;

    const pendingTodos = todos.filter(todo => !todo.done);
    const completedTodos = todos.filter(todo => todo.done);

    if (pendingTodos.length > 0) {
      markdown += '### Pending\n\n';
      pendingTodos.forEach(todo => {
        markdown += `- [ ] ${todo.text}\n`;
        markdown += `  - File: \`${todo.file}:${todo.line}\`\n\n`;
      });
    }

    if (completedTodos.length > 0) {
      markdown += '### Completed\n\n';
      completedTodos.forEach(todo => {
        markdown += `- [x] ${todo.text}\n`;
        markdown += `  - File: \`${todo.file}:${todo.line}\`\n\n`;
      });
    }

    markdown += '\n';
  });

  return markdown;
};

const checkAllTodosCompleted = groups => {
  return Object.values(groups).every(todos => todos.every(todo => todo.done));
};

const buildDev = () => {
  try {
    console.log('Building development version...');
    execSync('yarn build:android --env development', { stdio: 'inherit' });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
  }
};

// Main execution
const main = () => {
  const files = getAllFiles(FEATURES_DIR);
  let allTodos = [];

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const todos = extractTodos(content, file);
    allTodos = allTodos.concat(todos);
  });

  const groupedTodos = groupTodosByFeature(allTodos);
  const markdown = generateMarkdown(groupedTodos);

  fs.writeFileSync(OUTPUT_FILE, markdown);
  console.log(`TODO list has been generated at ${OUTPUT_FILE}`);

  if (checkAllTodosCompleted(groupedTodos)) {
    console.log('All TODOs are completed!');
    buildDev();
  } else {
    console.log('Some TODOs are still pending.');
  }
};

main();
