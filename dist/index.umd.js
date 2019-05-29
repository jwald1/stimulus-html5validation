(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('stimulus')) :
  typeof define === 'function' && define.amd ? define(['stimulus'], factory) :
  (global = global || self, global['stimulus-html5validation'] = factory(global.Stimulus));
}(this, function (stimulus) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  const defaultMessages = {
    badInput: "is invalid",
    patternMismatch: "doesn't match %{pattern}",
    rangeOverflow: "must be less than %{max}",
    rangeUnderflow: "must be greater than %{min}",
    stepMismatch: "number is not divisible by %{step}",
    tooLong: "is too long (maximum is %{maxLength} characters)",
    tooShort: "is too short (minimum is %{minLength} characters)",
    typeMismatch: "is not a valid %{type}",
    valueMissing: "can't be blank"
  };
  const customMessageAttribute = {
    badInput: "is invalid",
    patternMismatch: "patternValidationMessage",
    rangeOverflow: "maxValidationMessage",
    rangeUnderflow: "minValidationMessage",
    stepMismatch: "stepValidationMessage",
    tooLong: "maxlengthValidationMessage",
    tooShort: "minlengthValidationMessage",
    typeMismatch: "typeValidationMessage",
    valueMissing: "requiredValidationMessage"
  };

  let _default =
  /*#__PURE__*/
  function () {
    function _default(el) {
      _classCallCheck(this, _default);

      this.el = el;
      this.errorType = this.errorType();
    }

    _createClass(_default, [{
      key: "message",
      value: function message() {
        if (this.el.validity.valid) {
          return;
        }

        return this.customMessage() || this.defaultMessage();
      } // private

    }, {
      key: "customMessage",
      value: function customMessage() {
        const dataAttribute = customMessageAttribute[this.errorType];
        return this.el.dataset[dataAttribute];
      }
    }, {
      key: "errorType",
      value: function errorType() {
        const errorTypes = Object.keys(defaultMessages);

        for (let index = 0; index < errorTypes.length; index++) {
          if (this.el.validity[errorTypes[index]]) {
            return errorTypes[index];
          }
        }
      }
    }, {
      key: "defaultMessage",
      value: function defaultMessage() {
        const message = defaultMessages[this.errorType];
        return message.replace(/\%\{(.*)}/, (_, match) => {
          return this.el[match];
        });
      }
    }]);

    return _default;
  }();

  const debounce = require("lodash.debounce");

  let _default$1 =
  /*#__PURE__*/
  function () {
    function _default$1(form, callback, debounceMs = 150) {
      _classCallCheck(this, _default$1);

      _defineProperty(this, "registerField", el => {
        this.registerDergisterField(el, true);
      });

      _defineProperty(this, "deregisterField", el => {
        this.registerDergisterField(el, false);
      });

      _defineProperty(this, "validateOnBlur", e => {
        e.target.dataset.visited = true;
        this.validate(e);
      });

      _defineProperty(this, "validate", e => {
        e.preventDefault();
        this.callback(e, {
          error: this.errorMessage(e.target),
          shouldDisplay: this.shouldValidate(e)
        });
      });

      this.form = form;
      this.callback = callback;
      this.debounceMs = debounceMs;
      this.allFields().forEach(this.registerField);
    }

    _createClass(_default$1, [{
      key: "destroy",
      value: function destroy() {
        this.allFields().forEach(this.deregisterField);
      }
    }, {
      key: "registerDergisterField",
      // private
      value: function registerDergisterField(el, bool) {
        const action = bool ? "addEventListener" : "removeEventListener";

        if (el.dataset.noValidate) {
          return;
        }

        if (el.nodeName === "INPUT") {
          el[action]("blur", this.validateOnBlur);
        }

        el[action]("input", debounce(this.validate, this.debounceMs));
        el[action]("invalid", this.validate);
      }
    }, {
      key: "errorMessage",
      value: function errorMessage(el) {
        return new _default(el).message();
      }
    }, {
      key: "shouldValidate",
      value: function shouldValidate(e) {
        const {
          target
        } = e;

        if (target.nodeName === "INPUT" && target.dataset.visited !== "true" && e.type !== "invalid" && !target.validity.valid) {
          return false;
        }

        return true;
      }
    }, {
      key: "inputFields",
      value: function inputFields() {
        return Array.from(this.form.querySelectorAll("input")).filter(el => el.type !== "hidden" && el.type !== "submit");
      }
    }, {
      key: "allFields",
      value: function allFields() {
        return Array.from(this.form.querySelectorAll("select, textarea")).concat(this.inputFields());
      }
    }]);

    return _default$1;
  }();

  let _default$2 =
  /*#__PURE__*/
  function (_Controller) {
    _inherits(_default, _Controller);

    function _default(...args) {
      var _this;

      _classCallCheck(this, _default);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, ...args));

      _defineProperty(_assertThisInitialized(_this), "registerField", el => _this.validator.registerField(el));

      _defineProperty(_assertThisInitialized(_this), "deregisterField", el => _this.validator.deregisterField(el));

      _defineProperty(_assertThisInitialized(_this), "removeNoValidate", () => {
        _this.data.delete("noValidate");
      });

      _defineProperty(_assertThisInitialized(_this), "validationCallback", (event, {
        error,
        shouldDisplay
      }) => {
        if (event.type === "invalid" && _this.data.has("noValidate")) {
          return;
        }

        _this.focusFirstInput(event);

        _this.toggleDisableOnSubmitButton(error);

        if (shouldDisplay) {
          _this.display({
            el: event.target,
            error
          });
        }
      });

      return _this;
    }

    _createClass(_default, [{
      key: "connect",
      value: function connect() {
        this.toggleDisableOnSubmitButton(true);
        this.submitButtonTarget.addEventListener("click", this.removeNoValidate);
        this.validator = new _default$1(this.form, this.validationCallback, this.data.get("debounce"));
      }
    }, {
      key: "disconnect",
      value: function disconnect() {
        this.submitButtonTarget.removeEventListener("click", this.removeNoValidate);
        this.validator.destroy();
      }
    }, {
      key: "isValid",
      value: function isValid() {
        this.data.set("noValidate", true);
        return this.form.checkValidity();
      }
    }, {
      key: "display",
      value: function display(object) {} // overwrite
      // private

    }, {
      key: "focusFirstInput",
      value: function focusFirstInput(e) {
        if (this.data.get("focusOnError") === "false" || e.type !== "invalid") {
          return;
        }

        const firstInputSelector = ["text", "email", "password", "search", "tel", "url"].map(type => `input[type="${type}"]:invalid`);
        this.form.querySelector(firstInputSelector.join(",")).focus();
      }
    }, {
      key: "toggleDisableOnSubmitButton",
      value: function toggleDisableOnSubmitButton(error) {
        if (this.data.get("disableSubmit") === "false") {
          return;
        }

        if (error) {
          this.submitButtonTarget.disabled = true;
        } else if (this.isValid()) {
          this.submitButtonTarget.disabled = false;
        }
      }
    }, {
      key: "form",
      get: function () {
        if (this.element.nodeName === "FORM") {
          return this.element;
        } else {
          return this.element.querySelector("form");
        }
      }
    }]);

    return _default;
  }(stimulus.Controller);

  _defineProperty(_default$2, "targets", ["submitButton"]);

  return _default$2;

}));
//# sourceMappingURL=index.umd.js.map
