import Schedule from 'node-schedule';
import Notifier from 'node-notifier';

var {exec} = require('child_process');

export default () => {
    var remind = () => {
        nc.notify({
            title: 'Tasket',
            message: 'What are you doing?',
            sound: true,
            wait: true,
            timeout: 5
        });
    };

    var openTime = () => exec('subl ~/Desktop/time.md');

    var rule = new Schedule.RecurrenceRule();
    rule.minute = 50;

    var nc = new Notifier.NotificationCenter();

    var j = Schedule.scheduleJob(rule, remind);

    nc.on('click', (obj, options, metadata) => {
        openTime();
    });

    nc.on('timeout', (obj, options, metadata) => {
        openTime();
    });

    remind();
};