const fs = require('fs');
const path = require('path');

const getBuildPath = (platform, environment) => {
  const buildDir = path.join(__dirname, '../build', platform, environment);
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  return buildDir;
};

const getBuildFileName = (platform, environment, buildType) => {
  const date = new Date().toISOString().split('T')[0];
  const appName = 'Pokemon';
  const env = environment === 'production' ? 'prod' : environment;
  const type = buildType === 'release' ? 'release' : 'debug';

  return `${appName}_${env}_${date}.${platform === 'ios' ? 'ipa' : 'apk'}`;
};

const copyBuildFile = (sourcePath, platform, environment, buildType) => {
  const buildDir = getBuildPath(platform, environment);
  const fileName = getBuildFileName(platform, environment, buildType);
  const targetPath = path.join(buildDir, fileName);

  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Build file copied to: ${targetPath}`);
  return targetPath;
};

module.exports = {
  getBuildPath,
  getBuildFileName,
  copyBuildFile,
};
