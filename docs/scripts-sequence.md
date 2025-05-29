# Scripts Sequence Diagram

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as Git
    participant Squash as squash-commits.js
    participant Build as build-*.js
    participant CI as GitHub Actions
    participant Release as GitHub Release

    %% Development Flow
    Dev->>Git: git add .
    Dev->>Git: git commit -m "feat: new feature"
    Dev->>Squash: yarn squash
    activate Squash
    Squash->>Git: Check uncommitted changes
    Squash->>Git: Create backup branch
    Squash->>Git: Squash commits
    Squash->>Dev: Show backup info
    deactivate Squash

    %% Build Flow
    Dev->>Build: yarn build:android/ios
    activate Build
    Build->>Build: Check environment
    Build->>Build: Update config files
    Build->>Build: Execute build command
    Build->>Dev: Return build artifacts
    deactivate Build

    %% Release Flow
    Dev->>Git: git tag v1.0.0
    Dev->>Git: git push origin v1.0.0
    Git->>CI: Trigger workflow
    activate CI
    CI->>CI: Run tests
    CI->>CI: Build Android
    CI->>CI: Build iOS
    CI->>Release: Create release
    CI->>Release: Upload artifacts
    deactivate CI
```

## Scripts Overview

### 1. squash-commits.js

- **Purpose**: Squash multiple commits into one
- **Flow**:
  1. Check for uncommitted changes
  2. Create backup branch
  3. Squash commits
  4. Provide restore instructions

### 2. build-android.js

- **Purpose**: Build Android app for different environments
- **Flow**:
  1. Validate environment and build type
  2. Update Android config files
  3. Execute Gradle build
  4. Output APK files

### 3. build-ios.js

- **Purpose**: Build iOS app for different environments
- **Flow**:
  1. Validate environment and build type
  2. Update iOS config files
  3. Execute xcodebuild
  4. Output IPA files

### 4. CI/CD Workflow (.github/workflows/ci.yml)

- **Purpose**: Automate build and release process
- **Flow**:
  1. Validate commits
  2. Run tests
  3. Build apps
  4. Create release
  5. Upload artifacts

## File Dependencies

```mermaid
graph TD
    A[package.json] --> B[squash-commits.js]
    A --> C[build-android.js]
    A --> D[build-ios.js]
    E[.github/workflows/ci.yml] --> C
    E --> D
    F[android/app/build.gradle] --> C
    G[ios/Podfile] --> D
```

## Environment Variables

### Android Build

- `ENV`: development | staging | production
- `BUILD_TYPE`: debug | release
- `APP_NAME`: App name for current environment
- `PACKAGE_NAME`: Package name for current environment

### iOS Build

- `ENV`: development | staging | production
- `BUILD_TYPE`: debug | release
- `APP_NAME`: App name for current environment
- `BUNDLE_ID`: Bundle ID for current environment

## Usage Examples

### Squash Commits

```bash
# Squash commits before PR
yarn squash
```

### Build Android

```bash
# Development build
yarn build:android:dev

# Production release
yarn build:android:prod:release
```

### Build iOS

```bash
# Development build
yarn build:ios:dev

# Production release
yarn build:ios:prod:release
```

### Create Release

```bash
# Create and push tag
git tag v1.0.0
git push origin v1.0.0
```
