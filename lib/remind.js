'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _nodeNotifier = require('node-notifier');

var _nodeNotifier2 = _interopRequireDefault(_nodeNotifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('child_process'),
    exec = _require.exec;

exports.default = function () {
    var remind = function remind() {
        nc.notify({
            title: 'Tasket',
            message: 'What are you doing?',
            sound: true,
            wait: true,
            timeout: 5
        });
    };

    var openTime = function openTime() {
        return exec('subl ~/Desktop/time.md');
    };

    var rule = new _nodeSchedule2.default.RecurrenceRule();
    rule.minute = 50;

    var nc = new _nodeNotifier2.default.NotificationCenter();

    var j = _nodeSchedule2.default.scheduleJob(rule, remind);

    nc.on('click', function (obj, options, metadata) {
        openTime();
    });

    nc.on('timeout', function (obj, options, metadata) {
        openTime();
    });

    remind();
};