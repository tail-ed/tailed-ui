#!/usr/bin/env node
// File: init.js
import { Command } from 'commander';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';


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

            const sourceDir = path.join(__dirname, '/src');
            const destDir = path.join(process.cwd(), '/src');
            const files = await fs.readdir(sourceDir);
            for (const file of files) {
                if (file !== 'stories') {
                    const sourceFile = path.join(sourceDir, file);
                    const destFile = path.join(destDir, file);
                    if (await fs.pathExists(destFile)) {
                        const answer = await new Promise((resolve) => {
                            rl.question(`File ${destFile} already exists. Overwrite? (y/n) `, resolve);
                        });
                        if (answer.toLowerCase() !== 'y') {
                            continue;
                        }
                        await fs.copy(sourceFile, destFile);
                    }
                }
            }

            //Install dependencies
            console.log('Installing dependencies...');
            const packageJson = await fs.readFile(path.join(__dirname, 'package.json'), 'utf8');
            const packageData = JSON.parse(packageJson);
            const dependencies = Object.keys(packageData.dependencies)
                .filter(dep => !['fs-extra'].includes(dep))
                .join(' ');
            for (const dependency of dependencies) {
                execSync(`npm install ${dependency}`, { stdio: 'inherit' });
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
