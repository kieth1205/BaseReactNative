const { getLatestBuildFile, deployToFirebase, deployToPlayStore } = require('./deploy-helper');

const ENV = process.argv[2] || 'development';
const TARGET = process.argv[3] || 'firebase';

if (!['development', 'staging', 'production'].includes(ENV)) {
  console.error('Invalid environment. Use: development, staging, or production');
  process.exit(1);
}

if (!['firebase', 'playstore'].includes(TARGET)) {
  console.error('Invalid target. Use: firebase or playstore');
  process.exit(1);
}

try {
  console.log(`Deploying Android build for ${ENV} environment to ${TARGET}...`);

  // Get latest build file
  const buildFile = getLatestBuildFile('android', ENV);
  console.log(`Found build file: ${buildFile.name}`);

  // Deploy based on target
  if (TARGET === 'firebase') {
    deployToFirebase('android', ENV, buildFile);
  } else if (TARGET === 'playstore' && ENV === 'production') {
    deployToPlayStore(buildFile);
  } else {
    console.error('Play Store deployment is only available for production environment');
    process.exit(1);
  }

  console.log('Deployment completed successfully!');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}
