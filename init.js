#!/usr/bin/env node
// File: init.js
import { Command } from 'commander';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';


console.log("The script is running");

console.log("setting dir variables...");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getShouldOverwriteQuestion(file) {

    return [{
        type: 'confirm',
        name: 'shouldOverwrite',
        message: `File ${file} already exists. Overwrite?`,
    }]
};

//Command
const init = new Command()
    .name('init')
    .description('Initialize shadcn-custom package')
    .action(async () => {
        console.log('Initializing shadcn-custom package...');
        //Getting directory structure from user
        const directoryQuestion = [{
            type: 'list',
            name: 'directory',
            message: 'Which project structure are you using? (src = new, app = old):',
            choices: ['src', 'app'],
        }];
        const directoryAnswer = await inquirer.prompt(directoryQuestion);
        const directory = directoryAnswer.directory === 'src' ? 'src' : './';
        console.log('Directory:', directory);
        //Copying components
        console.log('Copying components...');
        try {

            const sourceDir = path.join(__dirname, 'src');
            const destDir = path.join(process.cwd(), directory);
            const files = await fs.readdir(sourceDir);
            for (const file of files) {
                if (file !== 'stories') {
                    const sourceFile = path.join(sourceDir, file);
                    const destFile = path.join(destDir, file);

                    if (await fs.pathExists(destFile)) {
                        const answer = await inquirer.prompt(getShouldOverwriteQuestion(file));
                        if (answer.shouldOverwrite === false) {
                            continue;
                        }
                        console.log(chalk.greenBright(`${file} Copying...`));
                        try {
                            await fs.copy(sourceFile, destFile);
                        }
                        catch (error) {
                            console.error('Failed to copy file:', error);
                        }
                    }
                    else {

                        //If no duplicate file, copy the file
                        try {
                            console.log(chalk.greenBright(`${file} Copying...`));
                            await fs.copy(sourceFile, destFile);

                        }
                        catch (error) {
                            console.error('Failed to copy file:', error);
                        }
                    }
                }
            }

            // Copy tailwind.config.js
            const fileName = 'tailwind.config.js';

            // Define the source file path and the destination file path
            const sourceFile = path.join(__dirname, fileName);
            let destFile = path.join(process.cwd(), fileName);



            // Check if the destination file already exists
            if (await fs.pathExists(destFile)) {
                const answer = await inquirer.prompt(getShouldOverwriteQuestion(fileName));
                if (answer.shouldOverwrite === false) {
                    console.log(`Skipping ${fileName}...`);
                } else {
                    console.log(chalk.greenBright(`${fileName} Copying...`));
                    await fs.copy(sourceFile, destFile);
                }
            } else {
                // If no duplicate file, copy the file
                console.log(chalk.greenBright(`${fileName} Copying...`));
                await fs.copy(sourceFile, destFile);
            }
            //postcss.config

            const postcss = 'postcss.config.js';

            // Define the source file path and the destination file path
            const postcssSource = path.join(__dirname, postcss);
            let postcssDest = path.join(process.cwd(), postcss);


            // Check if the destination file already exists
            if (await fs.pathExists(postcssDest)) {
                const answer = await inquirer.prompt(getShouldOverwriteQuestion(postcss));
                if (answer.shouldOverwrite === false) {
                    console.log(`Skipping ${postcss}...`);
                } else {
                    console.log(chalk.greenBright(`${postcss} Copying...`));
                    await fs.copy(postcssSource, postcssDest);
                }
            } else {
                // If no duplicate file, copy the file
                console.log(chalk.greenBright(`${postcss} Copying...`));
                await fs.copy(postcssSource, postcssDest);
            }


            //Install dependencies
            console.log('Installing dependencies...');
            //Dependencies listed in package.json
            const packageJson = await fs.readFile(path.join(__dirname, 'package.json'), 'utf8');
            const packageData = JSON.parse(packageJson);
            //dependencies listed in user's package.json
            const installedPackageData = await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8');
            const installedPackageDataJSON = JSON.parse(installedPackageData);

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


        }
        catch (error) {
            console.error('Failed to copy components:', error);
            process.exit(1);
        }
    });
init.parse(process.argv);
