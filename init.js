#!/usr/bin/env node
// File: init.js
import { Command } from "commander";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import chalk from "chalk";

const devDependencies = ["autoprefixer", "typescript"];

//required downloads for the components to work
const radixui = [
  "@radix-ui/react-aspect-ratio",
  "@radix-ui/react-avatar",
  "@radix-ui/react-checkbox",
  "@radix-ui/react-collapsible",
  "@radix-ui/react-collection",
  "@radix-ui/react-compose-refs",
  "@radix-ui/react-context",
  "@radix-ui/react-context-menu",
  "@radix-ui/react-dialog",
  "@radix-ui/react-direction",
  "@radix-ui/react-dismissable-layer",
  "@radix-ui/react-dropdown-menu",
  "@radix-ui/react-focus-guards",
  "@radix-ui/react-focus-scope",
  "@radix-ui/react-hover-card",
  "@radix-ui/react-icons",
  "@radix-ui/react-id",
  "@radix-ui/react-label",
  "@radix-ui/react-menu",
  "@radix-ui/react-navigation-menu",
  "@radix-ui/react-popover",
  "@radix-ui/react-popper",
  "@radix-ui/react-portal",
  "@radix-ui/react-presence",
  "@radix-ui/react-primitive",
  "@radix-ui/react-progress",
  "@radix-ui/react-radio-group",
  "@radix-ui/react-roving-focus",
  "@radix-ui/react-scroll-area",
  "@radix-ui/react-select",
  "@radix-ui/react-separator",
  "@radix-ui/react-slider",
  "@radix-ui/react-slot",
  "@radix-ui/react-switch",
  "@radix-ui/react-tabs",
  "@radix-ui/react-toast",
  "@radix-ui/react-toggle",
  "@radix-ui/react-toggle-group",
  "@radix-ui/react-toolbar",
  "@radix-ui/react-tooltip",
  "@radix-ui/react-use-callback-ref",
  "@radix-ui/react-use-controllable-state",
  "@radix-ui/react-use-escape-keydown",
  "@radix-ui/react-use-layout-effect",
  "@radix-ui/react-use-previous",
  "@radix-ui/react-use-rect",
  "@radix-ui/react-use-size",
  "@radix-ui/react-visually-hidden",
  "@radix-ui/rect",
  "@radix-ui/number",
  "@radix-ui/primitive",
  "@radix-ui/react-accessible-icon",
  "@radix-ui/react-accordion",
  "@radix-ui/react-alert-dialog",
  "@radix-ui/react-arrow",
];

console.log("The script is running");

console.log("setting dir variables...");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Getting installed packages
const installedPackageData = await fs.readFile(
  path.join(process.cwd(), "package.json"),
  "utf8"
);
const installedPackageDataJSON = JSON.parse(installedPackageData);

//Function to get user input for overwriting files
function getShouldOverwriteQuestion(file) {
  return [
    {
      type: "confirm",
      name: "shouldOverwrite",
      message: `File ${file} already exists. Overwrite?`,
    },
  ];
}

function installDependencies(packageManager, dependencies, isDev = false) {
  let installCommand = `${packageManager} install `;
  let installedPkgs = installedPackageDataJSON.dependencies;
  if (isDev) {
    installCommand += "-D";
    installedPkgs = installedPackageDataJSON.devDependencies;
  }

  for (const dependency of dependencies) {
    try {
      if (installedPkgs.hasOwnProperty(dependency)) {
        console.log(
          chalk.green(`${dependency} is already installed, skipping it...`)
        );
      } else {
        console.log(
          chalk.yellow(`${dependency} is not installed, installing now...`)
        );
        execSync(`${installCommand} ${dependency}`, { stdio: "inherit" });
      }
    } catch (error) {
      console.error(chalk.red(`Failed to install ${dependency}:`, error));
    }
  }
}

