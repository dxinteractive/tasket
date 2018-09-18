// @flow

import chalk from 'chalk';

export default (...args: Array<any>) => {
    console.log(chalk.blue('tasket'), ...args);
};
