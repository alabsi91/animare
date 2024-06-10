import babel from '@babel/core';
import { promises as fs } from 'fs';
import { mkdir } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import prettier from 'prettier';
import ts from 'typescript';

// Paths
const srcDir = 'src';
const libDir = 'lib';
const tsLibDir = path.join(libDir, 'typescript');
const commonjsDir = path.join(libDir, 'commonjs');
const esmDir = path.join(libDir, 'module');
const prettierConfigPath = '.prettierrc.json';

// Clean lib directory
console.log('🧹 ', `Cleaning "${libDir}"...\n`);
await fs.rm(libDir, { recursive: true, force: true });

// Prettier configuration
const prettierOptions = await prettier.resolveConfig(prettierConfigPath);
prettierOptions.parser = 'babel';

// TypeScript Compiler Options
console.log('📦 ', `Generating TypeScript declaration files...`);

const tsConfigPath = path.resolve('tsconfig.json');
const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile).config;
tsConfig.compilerOptions.declarationDir = tsLibDir;
tsConfig.compilerOptions.emitDeclarationOnly = true;

const parsedCommandLine = ts.parseJsonConfigFileContent(tsConfig, ts.sys, path.dirname(tsConfigPath));

const tsFiles = await glob(srcDir + '/**/*.ts', { ignore: 'node_modules/**' });
const host = ts.createCompilerHost(parsedCommandLine.options);
const program = ts.createProgram(tsFiles, parsedCommandLine.options, host);
program.emit();

// Babel options
const babelOptions = (filename, sourceRoot, commonjs = false) => ({
  presets: [['@babel/preset-env', { targets: 'defaults', modules: commonjs ? 'commonjs' : false }], '@babel/preset-typescript'],
  filename,
  sourceRoot,
  sourceMaps: true,
});

for (const filePath of tsFiles) {
  const dir = path.dirname(filePath).replace(srcDir, ''); // file target directory
  const fileName = path.basename(filePath);
  const fileBaseName = path.basename(fileName, path.extname(fileName)); // without extension
  const fileContent = await fs.readFile(filePath, 'utf8');

  // commonjs paths
  const commonjsOutputDir = path.join(commonjsDir, dir);
  const commonjsOutputPath = path.join(commonjsOutputDir, `${fileBaseName}.js`);
  const commonjsMapOutputPath = path.join(commonjsOutputDir, `${fileBaseName}.js.map`);
  await mkdir(commonjsOutputDir, { recursive: true }); // Ensure directories exist

  // esm paths
  const esmOutputDir = path.join(esmDir, dir);
  const esmOutputPath = path.join(esmOutputDir, `${fileBaseName}.js`);
  const esmMapOutputPath = path.join(esmOutputDir, `${fileBaseName}.js.map`);
  await mkdir(esmOutputDir, { recursive: true }); // Ensure directories exist

  // Source root relative path for source maps
  const sourceRoot = path.relative(esmOutputDir, path.join(srcDir, dir)).replaceAll(path.sep, '/');

  console.log('\n' + fileName);

  // Transpile using Babel
  console.log('⚙️ ', `Transpiling: "${fileName}" to commonjs`);
  const commonjsResult = await babel.transformAsync(fileContent, babelOptions(fileName, sourceRoot, true));

  console.log('⚙️ ', `Transpiling: "${fileName}" to ESM`);
  const esmResult = await babel.transformAsync(fileContent, babelOptions(fileName, sourceRoot));

  // Format the code using Prettier
  prettierOptions.parser = 'babel';
  console.log('💄', `Formatting:  "${commonjsOutputPath}"`);
  const formattedCommonJSCode = await prettier.format(commonjsResult.code, prettierOptions);

  console.log('💄', `Formatting:  "${esmOutputPath}"`);
  const formattedESMCode = await prettier.format(esmResult.code, prettierOptions);

  // Format the source maps using Prettier
  prettierOptions.parser = 'json';
  console.log('💄', `Formatting:  "${commonjsMapOutputPath}"`);
  const formattedCommonJSMap = await prettier.format(JSON.stringify(commonjsResult.map ?? ''), prettierOptions);

  console.log('💄', `Formatting:  "${esmMapOutputPath}"`);
  const formattedESMMap = await prettier.format(JSON.stringify(esmResult.map ?? ''), prettierOptions);

  // Write the transpiled code and source maps to the respective directories
  console.log('✍️ ', `Writing:     "${commonjsOutputPath}"`);
  await fs.writeFile(commonjsOutputPath, formattedCommonJSCode, 'utf8');

  console.log('✍️ ', `Writing:     "${esmOutputPath}"`);
  await fs.writeFile(esmOutputPath, formattedESMCode, 'utf8');

  // write source maps if they exist
  if (commonjsResult.map) {
    console.log('✍️ ', `Writing:     "${commonjsMapOutputPath}"`);
    await fs.writeFile(commonjsMapOutputPath, formattedCommonJSMap, 'utf8');
  }

  if (esmResult.map) {
    console.log('✍️ ', `Writing:     "${esmMapOutputPath}"`);
    await fs.writeFile(esmMapOutputPath, formattedESMMap, 'utf8');
  }
}

console.log('\n✅ Compilation successful!\n');
