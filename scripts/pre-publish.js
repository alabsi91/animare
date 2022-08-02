require('colors');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const removeFolder = util.promisify(fs.rm);
const isExist = util.promisify(fs.exists);

(async function app() {
  // * remove lib directory
  const isLib = await isExist('./lib');
  if (isLib) {
    console.log('\nRemoving'.blue, 'lib'.magenta, 'directory...'.blue);
    await removeFolder('./lib', { recursive: true });
    console.log('\nlib'.magenta, 'directory removed successfully.'.green);
  }

  // * compile typescript.
  console.log('\nCompiling typescript...\n'.blue);
  try {
    await exec('node_modules\\.bin\\tsc');
    console.log('Typescript compiled successfully.'.green);
  } catch (er) {
    console.log('Typescript compilation failed!!'.red.bgBlack);
    return;
  }

  // * compile with babel.
  console.log('\nCompiling and minifying with babel...\n'.blue);
  try {
    const babel = await exec('node_modules\\.bin\\babel lib -d lib');
    console.log(babel.stdout.green);
  } catch (er) {
    console.log('Babel compilation failed!!'.red.bgBlack);
    return;
  }
})();
