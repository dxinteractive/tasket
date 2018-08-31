#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _open = require('./open');

var _open2 = _interopRequireDefault(_open);

var _remind = require('./remind');

var _remind2 = _interopRequireDefault(_remind);

var _stats = require('./stats');

var _stats2 = _interopRequireDefault(_stats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filepath = '~/Desktop/time.md';

_commander2.default.command('open').action(function () {
    (0, _open2.default)({
        filepath: filepath
    });
});

_commander2.default.command('remind').action(function () {
    (0, _log2.default)('A-tisket a-tasket, I\'ll ask where your task\'s at');
    (0, _remind2.default)({
        filepath: filepath
    });
});

_commander2.default.command('stats').action(function () {
    (0, _log2.default)('stats');
    (0, _stats2.default)({
        filepath: filepath
    });
});

_commander2.default.usage('[options] <file ...>').parse(process.argv);