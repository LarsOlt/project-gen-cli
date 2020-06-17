#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const ncp = require("ncp").ncp;
const exec = require("child_process").execSync;

const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const CURRENT_DIR = process.cwd();

const QUESTIONS = [
  {
    name: "projectChoice",
    type: "list",
    message: "Which project template would you like to use?",
    choices: CHOICES,
  },
  {
    name: "projectName",
    type: "input",
    message: "Project name:",
    validate: function (input) {
      if (fs.existsSync(`${CURRENT_DIR}/${input}`)) {
        return "There is already a project with this name.";
      }

      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return "Project name may only include letters, numbers, underscores and hashes.";
    },
  },
];


inquirer.prompt(QUESTIONS).then((answers) => {
  const { projectChoice, projectName } = answers;

  const templatePath = `${__dirname}/templates/${projectChoice}`;
  const targetFolderPath = `${CURRENT_DIR}/${projectName}`;

  ncp(templatePath, targetFolderPath, (err) => {
    if (err) return console.error(err);

    console.log("\nInstalling dependencies...\n");

    // cd inside the created folder and install the dependencies
    exec(
      `cd ${targetFolderPath} && npm i`,
      { stdio: "inherit" },
      (err, stdout, stderr) => {
        console.log(stdout);
      }
    );
  });
});
