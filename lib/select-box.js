'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _classnames = require('classnames');

var _classnames2 = _interopRequireWildcard(_classnames);

var _findIndex = require('lodash/array/findIndex');

var _findIndex2 = _interopRequireWildcard(_findIndex);

var idInc = 0;

var keyHandlers = {
  38: 'handleUpKey',
  40: 'handleDownKey',
  32: 'handleSpaceKey',
  13: 'handleEnterKey',
  27: 'handleEscKey',
  74: 'handleDownKey',
  75: 'handleUpKey'
};

function interceptEvent(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

module.exports = _React2['default'].createClass({

  displayName: 'SelectBox',

  propTypes: {
    label: _React2['default'].PropTypes.string,
    value: _React2['default'].PropTypes.any,
    closeText: _React2['default'].PropTypes.string,
    onChange: _React2['default'].PropTypes.func,
    multiple: _React2['default'].PropTypes.bool,
    changeOnClose: _React2['default'].PropTypes.bool,
    className: _React2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      closeText: 'Close',
      multiple: false,
      changeOnClose: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      id: 'react-select-box-' + ++idInc,
      expanded: false,
      focusedIndex: -1,
      pendingValue: [],
      focused: false
    };
  },

  changeOnClose: function changeOnClose() {
    return this.isMultiple() && String(this.props.changeOnClose) === 'true';
  },

  updatePendingValue: function updatePendingValue(value, cb) {
    if (this.changeOnClose()) {
      this.setState({ pendingValue: value }, cb);
      return true;
    }
    return false;
  },

  componentWillMount: function componentWillMount() {
    this.updatePendingValue(this.props.value);
  },

  componentWillReceiveProps: function componentWillReceiveProps(next) {
    this.updatePendingValue(next.value);
  },

  blurTimeout: null,

  handleMouseDownOnButton: function handleMouseDownOnButton() {
    var _this = this;

    this.clickingButton = true;
    setTimeout(function () {
      _this.clickingButton = false;
    }, 0);
  },

  handleMouseDownOnOption: function handleMouseDownOnOption() {
    this.clickingOption = true;
  },

  handleChange: function handleChange(value, cb) {
    var _this2 = this;

    return function (event) {
      _this2.clickingOption = false;
      _this2.clickingButton = false;
      interceptEvent(event);

      var indexOfValue = _findIndex2['default'](_this2.options(), function (option) {
        return option.value === value;
      });
      _this2.setState({ focusedIndex: indexOfValue });

      if (_this2.isMultiple()) {
        var selected = [];
        if (value != null) {
          selected = _this2.value().slice(0);
          var index = selected.indexOf(value);
          if (index !== -1) {
            selected.splice(index, 1);
          } else {
            selected.push(value);
          }
        }
        _this2.updatePendingValue(selected, cb) || _this2.props.onChange(selected);
      } else {
        _this2.updatePendingValue(value, cb) || _this2.props.onChange(value);
        _this2.handleClose();
        _React2['default'].findDOMNode(_this2.refs.button).focus();
      }
    };
  },

  handleNativeChange: function handleNativeChange(event) {
    var val = event.target.value;
    if (this.isMultiple()) {
      var children = [].slice.call(event.target.childNodes, 0);
      val = children.reduce(function (memo, child) {
        if (child.selected) {
          memo.push(child.value);
        }
        return memo;
      }, []);
    }
    this.props.onChange(val);
  },

  handleClear: function handleClear(event) {
    var _this3 = this;

    interceptEvent(event);
    this.handleChange(null, function () {
      // only called when change="true"
      _this3.props.onChange(_this3.state.pendingValue);
    })(event);
  },

  handleClickOnButton: function handleClickOnButton(event) {
    interceptEvent(event);
    if (this.state.expanded) {
      this.setState({ expanded: false });
    } else {
      this.setState({ expanded: true });
      this.handleOpen();
    }
  },

  handleOpen: function handleOpen(event) {
    interceptEvent(event);
    this.setState({ expanded: true });
  },

  handleClose: function handleClose(event) {
    interceptEvent(event);
    if (!this.clickingOption) {
      this.setState({ expanded: false });
    }
    if (this.changeOnClose()) {
      this.props.onChange(this.state.pendingValue);
    }
  },

  moveFocus: function moveFocus(move) {
    var length = _React2['default'].Children.count(this.props.children);
    var index = this.state.focusedIndex + move;
    if (index > length - 1) {
      index = length - 1;
    } else if (index < 0) {
      index = 0;
    }
    this.setState({ focusedIndex: index });
  },

  handleKeyDown: function handleKeyDown(event) {
    if (keyHandlers[event.which]) {
      this[keyHandlers[event.which]](event);
    }
  },

  handleUpKey: function handleUpKey(event) {
    interceptEvent(event);
    if (!this.state.expanded) {
      this.handleOpen(event);
      if (this.state.focusedIndex === -1) {
        this.moveFocus(1);
      }
    } else {
      this.moveFocus(-1);
    }
  },

  handleDownKey: function handleDownKey(event) {
    interceptEvent(event);
    if (!this.state.expanded) {
      this.handleOpen(event);
      if (this.state.focusedIndex === -1) {
        this.moveFocus(1);
      }
    } else {
      this.moveFocus(1);
    }
  },

  handleSpaceKey: function handleSpaceKey(event) {
    interceptEvent(event);
    if (!this.state.expanded) {
      this.handleOpen(event);
    } else if (this.state.focusedIndex !== -1) {
      this.handleEnterKey(event);
    } else {
      this.handleClose(event);
    }
  },

  handleEnterKey: function handleEnterKey(event) {
    if (this.state.focusedIndex !== -1) {
      this.handleChange(this.options()[this.state.focusedIndex].value)(event);
    } else {
      this.handleClose(event);
    }
  },

  handleEscKey: function handleEscKey(event) {
    if (this.state.expanded) {
      this.handleClose(event);
    } else {
      this.handleClear(event);
    }
  },

  label: function label() {
    var _this4 = this;

    var selected = this.options().filter(function (option) {
      return _this4.isSelected(option.value);
    }).map(function (option) {
      return option.label;
    });
    return selected.length > 0 ? selected.join(', ') : this.props.label;
  },

  isMultiple: function isMultiple() {
    return String(this.props.multiple) === 'true';
  },

  options: function options() {
    return this.props.children.map(function (option) {
      return {
        value: option.props.value,
        label: option.props.children
      };
    });
  },

  value: function value() {
    var value = this.changeOnClose() ? this.state.pendingValue : this.props.value;

    if (!this.isMultiple() || Array.isArray(value)) {
      return value;
    }if (value != null) {
      return [value];
    }
    return [];
  },

  hasValue: function hasValue() {
    if (this.isMultiple()) {
      return this.value().length > 0;
    }
    return this.value() != null && this.value() !== '';
  },

  isSelected: function isSelected(value) {
    if (this.isMultiple()) {
      return this.value().indexOf(value) !== -1;
    }
    return this.value() === value;
  },

  render: function render() {
    var className = _classnames2['default']('ReactSelectBox3-container', this.props.className, {
      'ReactSelectBox3-multi': this.isMultiple(),
      'ReactSelectBox3-empty': !this.hasValue(),
      'ReactSelectBox3--focus': this.state.focused,
      'ReactSelectBox3--expanded': this.state.expanded,
      'ReactSelectBox3--collapsed': !this.state.expanded
    });

    return _React2['default'].createElement(
      'div',
      {
        onKeyDown: this.handleKeyDown,
        ref: 'container',
        className: className },
      _React2['default'].createElement(
        'button',
        {
          id: this.state.id,
          ref: 'button',
          role: 'select',
          label: this.props.label,
          className: 'ReactSelectBox3',
          onMouseDown: this.handleMouseDownOnButton,
          onClick: this.handleClickOnButton,
          onFocus: this.handleButtonFocus,
          onBlur: this.handleButtonBlur,
          'aria-hidden': true
        },
        _React2['default'].createElement(
          'div',
          { className: 'ReactSelectBox3-label' },
          this.label()
        )
      ),
      this.renderOptionMenu(),
      this.renderClearButton(),
      this.renderNativeFormElements()
    );
  },

  handleButtonFocus: function handleButtonFocus() {
    this.setState({ focused: true });
  },

  handleButtonBlur: function handleButtonBlur(event) {
    var _this5 = this;

    setTimeout(function () {
      var focusIsWithin = _React2['default'].findDOMNode(_this5.refs.container).contains(document.activeElement);
      if (!focusIsWithin && !_this5.clickingButton) {
        _this5.setState({ focused: false });
        _this5.handleClose();
      } else {
        _React2['default'].findDOMNode(_this5.refs.button).focus();
      }
    }, 0);
  },

  renderNativeFormElements: function renderNativeFormElements() {
    var _this6 = this;

    var isMultiple = this.isMultiple();

    if (!isMultiple) {
      var _id = this.state.id + '-native-select';
      var empty = isMultiple ? null : _React2['default'].createElement(
        'option',
        { key: '', value: '' },
        'No Selection'
      );
      var options = [empty].concat(this.props.children);
      return _React2['default'].createElement(
        'div',
        { className: 'ReactSelectBox3-native-inputs' },
        _React2['default'].createElement(
          'select',
          {
            name: this.props.name,
            tabIndex: -1,
            id: _id,
            value: this.props.value || (isMultiple ? [] : '') },
          options
        )
      );
    }

    var inputs = this.options().map(function (option) {
      var isSelected = _this6.isSelected(option.value);

      return _React2['default'].createElement(
        'label',
        null,
        option.label,
        _React2['default'].createElement('input', {
          name: _this6.props.name,
          type: 'checkbox',
          value: option.value,
          checked: isSelected,
          tabIndex: -1 })
      );
    });
    return _React2['default'].createElement(
      'div',
      { className: 'ReactSelectBox3-native-inputs' },
      inputs
    );
  },

  renderOptionMenu: function renderOptionMenu() {
    var className = 'ReactSelectBox3-options';
    if (!this.state.expanded) {
      className += ' ReactSelectBox3-hidden';
    }
    /*
    var active = null
    if (this.state.focusedIndex !== -1) {
      active = this.state.id + '-' + this.state.focusedIndex
    }
    */
    return _React2['default'].createElement(
      'div',
      {
        className: className,
        'aria-hidden': true,
        ref: 'menu'
      },
      _React2['default'].createElement(
        'div',
        { className: 'ReactSelectBox3-off-screen' },
        this.options().map(this.renderOption)
      )
    );
  },

  renderOption: function renderOption(option, i) {
    var className = 'ReactSelectBox3-option';
    if (i === this.state.focusedIndex) {
      className += ' ReactSelectBox3-option-focused';
    }
    if (this.isSelected(option.value)) {
      className += ' ReactSelectBox3-option-selected';
    }
    return _React2['default'].createElement(
      'div',
      {
        id: this.state.id + '-' + i,
        onClick: this.handleChange(option.value),
        onMouseDown: this.handleMouseDownOnOption,
        className: className,
        tabIndex: -1,
        key: option.value
      },
      option.label
    );
  },

  renderClearButton: function renderClearButton() {
    if (this.hasValue() && !this.state.expanded) {
      return _React2['default'].createElement('button', {
        className: 'ReactSelectBox3-clear',
        'aria-hidden': true,
        tabIndex: -1,
        onClick: this.handleClear });
    }
  },

  renderCloseButton: function renderCloseButton() {
    if (this.isMultiple() && this.props.closeText) {
      return _React2['default'].createElement(
        'button',
        {
          tabIndex: -1,
          onClick: this.handleClose,
          className: 'ReactSelectBox3-close' },
        this.props.closeText
      );
    }
  }
});
/* <label htmlFor={id}>{this.props.label}</label> */
