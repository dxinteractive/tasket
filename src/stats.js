import Schedule from 'node-schedule';
import Notifier from 'node-notifier';
import fs from 'fs';
import os from 'os';
import taskfile from './taskfile';

import filter from 'unmutable/lib/filter';
import forEach from 'unmutable/lib/forEach';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import map from 'unmutable/lib/map';
import max from 'unmutable/lib/max';
import pipeWith from 'unmutable/lib/util/pipeWith';
import range from 'unmutable/lib/util/range';

export default ({filepath}) => {
    filepath = filepath.replace('~', os.homedir());
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) throw err;

        let categories = pipeWith(
            new taskfile(data).sumByCategory(),
            filter(get('category')),
            filter(_ => _.category !== "lunch"),
        );

        let categoryLengthMax = pipeWith(
            categories,
            map(_ => _.category.length),
            max()
        );

        let maxProportion = pipeWith(
            categories,
            map(_ => _.proportion),
            max()
        );

        pipeWith(
            categories,
            forEach(cat => {
                let {
                    duration,
                    category,
                    durationHours,
                    proportion
                } = cat;

                let categoryLength = category.length;
                let categoryPad = range(categoryLengthMax - categoryLength).map(_ => " ").join("");

                let percent = Number(proportion * 100).toFixed(1);
                let percentPad = range(5 - percent.length).map(_ => " ").join("");

                let hours = Number(durationHours).toFixed(1);
                let hoursPad = range(5 - hours.length).map(_ => " ").join("");

                let blocks = Math.floor((proportion / maxProportion) * 100);
                let notBlocks = 100 - blocks;
                let bar = range(blocks).map(_ => "█").join("");
                let notBar = range(notBlocks).map(_ => " ").join("");

                let categoryString = `| ${category}${categoryPad} | ${percentPad}${percent}% | ${hoursPad}${hours} hrs | ${bar}`;

                // nameColumnWidth
                console.log(categoryString);
            })
        )
    });
};