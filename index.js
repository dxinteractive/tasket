console.log("okay hi there I'll remind you");

var schedule = require('node-schedule');
var notifier = require('node-notifier');
var {exec} = require('child_process');

var openTime = () => exec('subl ~/Desktop/time.md');

var rule = new schedule.RecurrenceRule();
rule.minute = 50;

var nc = new notifier.NotificationCenter();

var j = schedule.scheduleJob(rule, () => {
    nc.notify({
        title: 'Tasket',
        message: 'What are you doing?',
        sound: true,
        wait: true,
        timeout: 5
    });
});

nc.on('click', (obj, options, metadata) => {
    openTime();
});

nc.on('timeout', (obj, options, metadata) => {
    openTime();
});