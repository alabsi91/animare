import { rm } from 'fs/promises';
import { existsSync } from 'fs';
import { exec } from 'child_process';
import util from 'util';
import chalk from 'chalk';

const cmd = util.promisify(exec);
const libDir = './lib';

// * remove lib directory
async function clean() {
  const isDir = existsSync(libDir);
  if (!isDir) return;
  console.log(chalk.yellow('\n🧹 Cleaning lib directory ...'));
  try {
    await rm(libDir, { recursive: true });
    console.log(chalk.green('\n✅ Cleaned lib directory.'));
  } catch (e) {
    console.log(chalk.red(`\n⛔ Failed to clean lib directory !!`));
  }
}

// * compile typescript.
async function buildTS() {
  console.log(chalk.yellow('\n📦 Compiling typescript ...\n'));
  try {
    await cmd('node_modules\\.bin\\tsc');
    console.log(chalk.green('✅ Typescript compiled successfully.'));
  } catch (er) {
    console.log(chalk.red('⛔ Typescript compilation failed!!'));
  }
}

async function buildBabel() {
  console.log(chalk.yellow('\n📦 Compiling and minifying with babel ...\n'));
  try {
    const babel = await cmd('node_modules\\.bin\\babel lib -d lib');
    console.log(chalk.green('✅', babel.stdout));
  } catch (er) {
    console.log(chalk.red('⛔ Babel compilation failed!!'));
    return;
  }
}

async function main() {
  await clean();
  await buildTS();
  await buildBabel();
}

main();
