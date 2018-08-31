'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _get = require('unmutable/lib/get');

var _get2 = _interopRequireDefault(_get);

var _filter = require('unmutable/lib/filter');

var _filter2 = _interopRequireDefault(_filter);

var _flatMap = require('unmutable/lib/flatMap');

var _flatMap2 = _interopRequireDefault(_flatMap);

var _groupBy = require('unmutable/lib/groupBy');

var _groupBy2 = _interopRequireDefault(_groupBy);

var _has = require('unmutable/lib/has');

var _has2 = _interopRequireDefault(_has);

var _identity = require('unmutable/lib/identity');

var _identity2 = _interopRequireDefault(_identity);

var _isEmpty = require('unmutable/lib/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _last = require('unmutable/lib/last');

var _last2 = _interopRequireDefault(_last);

var _log = require('unmutable/lib/log');

var _log2 = _interopRequireDefault(_log);

var _map = require('unmutable/lib/map');

var _map2 = _interopRequireDefault(_map);

var _reduce = require('unmutable/lib/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _reverse = require('unmutable/lib/reverse');

var _reverse2 = _interopRequireDefault(_reverse);

var _set = require('unmutable/lib/set');

var _set2 = _interopRequireDefault(_set);

var _sortBy = require('unmutable/lib/sortBy');

var _sortBy2 = _interopRequireDefault(_sortBy);

var _toArray4 = require('unmutable/lib/toArray');

var _toArray5 = _interopRequireDefault(_toArray4);

var _update = require('unmutable/lib/update');

var _update2 = _interopRequireDefault(_update);

var _updateInto = require('unmutable/lib/updateInto');

var _updateInto2 = _interopRequireDefault(_updateInto);

var _pipe = require('unmutable/lib/util/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

var _pipeWith = require('unmutable/lib/util/pipeWith');

var _pipeWith2 = _interopRequireDefault(_pipeWith);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Taskfile = function () {
    function Taskfile(raw) {
        (0, _classCallCheck3.default)(this, Taskfile);


        this._tasks = (0, _pipeWith2.default)(raw.split("##"), (0, _map2.default)(function (day) {
            var split = day.split("\n");
            var date = split[0];
            var dateNumber = Taskfile.numberifyDate(date);

            return (0, _pipeWith2.default)(split, (0, _filter2.default)(function (line) {
                return line.slice(0, 2) === "- ";
            }), (0, _map2.default)(function (line) {
                var _line$slice$split = line.slice(2).split(" "),
                    _line$slice$split2 = (0, _toArray3.default)(_line$slice$split),
                    time = _line$slice$split2[0],
                    category = _line$slice$split2[1],
                    words = _line$slice$split2.slice(2);

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
                    date: date,
                    dateNumber: dateNumber,
                    time: time,
                    hour: hour,
                    minute: minute,
                    onlyMinutes: onlyMinutes,
                    category: category,
                    comment: comment
                };
            }), (0, _reduce2.default)(function (soFar, item) {
                var lastItem = (0, _last2.default)()(soFar);
                soFar.push(item);
                if (lastItem) {
                    soFar = (0, _pipeWith2.default)(soFar, (0, _update2.default)(-1, (0, _pipe2.default)((0, _set2.default)('from', lastItem.time), (0, _set2.default)('to', item.time), (0, _updateInto2.default)('duration', function (item) {
                        return item.onlyMinutes - lastItem.onlyMinutes;
                    }))));
                }
                return soFar;
            }, []), (0, _filter2.default)(function (task) {
                return task.duration > 0;
            }));
        }), (0, _flatMap2.default)((0, _identity2.default)()));
    }

    (0, _createClass3.default)(Taskfile, [{
        key: 'sumByCategory',
        value: function sumByCategory() {

            var total = (0, _pipeWith2.default)(this._tasks, (0, _reduce2.default)(function (total, task) {
                return total + task.duration;
            }, 0));

            return (0, _pipeWith2.default)(this._tasks, (0, _groupBy2.default)((0, _get2.default)('category')), (0, _toArray5.default)(), (0, _map2.default)(function (tasks) {
                return (0, _pipeWith2.default)(tasks, (0, _reduce2.default)(function (obj, task) {
                    obj.duration += task.duration;
                    obj.category = task.category;
                    return obj;
                }, {
                    duration: 0
                }), (0, _updateInto2.default)('durationHours', function (_ref) {
                    var duration = _ref.duration;
                    return duration / 60;
                }), (0, _updateInto2.default)('proportion', function (_ref2) {
                    var duration = _ref2.duration;
                    return duration / total;
                }));
            }), (0, _sortBy2.default)((0, _get2.default)('duration')), (0, _reverse2.default)());
        }
    }, {
        key: 'tasks',
        get: function get() {
            return this._tasks;
        }
    }], [{
        key: 'numberifyDate',
        value: function numberifyDate(date) {
            return parseInt(date.replace(/[^\d]/g, ""));
        }
    }]);
    return Taskfile;
}();

exports.default = Taskfile;