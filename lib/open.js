'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = require('child_process'),
    exec = _require.exec;

exports.default = function (_ref) {
  var filepath = _ref.filepath;
  return exec('subl ' + filepath);
};