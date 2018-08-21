#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _remind = require('./remind');

var _remind2 = _interopRequireDefault(_remind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = function log() {
    var _console;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    (_console = console).log.apply(_console, [_chalk2.default.blue('tasket')].concat(args));
};

_commander2.default.command('remind').action(function () {
    log('okay hi there I\'ll remind you');
    (0, _remind2.default)();
});

_commander2.default.parse(process.argv);