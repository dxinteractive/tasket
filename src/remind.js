import Schedule from 'node-schedule';
import Notifier from 'node-notifier';
import open from './open';

export default ({filepath}) => {
    var remind = () => {
        nc.notify({
            title: 'Tasket',
            message: 'What are you doing?',
            sound: true,
            wait: true,
            timeout: 5
        });
    };

    var rule = new Schedule.RecurrenceRule();
    rule.minute = 50;

    var nc = new Notifier.NotificationCenter();

    var j = Schedule.scheduleJob(rule, remind);

    nc.on('click', (obj, options, metadata) => {
        open({filepath});
    });

    nc.on('timeout', (obj, options, metadata) => {
        open({filepath});
    });

    remind();
};