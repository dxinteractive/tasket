#!/usr/bin/env node
// @flow

import commander from 'commander';
import chalk from 'chalk';
import remind from './remind';

let log = (...args: Array<any>) => {
    console.log(chalk.blue('tasket'), ...args);
};

commander
    .command('remind')
    .action((): ?Promise<*> => {
        log(`A-tisket a-tasket, I'll ask where your task's at`);
        remind();
    });

commander
    .command('stats')
    .action((): ?Promise<*> => {
        log(`stats`);
    });

commander.parse(process.argv);