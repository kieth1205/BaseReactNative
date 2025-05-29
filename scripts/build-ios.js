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

// Update iOS configuration
const updateIOSConfig = () => {
  const appName = ENV === 'production' ? 'Pokemon' : `Pokemon ${ENV}`;
  const bundleId = `com.pokemon.${ENV}`;

  // Update Info.plist
  const infoPlistPath = path.join(__dirname, '../ios/Pokemon/Info.plist');
  let infoPlistContent = fs.readFileSync(infoPlistPath, 'utf8');
  infoPlistContent = infoPlistContent.replace(
    /<key>CFBundleDisplayName<\/key>\s*<string>.*<\/string>/,
    `<key>CFBundleDisplayName</key>\n\t<string>${appName}</string>`,
  );
  infoPlistContent = infoPlistContent.replace(
    /<key>CFBundleIdentifier<\/key>\s*<string>.*<\/string>/,
    `<key>CFBundleIdentifier</key>\n\t<string>${bundleId}</string>`,
  );
  fs.writeFileSync(infoPlistPath, infoPlistContent);

  // Update project.pbxproj
  const projectPath = path.join(__dirname, '../ios/Pokemon.xcodeproj/project.pbxproj');
  let projectContent = fs.readFileSync(projectPath, 'utf8');
  projectContent = projectContent.replace(
    /PRODUCT_BUNDLE_IDENTIFIER = ".*";/g,
    `PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";`,
  );
  fs.writeFileSync(projectPath, projectContent);
};

// Build command
const buildCommand = () => {
  const scheme = ENV === 'production' ? 'Pokemon' : `Pokemon-${ENV}`;
  const configuration = BUILD_TYPE === 'release' ? 'Release' : 'Debug';
  const archivePath = path.join(__dirname, `../ios/build/${scheme}.xcarchive`);
  const exportPath = path.join(__dirname, `../ios/build/${scheme}`);

  // Create archive
  const archiveCommand = `cd ios && xcodebuild -workspace Pokemon.xcworkspace -scheme ${scheme} -configuration ${configuration} -archivePath ${archivePath} archive`;

  // Export IPA
  const exportCommand = `xcodebuild -exportArchive -archivePath ${archivePath} -exportPath ${exportPath} -exportOptionsPlist exportOptions.plist`;

  return `${archiveCommand} && ${exportCommand}`;
};

try {
  console.log(`Building iOS ${BUILD_TYPE} for ${ENV} environment...`);

  // Update iOS configuration
  updateIOSConfig();

  // Execute build command
  execSync(buildCommand(), { stdio: 'inherit' });

  // Copy build file to build directory
  const scheme = ENV === 'production' ? 'Pokemon' : `Pokemon-${ENV}`;
  const sourcePath = path.join(__dirname, `../ios/build/${scheme}/Pokemon.ipa`);

  copyBuildFile(sourcePath, 'ios', ENV, BUILD_TYPE);

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
