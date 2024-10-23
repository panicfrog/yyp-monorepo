const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const fs = require('fs');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

// 判断路径是否为目录
function isDirectory(source) {
  return fs.lstatSync(source).isDirectory();
}

// 获取工作区中的包路径
function getWorkspaces() {
  const rootPackageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'));
  const workspaces = rootPackageJson.workspaces;

  // 解析 "packages/*" 格式
  const packagePaths = workspaces.flatMap(workspacePattern => {
    const workspaceDir = workspacePattern.includes('*') ? workspacePattern.split('/*')[0] : workspacePattern;
    const resolvedPath = path.resolve(__dirname, `../../${workspaceDir}`);
    
    // 只返回目录路径
    return fs.readdirSync(resolvedPath)
      .map(pkg => path.resolve(resolvedPath, pkg))
      .filter(isDirectory); // 只包含目录
  });

  return packagePaths;
}

// 获取工作区的路径
const workspacePaths = getWorkspaces();

const config = {
  resolver: {
    // 动态设置 nodeModulesPaths 和 extraNodeModules
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
      ...workspacePaths.map(pkg => path.resolve(pkg, 'node_modules'))
    ],
    extraNodeModules: workspacePaths.reduce((acc, pkg) => {
      const packageJsonPath = path.resolve(pkg, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        acc[packageJson.name] = pkg;
      }
      return acc;
    }, {})
  },
  watchFolders: [
    ...workspacePaths,
    path.resolve(__dirname, '../..')  // Monorepo 根目录
  ]
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);