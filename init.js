#!/usr/bin/env node
// File: init.js
import { Command } from 'commander';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';
const devDependencies = [
    "autoprefixer",
    "typescript"
]

//required downloads for the components to work
const radixui = [
    '@radix-ui/react-aspect-ratio',
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-collapsible',
    '@radix-ui/react-collection',
    '@radix-ui/react-compose-refs',
    '@radix-ui/react-context',
    '@radix-ui/react-context-menu',
    '@radix-ui/react-dialog',
    '@radix-ui/react-direction',
    '@radix-ui/react-dismissable-layer',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-focus-guards',
    '@radix-ui/react-focus-scope',
    '@radix-ui/react-hover-card',
    '@radix-ui/react-icons',
    '@radix-ui/react-id',
    '@radix-ui/react-label',
    '@radix-ui/react-menu',
    '@radix-ui/react-navigation-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-popper',
    '@radix-ui/react-portal',
    '@radix-ui/react-presence',
    '@radix-ui/react-primitive',
    '@radix-ui/react-progress',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-roving-focus',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slider',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    '@radix-ui/react-toggle',
    '@radix-ui/react-toggle-group',
    '@radix-ui/react-toolbar',
    '@radix-ui/react-tooltip',
    '@radix-ui/react-use-callback-ref',
    '@radix-ui/react-use-controllable-state',
    '@radix-ui/react-use-escape-keydown',
    '@radix-ui/react-use-layout-effect',
    '@radix-ui/react-use-previous',
    '@radix-ui/react-use-rect',
    '@radix-ui/react-use-size',
    '@radix-ui/react-visually-hidden',
    '@radix-ui/rect',
    '@radix-ui/names.txt',
    '@radix-ui/number',
    '@radix-ui/primitive',
    '@radix-ui/react-accessible-icon',
    '@radix-ui/react-accordion',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-arrow',

]

console.log("The script is running");

console.log("setting dir variables...");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Getting installed packages
const installedPackageData = await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8');
const installedPackageDataJSON = JSON.parse(installedPackageData);

//Function to get user input for overwriting files
function getShouldOverwriteQuestion(file) {

    return [{
        type: 'confirm',
        name: 'shouldOverwrite',
        message: `File ${file} already exists. Overwrite?`,
    }]
};

function installDependencies(packageManager, dependencies, isDev = false) {
    let installCommand = `${packageManager} install `;
    if (isDev) {
        installCommand += '-D';
    }


    for (const dependency of dependencies) {
        try {

            if (installedPackageDataJSON.devDependencies.hasOwnProperty(dependency)) {
                console.log(chalk.green(`${dependency} is already installed, skipping it...`));
            }
            else {
                console.log(chalk.yellow(`${dependency} is not installed, installing now...`));
                execSync(`${installCommand} ${dependency}`, { stdio: 'inherit' });
            }
        }
        catch (error) {
            console.error(chalk.red(`Failed to install ${dependency}:`, error));
        }
    }
}

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



            // Check if the destination file already exists and ask the user if they want to overwrite it
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

            //dev dependencies install
            try {
                installDependencies(packageManager, devDependencies, true);

            }
            catch (error) {
                console.error(`Failed to install devDependencies:`, error);
            }

            //dependencies install

            installDependencies(packageManager, dependencies, false);


            //radix ui install
            console.log('Installing radix ui optional libraries...');

            installDependencies(packageManager, radixui, false);

            console.log(chalk.greenBright('shadcn-custom installed🎉🎉🎉!'));


        }
        catch (error) {
            console.error('Failed to copy components:', error);
            process.exit(1);
        }
    });
init.parse(process.argv);
