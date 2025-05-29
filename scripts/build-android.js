const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { copyBuildFile } = require('./build-helper');

const ENV = process.argv[2] || 'development';
const BUILD_TYPE = process.argv[3] || 'debug';

if (!['development', 'staging', 'production'].includes(ENV)) {
  console.error('Invalid environment. Use: development, staging, or production');
  process.exit(1);
}

if (!['debug', 'release'].includes(BUILD_TYPE)) {
  console.error('Invalid build type. Use: debug or release');
  process.exit(1);
}

// Update app name and package name based on environment
const updateAndroidConfig = () => {
  const appName = ENV === 'production' ? 'Pokemon' : `Pokemon ${ENV}`;
  const packageName = `com.pokemon.${ENV}`;

  // Update strings.xml
  const stringsPath = path.join(__dirname, '../android/app/src/main/res/values/strings.xml');
  let stringsContent = fs.readFileSync(stringsPath, 'utf8');
  stringsContent = stringsContent.replace(
    /<string name="app_name">.*<\/string>/,
    `<string name="app_name">${appName}</string>`,
  );
  fs.writeFileSync(stringsPath, stringsContent);

  // Update build.gradle
  const buildGradlePath = path.join(__dirname, '../android/app/build.gradle');
  let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
  buildGradleContent = buildGradleContent.replace(
    /applicationId ".*"/,
    `applicationId "${packageName}"`,
  );
  fs.writeFileSync(buildGradlePath, buildGradleContent);
};

// Build command
const buildCommand = () => {
  const envSuffix = ENV === 'production' ? '' : `.${ENV}`;
  const buildType = BUILD_TYPE === 'release' ? 'release' : 'debug';

  return `cd android && ./gradlew assemble${buildType}${envSuffix}`;
};

try {
  console.log(`Building Android ${BUILD_TYPE} for ${ENV} environment...`);

  // Update Android configuration
  updateAndroidConfig();

  // Execute build command
  execSync(buildCommand(), { stdio: 'inherit' });

  // Copy build file to build directory
  const sourcePath = path.join(
    __dirname,
    '../android/app/build/outputs/apk',
    ENV,
    BUILD_TYPE,
    `app-${ENV}-${BUILD_TYPE}.apk`,
  );

  copyBuildFile(sourcePath, 'android', ENV, BUILD_TYPE);

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
