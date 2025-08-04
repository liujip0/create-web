#!/usr/bin/env node

import inquirer from 'inquirer';
import { init } from './utils/createProject.js';

(async () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-web-app'
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'Select project type:',
        choices: [
          {
            name: 'Fullstack',
            value: 'fullstack'
          },
          {
            name: 'Frontend Only',
            value: 'frontend'
          }
        ],
        default: 'fullstack'
      }
    ])
    .then((answers) => {
      init(answers.projectName, answers.projectType);
    })
    .catch(catchError);
})();

function catchError(error) {
  if (error.isTtyError) {
    console.error('Cannot render the prompt...');
  } else {
    console.error(error.message);
  }
}
