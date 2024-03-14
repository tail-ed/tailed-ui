#!/usr/bin/env node
// File: init.js
import { Command } from 'commander';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import inquirer from 'inquirer';
import chalk from 'chalk';


console.log("The script is running");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout

});
console.log("setting dir variables...");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Command
const init = new Command()
    .name('init')
    .description('Initialize shadcn-custom package')
    .action(async () => {
        console.log('Initializing shadcn-custom package...');

        //Copying components
        console.log('Copying components...');
        try {

            const sourceDir = path.join(__dirname, 'src');
            const destDir = path.join(process.cwd(), 'src');
            const files = await fs.readdir(sourceDir);
            for (const file of files) {
                console.log('file:', file);
                if (file !== 'stories') {
                    const sourceFile = path.join(sourceDir, file);
                    const destFile = path.join(destDir, file);
                    if (await fs.pathExists(destFile)) {
                        const answer = await new Promise((resolve) => {
                            rl.question(`File ${file} already exists. Overwrite? (y/n) `, resolve);
                        });
                        if (answer.toLowerCase() !== 'y') {
                            continue;
                        }
                        console.log(chalk.greenBright(`${file} Copying...`));
                        await fs.copy(sourceFile, destFile);
                    }
                    //If no duplicate file, copy the file
                    console.log(chalk.greenBright(`${file} Copying...`));
                    await fs.copy(sourceFile, destFile);
                }
            }

            //Install dependencies
            console.log('Installing dependencies...');
            //Dependencies listed in package.json
            const packageJson = await fs.readFile(path.join(__dirname, 'package.json'), 'utf8');
            const packageData = JSON.parse(packageJson);
            //dependencies listed in user's package.json
            const installedPackageData = await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8');
            const installedPackageDataJSON = JSON.parse(installedDependenciesJson);

            const dependencies = Object.keys(packageData.dependencies)
                .filter(dep => !['fs-extra', 'inquirer', 'chalk'].includes(dep) && dep.trim() !== '');

            console.log('dependencies:', dependencies);
            //Getting choice of package manager from user
            const questions = [{
                type: 'list',
                name: 'packageManager',
                message: 'Which package manager do you want to use?',
                choices: ['npm', 'yarn', 'pnpm'],
            }];

            const answers = await inquirer.prompt(questions);
            const packageManager = answers.packageManager;
            for (const dependency of dependencies) {
                try {
                    if (installedPackageDataJSON.dependencies.hasOwnProperty(dependency)) {
                        console.log(chalk.green(`${dependency} is already installed, skipping it...`));

                    }
                    else {
                        console.log(chalk.yellow(`${dependency} is not installed, installing now...`));
                        execSync(`${packageManager} install ${dependency}`, { stdio: 'inherit' });
                    }
                }
                catch (error) {

                    console.error(`Failed to install ${dependency}:`, error);

                }

            }

            console.log('shadcn-custom installed!');
            rl.close();

        }
        catch (error) {
            console.error('Failed to copy components:', error);
            process.exit(1);
        }
    });
init.parse(process.argv);
