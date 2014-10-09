"use strict"

var React = require('react/addons')

var li = React.DOM.li
var ul = React.DOM.ul
var div = React.DOM.div
var button = React.DOM.button
var a = React.DOM.a
//var label = React.DOM.label
//var input = React.DOM.input

var idInc = 0

var keyHandlers = {
  38: 'handleUpKey',
  40: 'handleDownKey',
  32: 'handleSpaceKey',
  13: 'handleEnterKey',
  27: 'handleEscKey',
  74: 'handleDownKey',
  75: 'handleUpKey'
}

function interceptEvent(event) {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
}

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function () {
    return {
      open: false,
      focusedIndex: -1,
      pedningValue: []
    }
  },

  getDefaultProps: function () {
    return {
      id: 'react-select-box-' + (++idInc),
      closeText: 'Close'
    }
  },

  changeOnClose: function () {
    return this.isMultiple() && String(this.props.changeOnClose) === 'true'
  },

  updatePendingValue: function (value, cb) {
    if (this.changeOnClose()) {
      this.setState({pendingValue: value}, cb)
      return true
    }
    return false
  },

  componentWillMount: function () {
    this.updatePendingValue(this.props.value)
  },

  componentWillReceiveProps: function (next) {
    this.updatePendingValue(next.value)
  },

  clickingOption: false,

  blurTimeout: null,

  handleFocus: function (event) {
    clearTimeout(this.blurTimeout)
  },

  handleBlur: function (event) {
    clearTimeout(this.blurTimeout)
    this.blurTimeout = setTimeout(this.handleClose, 0)
  },

  handleMouseDown: function() {
    this.clickingOption = true
  },

  handleChange: function (val, cb) {
    return function (event) {
      this.clickingOption = false
      interceptEvent(event)
      if (this.isMultiple()) {
        var selected = []
        if (val != null) {
          selected = this.value().slice(0)
          var index = selected.indexOf(val)
          if (index !== -1) {
            selected.splice(index, 1)
          } else {
            selected.push(val)
          }
        }
        this.updatePendingValue(selected, cb) || this.props.onChange(selected)
      } else {
        this.updatePendingValue(val, cb) || this.props.onChange(val)
        this.handleClose()
        this.refs.button.getDOMNode().focus()
      }
    }.bind(this)
  },

  handleClear: function (event) {
    interceptEvent(event)
    this.handleChange(null, function () {
      // only called when change="true"
      this.props.onChange(this.state.pendingValue)
    })(event)
  },

  handleOpen: function (event) {
    interceptEvent(event)
    this.setState({open: true}, function () {
      this.refs.menu.getDOMNode().focus()
    })
  },

  handleClose: function (event) {
    interceptEvent(event)
    if(!this.clickingOption) {
      this.setState({open: false, focusedIndex: -1})
    }
    if (this.changeOnClose()) {
      this.props.onChange(this.state.pendingValue)
    }
  },

  moveFocus: function (move) {
    var len = React.Children.count(this.props.children)
    var idx = (this.state.focusedIndex + move + len) % len
    this.setState({focusedIndex: idx})
  },

  handleKeyDown: function (event) {
    if (keyHandlers[event.which]) {
      this[keyHandlers[event.which]](event)
    }
  },

  handleUpKey: function (event) {
    interceptEvent(event)
    this.moveFocus(-1)
  },

  handleDownKey: function (event) {
    interceptEvent(event)
    if (!this.state.open) {
      this.handleOpen(event)
    }
    this.moveFocus(1)
  },

  handleSpaceKey: function (event) {
    interceptEvent(event)
    if (!this.state.open) {
      this.handleOpen(event)
    } else if (this.state.focusedIndex !== -1) {
      this.handleEnterKey()
    }
  },

  handleEnterKey: function (event) {
    if (this.state.focusedIndex !== -1) {
      this.handleChange(this.options()[this.state.focusedIndex].value)(event)
    }
  },

  handleEscKey: function (event) {
    if (this.state.open) {
      this.handleClose(event)
    } else {
      this.handleClear(event)
    }
  },

  label: function () {
    var selected = this.options()
      .filter(function (option) {
        return this.isSelected(option.value)
      }.bind(this))
      .map(function (option) {
        return option.label
      })
    return selected.length > 0 ? selected.join(', ') : this.props.label
  },

  isMultiple: function () {
    return String(this.props.multiple) === 'true'
  },

  options: function () {
    var options = []
    React.Children.forEach(this.props.children, function (option) {
      options.push({
        value: option.props.value,
        label: option.props.children
      })
    })
    return options
  },

  value: function () {
    var value = this.changeOnClose() ?
      this.state.pendingValue :
      this.props.value

    if (!this.isMultiple() || Array.isArray(value)) {
      return value
    } if (value != null) {
      return [value]
    }
    return []
  },

  hasValue: function () {
    if (this.isMultiple()) {
      return this.value().length > 0
    }
    return this.value() != null
  },

  isSelected: function (value) {
    if (this.isMultiple()) {
      return this.value().indexOf(value) !== -1
    }
    return this.value() === value
  },

  render: function () {
    var className = 'react-select-box-container'
    if (this.props.className) {
      className += ' ' + this.props.className
    }
    if (this.isMultiple()) {
      className += ' react-select-box-multi'
    }
    var ariaValue = ''
    if (this.hasValue()) {
      ariaValue = ': ' + this.label()
    } else {
      className += ' react-select-box-empty'
    }
    var active = null
    if (this.state.focusedIndex !== -1) {
      active = this.props.id + '-' + this.state.focusedIndex
    }
    return (
      div(
        {
          onKeyDown: this.handleKeyDown,
          className: className
        },
        button(
          {
            id: this.props.id,
            ref: 'button',
            className: 'react-select-box',
            onClick: this.handleOpen,
            onBlur: this.handleBlur,
            tabIndex: '0',
            'aria-haspopup': 'true',
            'aria-label': this.props.label + ariaValue
          },
          div({className: 'react-select-box-label'}, this.label())
        ),
        this.renderOptionMenu(),
        this.renderClearButton()
      )
    )
  },

  renderOptionMenu: function () {
    var className = 'react-select-box-options'
    if (!this.state.open) {
      className += ' react-select-box-hidden'
    }
    return div(
      {
        className: className,
        role: 'listbox',
        onBlur: this.handleBlur,
        onFocus: this.handleFocus,
        'aria-multiselectable': this.isMultiple(),
        ref: 'menu',
        tabIndex: 0
      },
      this.options().map(this.renderOption),
      this.renderCloseButton()
    )
  },

  renderOption: function (option, i) {
    var className = 'react-select-box-option'
    var selected = false

    if (i === this.state.focusedIndex) {
      className += ' react-select-box-option-focused'
    }
    if (this.isSelected(option.value)) {
      className += ' react-select-box-option-selected'
      selected = true
    }

    return a(
      {
        id: this.props.id + '-' + i,
        href: '#',
        onClick: this.handleChange(option.value),
        onMouseDown: this.handleMouseDown,
        className: className,
        tabIndex: -1,
        key: option.value,
        role: 'option',
        'aria-selected': selected,
        onBlur: this.handleBlur,
        onFocus: this.handleFocus
      },
      option.label
    )
  },

  renderClearButton: function () {
    if (this.hasValue()) {
      return button({
        className: 'react-select-box-clear',
        onClick: this.handleClear,
        'aria-label': 'Clear selection for ' + this.props.label
      })
    }
  },

  renderCloseButton: function () {
    if (this.isMultiple() && this.props.closeText) {
      return button(
        {
          onClick: this.handleClose,
          className: 'react-select-box-close',
          'aria-label': 'Close ' + this.props.label + ' menu',
          onBlur: this.handleBlur,
          onFocus: this.handleFocus
        },
        this.props.closeText
      )
    }
  }
})