async function copy(destFile, fileName, sourceFile, shouldOverwrite) {
  if (await fs.pathExists(destFile)) {
    if (!shouldOverwrite) {
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
}

//Command
const init = new Command()
  .name("init")
  .description("Initialize tailed-ui package")
  .action(async () => {
    console.log("Initializing tailed-ui package...");
    //Getting directory structure from user
    const directoryQuestion = [
      {
        type: "list",
        name: "directory",
        message:
          "Which project structure are you using? (src = new, app = old):",
        choices: ["src", "app"],
      },
    ];

    const directoryAnswer = await inquirer.prompt(directoryQuestion);
    const directory = directoryAnswer.directory === "src" ? "src" : "./";
    console.log("Directory:", directory);
    //Copying components
    console.log("Copying components...");

    try {
      // const sourceDir = path.join(__dirname, 'src');
      // const destDir = path.join(process.cwd(), directory);
      // const files = await fs.readdir(sourceDir);

      const rootDestDir = path.join(process.cwd(), directory);

      const foldersToCopy = ["components", "lib", "styles"];

      for (const folder of foldersToCopy) {
        const sourceDir = path.join(__dirname, folder);
        const destDir = path.join(rootDestDir, folder);

        let shouldOverwrite = false;

        if (await fs.pathExists(destDir)) {
          const answer = await inquirer.prompt(
            getShouldOverwriteQuestion(folder)
          );
          shouldOverwrite = answer.shouldOverwrite;
        }

        const files = await fs.readdir(sourceDir);

        console.log(`directory: ${destDir} files: ${files}`);

        for (const file of files) {
          const sourceFile = path.join(sourceDir, file);
          const destFile = path.join(destDir, file);

          if (file === "global.css" && (await fs.pathExists(destFile))) {
            // make sure the first 3 lines of global.css matches the following
            // @import "quill.css" layer(quill);
            // @import "apexcharts.css" layer(apexcharts);
            // @import "tailed.css" layer(tailed);
            const globalCss = await fs.readFile(destFile, "utf8");
            const lines = globalCss.split("\n");
            const firstLine = '@import "quill.css" layer(quill);';
            const secondLine = '@import "apexcharts.css" layer(apexcharts);';
            const thirdLine = '@import "tailed.css" layer(tailed);';

            if (
              lines[0] === firstLine &&
              lines[1] === secondLine &&
              lines[2] === thirdLine
            ) {
              console.log(
                chalk.cyan(
                  `Skipping ${file} as it already exists, follow the instructions in README to configure it properly...`
                )
              );
              continue;
            }

            // insert the lines at the beginning of the file
            console.log(chalk.greenBright(`${file} Copying...`));

            lines.unshift(firstLine, secondLine, thirdLine);

            const newGlobalCss = lines.join("\n");

            await fs.writeFile(destFile, newGlobalCss);
          } else {
            await copy(destFile, file, sourceFile, shouldOverwrite);
          }
        }
      }

      // Copy tailwind.config.js, tailwind.flowbite.config.js, tailwind.shadcn.config.js, postcss.config.cjs

      const fileNames = [
        "tailwind.flowbite.config.js",
        "tailwind.shadcn.config.js",
        "tailwind.config.js",
        "postcss.config.js",
      ];

      for (const fileName of fileNames) {
        // Define the source file path and the destination file path
        const sourceFile = path.join(__dirname, fileName);
        let destFile = path.join(process.cwd(), fileName);

        let shouldOverwrite = false;

        if (await fs.pathExists(destFile)) {
          const answer = await inquirer.prompt(
            getShouldOverwriteQuestion(destFile)
          );
          shouldOverwrite = answer.shouldOverwrite;
        }

        // Check if the destination file already exists and ask the user if they want to overwrite it
        if (
          fileName === "tailwind.config.js" &&
          (await fs.pathExists(destFile))
        ) {
          const tailwindConfig = await fs.readFile(destFile, "utf8");

          const lines = tailwindConfig.split("\n");

          const firstLine =
            'const flowbite = require("./tailwind.flowbite.config.js");';
          const secondLine =
            'const shadcn = require("./tailwind.shadcn.config.js");';
          const thirdLine = "...flowbite,";
          const fourthLine = "...shadcn,";

          if (
            lines[0] === firstLine &&
            lines[1] === secondLine &&
            lines[2] === thirdLine &&
            lines[3] === fourthLine
          ) {
            console.log(
              chalk.cyan(
                `Skipping ${fileName} as it already exists, follow the instructions in README to configure it properly...`
              )
            );
            continue;
          }

          // insert the lines
          // third and fourth should be the first entry after module export, as follow:
          // module.exports = {
          //     ...flowbite,
          //     ...shadcn
          // };

          const moduleExportLine = "module.exports = {";

          // find the index of the module export line
          const moduleExportIndex = lines.findIndex((line) =>
            line.includes(moduleExportLine)
          );
          if (moduleExportIndex === -1) {
            console.error(`Failed to find ${moduleExportLine} in ${fileName}`);
            continue;
          }

          // insert the lines at the beginning of the file
          console.log(chalk.greenBright(`${fileName} Copying...`));

          lines.unshift(firstLine, secondLine);

          lines.splice(moduleExportIndex + 1, 0, thirdLine, fourthLine);

          const newTailwindConfig = lines.join("\n");

          await fs.writeFile(destFile, newTailwindConfig);
        } else {
          await copy(destFile, fileName, sourceFile, shouldOverwrite);
        }
      }

      //Install dependencies
      console.log("Installing dependencies...");
      //Dependencies listed in package.json
      const packageJson = await fs.readFile(
        path.join(__dirname, "package.json"),
        "utf8"
      );
      const packageData = JSON.parse(packageJson);

      const dependencies = Object.keys(packageData.dependencies).filter(
        (dep) =>
          !["fs-extra", "inquirer", "chalk"].includes(dep) && dep.trim() !== ""
      );

      console.log("dependencies:", dependencies);
      //Getting choice of package manager from user
      const questions = [
        {
          type: "list",
          name: "packageManager",
          message: "Which package manager do you want to use?",
          choices: ["npm", "yarn", "pnpm"],
        },
      ];

      const answers = await inquirer.prompt(questions);
      const packageManager = answers.packageManager;

      //dev dependencies install
      try {
        installDependencies(packageManager, devDependencies, true);
      } catch (error) {
        console.error(`Failed to install devDependencies:`, error);
      }

      //dependencies install

      installDependencies(packageManager, dependencies, false);

      //radix ui install
      console.log("Installing radix ui optional libraries...");

      installDependencies(packageManager, radixui, false);
      console.log("Restart typescript server if you see errors!");
      console.log(chalk.greenBright("tailed-ui installed🎉🎉🎉!"));
    } catch (error) {
      console.error("Failed to copy components:", error);
      process.exit(1);
    }
  });

init.parse(process.argv);
