require('colors');
const { yellow } = require('colors');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(fs.writeFile);
const packageJson = require('./package.json');

const oldVersion = packageJson.version;
const scripts = packageJson.scripts;
const devDependencies = packageJson.devDependencies;

async function app() {
  // * compile typescript.
  console.log('\nCompiling typescript...\n'.blue);
  const tsc = await exec('node_modules\\.bin\\tsc');
  if (tsc.stderr) {
    console.error(tsc.stderr);
    return;
  }
  console.log('Typescript compiled successfully.'.green);

  // * compile with babel.
  console.log('\nCompiling and minifying with babel...\n'.blue);
  const babel = await exec('node_modules\\.bin\\babel lib -d lib');
  if (babel.stderr) {
    console.error(babel.stderr);
    return;
  }
  console.log(babel.stdout.green);

  // * update package.json.
  // update version.
  packageJson.version = packageJson.version.replace(/[0-9]+$/, +oldVersion.match(/[0-9]+$/)[0] + 1);
  console.log('Updating package.json version to'.blue, packageJson.version.yellow, '...'.blue);
  console.log(
    '\nRemoving'.blue,
    'scripts'.yellow,
    'and'.blue,
    'devDependencies'.yellow,
    'from'.blue,
    'package.json'.magenta,
    '...\n'.blue
  );
  // remove devDependencies.
  delete packageJson.devDependencies;
  // remove scripts.
  delete packageJson.scripts;
  await writeFile('package.json', JSON.stringify(packageJson, null, 2));

  // * publish to npm.
  console.log('Publishing to npm...'.blue);

  try {
    await exec('npm publish');
    console.log('\nPublished successfully.\n'.green);
    console.log('Restoring'.blue, 'package.json'.magenta, 'scripts'.yellow, 'and'.blue, 'devDependencies'.yellow, '...\n'.blue);
    packageJson.devDependencies = devDependencies;
    packageJson.scripts = scripts;
    await writeFile('package.json', JSON.stringify(packageJson, null, 2));
  } catch (error) {
    console.log('\nPublish failed!!'.red.bgBlack, '\n');
    console.log('Restoring package.json...\n'.blue);
    packageJson.version = oldVersion;
    packageJson.devDependencies = devDependencies;
    packageJson.scripts = scripts;
    await writeFile('package.json', JSON.stringify(packageJson, null, 2));
  }
}
app();
