#!/usr/bin/env node
// @flow

import commander from 'commander';
import log from './log';
import open from './open';
import remind from './remind';
import stats from './stats';

let filepath = '~/Desktop/time.md';

commander
    .command('open')
    .action((): ?Promise<*> => {
        open({
            filepath
        });
    });

commander
    .command('remind')
    .action((): ?Promise<*> => {
        log(`A-tisket a-tasket, I'll ask where your task's at`);
        remind({
            filepath
        });
    });

commander
    .command('stats')
    .action((): ?Promise<*> => {
        log(`stats`);
        stats({
            filepath
        });
    });

commander
    .usage('[options] <file ...>')
    .parse(process.argv);