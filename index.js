#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const ncp = require("ncp").ncp;

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: "projectChoice",
    type: "list",
    message: "What project template would you like to generate?",
    choices: CHOICES,
  },
  {
    name: "projectName",
    type: "input",
    message: "Project name:",
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else
        return "Project name may only include letters, numbers, underscores and hashes.";
    },
  },
];

const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS).then((answers) => {
  const { projectChoice, projectName } = answers;

  const templatePath = `${__dirname}/templates/${projectChoice}`;
  const targetFolderPath = `${CURR_DIR}/${projectName}`;

  ncp(templatePath, targetFolderPath, (err) => {
    if (err) return console.error(err);

    console.log("done!");
  });
});
