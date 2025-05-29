const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const BACKUP_DIR = path.join(__dirname, '../.git-squash-backup');

const getCurrentBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
};

const getBaseBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD@{upstream}').toString().trim();
};

const getCommits = baseBranch => {
  return execSync(`git log ${baseBranch}..HEAD --pretty=format:"%h %s"`)
    .toString()
    .trim()
    .split('\n');
};

const createBackup = currentBranch => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupBranch = `backup/${currentBranch}-${timestamp}`;

  // Create backup branch
  execSync(`git branch ${backupBranch}`);
  console.log(`\nBackup branch created: ${backupBranch}`);

  // Create backup directory if it doesn't exist
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Save current state to file
  const backupFile = path.join(BACKUP_DIR, `${currentBranch}-${timestamp}.txt`);
  const currentState = execSync('git log --oneline').toString();
  fs.writeFileSync(backupFile, currentState);

  return backupBranch;
};

const restoreFromBackup = backupBranch => {
  try {
    execSync(`git reset --hard ${backupBranch}`);
    console.log('\nSuccessfully restored from backup branch');
  } catch (error) {
    console.error('Error restoring from backup:', error.message);
  }
};

const squashCommits = async () => {
  try {
    const currentBranch = getCurrentBranch();
    const baseBranch = getBaseBranch();

    // Check for uncommitted changes
    const status = execSync('git status --porcelain').toString();
    if (status) {
      console.log('\nWarning: You have uncommitted changes.');
      rl.question('Do you want to commit them before squashing? (y/n): ', async answer => {
        if (answer.toLowerCase() === 'y') {
          execSync('git add .');
          execSync('git commit -m "chore: commit changes before squash"');
        } else {
          console.log('Please commit or stash your changes before squashing.');
          rl.close();
          return;
        }
      });
    }

    console.log(`Current branch: ${currentBranch}`);
    console.log(`Base branch: ${baseBranch}`);

    const commits = getCommits(baseBranch);
    if (commits.length <= 1) {
      console.log('No commits to squash');
      return;
    }

    console.log('\nCommits to be squashed:');
    commits.forEach((commit, index) => {
      console.log(`${index + 1}. ${commit}`);
    });

    // Create backup before proceeding
    const backupBranch = createBackup(currentBranch);

    rl.question('\nEnter commit message for squashed commit: ', async message => {
      try {
        // Reset to base branch state but keep changes
        execSync(`git reset ${baseBranch}`);

        // Add all changes
        execSync('git add .');

        // Create new commit
        execSync(`git commit -m "${message}"`);

        console.log('\nCommits have been squashed successfully!');
        console.log(
          `\nIf anything goes wrong, you can restore from backup branch: ${backupBranch}`,
        );
        console.log('To restore, run:');
        console.log(`git reset --hard ${backupBranch}`);

        rl.question('\nDo you want to delete the backup branch? (y/n): ', answer => {
          if (answer.toLowerCase() === 'y') {
            execSync(`git branch -D ${backupBranch}`);
            console.log('Backup branch deleted');
          }
          rl.close();
        });
      } catch (error) {
        console.error('\nError during squash:', error.message);
        console.log('\nRestoring from backup...');
        restoreFromBackup(backupBranch);
        rl.close();
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    rl.close();
  }
};

squashCommits();
