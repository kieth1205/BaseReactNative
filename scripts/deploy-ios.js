const { getLatestBuildFile, deployToFirebase, deployToAppStore } = require('./deploy-helper');

const ENV = process.argv[2] || 'development';
const TARGET = process.argv[3] || 'firebase';

if (!['development', 'staging', 'production'].includes(ENV)) {
  console.error('Invalid environment. Use: development, staging, or production');
  process.exit(1);
}

if (!['firebase', 'appstore'].includes(TARGET)) {
  console.error('Invalid target. Use: firebase or appstore');
  process.exit(1);
}

try {
  console.log(`Deploying iOS build for ${ENV} environment to ${TARGET}...`);

  // Get latest build file
  const buildFile = getLatestBuildFile('ios', ENV);
  console.log(`Found build file: ${buildFile.name}`);

  // Deploy based on target
  if (TARGET === 'firebase') {
    deployToFirebase('ios', ENV, buildFile);
  } else if (TARGET === 'appstore' && ENV === 'production') {
    deployToAppStore(buildFile);
  } else {
    console.error('App Store deployment is only available for production environment');
    process.exit(1);
  }

  console.log('Deployment completed successfully!');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}
