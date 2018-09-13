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
    .option('-f, --from <n>', 'From date (inclusive)')
    .option('-t, --to <n>', 'To date (exclusive)')
    .action((args): ?Promise<*> => {
        log(`stats`);
        stats({
            filepath,
            fromDate: args.from,
            toDate: args.to
        });
    });

commander
    .usage('[options] <file ...>')
    .parse(process.argv);