'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var errorGetter = _ref.errorGetter;
  return function (reqSchema) {
    return function (req, res, next) {
      var errors = {};

      var validateObjectKey = function validateObjectKey(key) {
        //  Se não for especificado a key (body, query, etc...) no schema, não preciso validar
        if (!reqSchema[key]) {
          return;
        }
        _joi2.default.validate(req[key], reqSchema[key], { abortEarly: false }, function (err) {
          if (err) {
            // extrair apenas as informações que preciso
            errors[key] = err.details.map(function (detail) {
              return {
                message: detail.message, path: detail.path
              };
            });
          }
        });
      };
      Object.keys(reqSchema).forEach(function (key) {
        return validateObjectKey(key);
      });

      if (!Object.keys(errors).length) {
        return next();
      }

      var errorObject = errorGetter(errors);
      return next(errorObject);
    };
  };
};