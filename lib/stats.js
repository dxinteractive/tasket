'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _nodeNotifier = require('node-notifier');

var _nodeNotifier2 = _interopRequireDefault(_nodeNotifier);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _taskfile = require('./taskfile');

var _taskfile2 = _interopRequireDefault(_taskfile);

var _filter = require('unmutable/lib/filter');

var _filter2 = _interopRequireDefault(_filter);

var _forEach = require('unmutable/lib/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _get = require('unmutable/lib/get');

var _get2 = _interopRequireDefault(_get);

var _getIn = require('unmutable/lib/getIn');

var _getIn2 = _interopRequireDefault(_getIn);

var _map = require('unmutable/lib/map');

var _map2 = _interopRequireDefault(_map);

var _max = require('unmutable/lib/max');

var _max2 = _interopRequireDefault(_max);

var _pipeWith = require('unmutable/lib/util/pipeWith');

var _pipeWith2 = _interopRequireDefault(_pipeWith);

var _range = require('unmutable/lib/util/range');

var _range2 = _interopRequireDefault(_range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var filepath = _ref.filepath,
        fromDate = _ref.fromDate,
        toDate = _ref.toDate;

    filepath = filepath.replace('~', _os2.default.homedir());
    _fs2.default.readFile(filepath, 'utf8', function (err, data) {
        if (err) throw err;

        var tasks = new _taskfile2.default(data).from(fromDate).to(toDate);

        var categories = (0, _pipeWith2.default)(tasks.sumByCategory(), (0, _filter2.default)((0, _get2.default)('category')), (0, _filter2.default)(function (_) {
            return _.category !== "lunch";
        }));

        var categoryLengthMax = (0, _pipeWith2.default)(categories, (0, _map2.default)(function (_) {
            return _.category.length;
        }), (0, _max2.default)());

        var maxProportion = (0, _pipeWith2.default)(categories, (0, _map2.default)(function (_) {
            return _.proportion;
        }), (0, _max2.default)());

        (0, _pipeWith2.default)(categories, (0, _forEach2.default)(function (cat) {
            var chunks = cat.chunks,
                duration = cat.duration,
                category = cat.category,
                durationHours = cat.durationHours,
                proportion = cat.proportion;


            var categoryLength = category.length;
            var categoryPad = (0, _range2.default)(categoryLengthMax - categoryLength).map(function (_) {
                return " ";
            }).join("");

            var percent = Number(proportion * 100).toFixed(1);
            var percentPad = (0, _range2.default)(5 - percent.length).map(function (_) {
                return " ";
            }).join("");

            var hours = Number(durationHours).toFixed(1);
            var hoursPad = (0, _range2.default)(5 - hours.length).map(function (_) {
                return " ";
            }).join("");

            var chunksPad = (0, _range2.default)(3 - ('' + chunks).length).map(function (_) {
                return " ";
            }).join("");

            var blocks = Math.floor(proportion / maxProportion * 100);
            var notBlocks = 100 - blocks;
            var bar = (0, _range2.default)(blocks).map(function (_) {
                return "█";
            }).join("");
            var notBar = (0, _range2.default)(notBlocks).map(function (_) {
                return " ";
            }).join("");

            var categoryString = '| ' + category + categoryPad + ' | ' + percentPad + percent + '% | ' + hoursPad + hours + ' hrs | ' + chunks + ' chunks | ' + bar;

            console.log(categoryString);
        }));

        var switches = tasks.workTasks.length;
        console.log("\n");
        console.log('Switches: ' + switches);
    });
};