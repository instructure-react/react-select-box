var React = require('react/addons')

var li = React.DOM.li
var ul = React.DOM.ul
var div = React.DOM.div
var button = React.DOM.button

var idInc = 0

var keyHandlers = {
  38: 'handleUpKey',
  40: 'handleDownKey',
  32: 'handleSpaceKey',
  13: 'handleEnterKey',
  27: 'handleEscKey',
  74: 'handleDownKey',
  47: 'handleUpKey'
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
      focused: null
    }
  },

  getDefaultProps: function () {
    return {
      id: 'react-select-box-' + (++idInc)
    }
  },

  handleChange: function (val) {
    return function (event) {
      event.stopPropagation()
      this.props.onChange(val)
      this.handleClose(event)
    }.bind(this)
  },

  handleClear: function (event) {
    interceptEvent(event)
    this.handleChange(null)(event)
  },

  handleOpen: function (event) {
    interceptEvent(event)
    this.setState({open: true})
  },

  handleClose: function (event) {
    interceptEvent(event)
    this.setState({open: false, focusedIndex: -1})
  },

  moveFocus: function (move) {
    var cur = this.props.options.indexOf(this.state.focused)
    var len = this.props.options.length
    var idx = (cur + move + len) % len
    this.setState({focused: this.props.options[idx] || null})
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
    }
  },

  handleEnterKey: function (event) {
    if (this.state.focused) {
      this.handleChange(this.state.focused.value)(event)
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
    var selected = this.props.options.filter(function (option) {
      return option.value === this.props.value
    }, this)
    return selected.length > 0 ? selected[0].label : this.props.label
  },

  value: function () {
    return this.props.value
  },

  hasValue: function () {
    return this.value() != null
  },

  render: function () {
    var labelClassName = 'react-select-box-label'
    if (this.hasValue()) {
      labelClassName += ' react-select-box-label-active'
    }
    var active = this.state.focused
    if (active) {
      active = this.props.id + '-' + this.props.options.indexOf(active)
    }
    return (
      div(
        {
          id: this.props.id,
          className: 'react-select-box',
          onClick: this.handleOpen,
          onKeyDown: this.handleKeyDown,
          onBlur: this.handleClose,
          tabIndex: '0',
          role: 'listbox',
          'aria-haspopup': 'true',
          'aria-activedescendant': active,
          'aria-label': this.props.label
        },
        div({className: labelClassName}, this.label()),
        this.renderClearButton(),
        this.renderOptionMenu()
      )
    )
  },

  renderOptionMenu: function () {
    if (this.state.open) {
      var className = 'react-select-box-options'
      if (!this.state.open) {
        className += ' react-select-box-hidden'
      }
      return ul(
        {
          className: className,
          role: 'presentation'
        },
        this.props.options.map(this.renderOption)
      )
    }
  },

  renderOption: function (option, i) {
    var className = 'react-select-box-option'
    var selected = false
    if (option === this.state.focused) {
      className += ' react-select-box-option-focused'
    }
    if (option.value === this.props.value) {
      className += ' react-select-box-option-selected'
      selected = true
    }
    return li(
      {
        id: this.props.id + '-' + i,
        onClick: this.handleChange(option.value),
        className: className,
        key: option.value,
        role: 'option',
        'aria-selected': selected
      },
      option.label
    )
  },

  renderClearButton: function () {
    if (this.hasValue()) {
      return button({
        className: 'react-select-box-clear',
        onClick: this.handleClear,
        tabIndex: '0',
        'aria-label': 'Clear selection for ' + this.props.label
      })
    }
  }
})
