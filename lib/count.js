'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filter = require('unmutable/lib/filter').default;
var flatMap = require('unmutable/lib/flatMap').default;
var has = require('unmutable/lib/has').default;
var identity = require('unmutable/lib/identity').default;
var last = require('unmutable/lib/last').default;
var isEmpty = require('unmutable/lib/isEmpty').default;
var map = require('unmutable/lib/map').default;
var reduce = require('unmutable/lib/reduce').default;
var set = require('unmutable/lib/set').default;
var update = require('unmutable/lib/update').default;
var updateInto = require('unmutable/lib/updateInto').default;
var pipe = require('unmutable/lib/util/pipe').default;
var pipeWith = require('unmutable/lib/util/pipeWith').default;

var file = '\n# Time\n\n## 07-08-2018 Tuesday\n\n- 8:15 SRM\n- 9:00 rocio catchup + resumes\n- 11:30 SRM\n- 11:50 SRM\n- 12:50 SRM (entities and loaders)\n- 1:50 SRM (styles)\n- 2:50 SRM (header, footer and navigation)\n- 3:50 SRM (front page)\n\n## 08-08-2018 Wednesday\n\n- 9:30 start\n- 10:30 SRM\n- 11:00 interview pre-interview\n- 12:00 interview\n- 12:45 interview debrief\n- 1:00 jordan\n- 1:15 SRM\n- 2:00 interview post-interview chat\n- 2:30 lunch\n- 2:50 SRM\n- 4:00 SRM\n- 5:00 interview\n- 6:00 interview post-interview chat\n\n## 09-08-2018 Thursday\n\n- 8:00 start\n- 8:20 SRM document search\n- 8:40 interview discussion\n- 9:15 SRM document search\n- 9:45 mitsubishi mocks\n- 10:15 standup\n- 12:00 mitsubishi mocks \n- 12:15 mitsubishi mocks\n- 1:00 lunch\n- 1:30 interview candidates chat with paul\n- 2:00 towing-guide and computer problems\n- 2:50 towing-guide content\n- 3:50 mitsubishi mocks / PR reviews / SRM\n\n## 10-08-2018 Friday\n\n- 7:30 start\n- 8:00 mitsubishi tweaks and deploy prep\n- 8:30 parcels\n- 8:50 SRM\n- 9:30 SRM\n- 10:30 standup + project discussions\n- 11:00 mitsubishi tweaks and deploy prep, interview discussion\n- 12:00 mitsubishi deploy prep, SRM\n- 12:20 interview post-interview chat\n- 12:50 SRM\n- 1:45 lunch and service discovery chat\n- 2:50 SRM\n- 3:50 SRM\n\n----------------------------\n\n## 13-08-2018 Monday\n\n- 8:00 start\n- 8:30 SRM\n- 9:30 SRM\n- 10:00 frontend docs\n- 10:15 standup\n- 10:45 frontend docs discussion\n- 11:15 mitsubishi admin fix and learning records pagination\n- 11:50 mitsubishi admin fix and learning records pagination\n- 12:30 mitsubishi admin fix and learning records pagination\n- 1:15 lunch\n- 1:40 mitsubishi admin fix\n- 2:00 parcels help\n- 2:30 mitsubishi admin fix and learning records pagination\n- 3:00 SRM\n- 3:30 mitsubishi deploy prep\n- 3:45 devchat and PDP chat\n- 4:00 mitsubishi deploy prep\n- 4:20 mitsubishi deploy prep\n\n-------------------\n\n## 14-08-2018 Tuesday\n\n- 7:50 start\n- 8:00 mitsubishi screenshots\n- 9:15 devcatchup with allan\n- 9:50 ?\n- 10:50 frontend with paul\n- 11:20 frontend discussion\n- 11:50 mitsubishi PDP + style\n- 12:40 lunch\n- 1:10 mitsubishi style\n- 1:50 mitsubishi style\n- 2:50 mitsubishi PDP + style\n- 2:50 mitsubishi PDP + style\n- 3:50 mitsubishi PDP + style\n\n## 15-08-2018 Wednesday\n\n- 9:30 start\n- 9:50 mitsubishi\n- 10:20 standup\n- 10:40 mitsubishi testing after style upgraades\n- 11:20 frontend discussion\n- 12:30 SRM\n- 1:10 lunch\n- 1:50 SRM\n- 2:15 SRM\n- 3:05 trc fix and reinstall\n- 3:20 interview chat\n- 3:35 chekt script\n- 3:50 trc fix and reinstall\n- 4:30 trc fix\n\n## 16-08-2018 Thursday\n\n- 7:45 start\n- 8:20 SRM\n- 9:40 SRM\n- 10:50 mitsubishi elearning\n- 11:30 mitsubishi elearning\n- 1:00 mitsubishi pdp chat\n- 1:40 lunch\n- 2:30 SRM\n- 2:45 interview chat\n- 3:00 SRM \n- 3:20 cake\n- 4:20 SRM\n\n## 17-08-2018 Friday\n\n- 9:00 start\n- 9:30 parcels\n- 10:30 SRM\n- 11:00 frontend discussion\n- 11:20 SRM \n- 11:40 SRM\n- 1:20 performance review\n- 1:30 stand up\n- 1:45 frontend discussion\n- 2:40 mike lunch pizza\n- 3:40 trc + mitsubishi completion + parcels\n- 4:40 SRM\n- 4:50 tasket\n\n------------------------\n\n## 20-08-2018\n\n- 9:30 start\n- 9:45 talking\n- 10:00 trc\n\n';

var tasksByDay = pipeWith(file.split("##"), map(pipe(function (day) {
    return day.split("\n");
}, filter(function (line) {
    return line.slice(0, 2) === "- ";
}), map(function (line) {
    var _line$slice$split = line.slice(2).split(" "),
        _line$slice$split2 = (0, _toArray3.default)(_line$slice$split),
        time = _line$slice$split2[0],
        words = _line$slice$split2.slice(1);

    var comment = words.join(" ");

    var _time$split = time.split(":"),
        _time$split2 = (0, _slicedToArray3.default)(_time$split, 2),
        hour = _time$split2[0],
        minute = _time$split2[1];

    hour = parseInt(hour);
    minute = parseInt(minute);

    if (hour < 7) {
        hour += 12;
    }
    var onlyMinutes = hour * 60 + minute;

    return {
        time: time,
        hour: hour,
        minute: minute,
        onlyMinutes: onlyMinutes,
        comment: comment
    };
}), reduce(function (soFar, item) {
    var lastItem = last()(soFar);
    soFar.push(item);
    if (lastItem) {
        soFar = pipeWith(soFar, update(-1, pipe(set('from', lastItem.time), set('to', item.time), updateInto('duration', function (item) {
            return item.onlyMinutes - lastItem.onlyMinutes;
        }))));
    }
    return soFar;
}, []), filter(function (task) {
    return task.duration > 0;
}))));

var tasks = pipeWith(tasksByDay, flatMap(identity()));

console.log("TASKS", tasks);

var find = 'srm';

var total = pipeWith(tasks, filter(function (task) {
    return task.comment.toLowerCase().indexOf(find) !== -1;
}), reduce(function (total, _ref) {
    var duration = _ref.duration;
    return total + duration;
}, 0));

console.log('Duration of "' + find + '"', total / 60);