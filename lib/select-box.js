var React = require('react/addons')

var li = React.DOM.li
var ul = React.DOM.ul
var div = React.DOM.div
var button = React.DOM.button
var label = React.DOM.label
var input = React.DOM.input

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
      focusedIndex: -1
    }
  },

  getDefaultProps: function () {
    return {
      id: 'react-select-box-' + (++idInc),
      closeText: 'Close'
    }
  },

  handleChange: function (val) {
    return function (event) {
      interceptEvent(event)
      this.props.onChange(val)
      this.handleClose(event)
    }.bind(this)
  },

  handleCheck: function (value) {
    return function (event) {
      var selected = this.value().slice(0)
      var index = selected.indexOf(value)
      if (index !== -1) {
        selected.splice(index, 1)
      } else {
        selected.push(value)
      }
      this.props.onChange(selected)
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
      if (this.isMultiple()) {
        this.handleCheck(this.options()[this.state.focusedIndex].value)(event)
      } else {
        this.handleChange(this.options()[this.state.focusedIndex].value)(event)
      }
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
    if (!this.isMultiple() || Array.isArray(this.props.value)) {
      return this.props.value
    } if (this.props.value != null) {
      return [this.props.value]
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
    var className = 'react-select-box'
    if (this.props.className) {
      className = ' ' + this.props.className
    }
    if (this.isMultiple()) {
      className += ' react-select-box-multi'
    }
    if (!this.hasValue()) {
      className += ' react-select-box-empty'
    }
    var active = null
    if (this.state.focusedIndex !== -1) {
      active = this.props.id + '-' + this.state.focusedIndex
    }
    return (
      div(
        {
          id: this.props.id,
          className: className,
          onClick: this.handleOpen,
          onKeyDown: this.handleKeyDown,
          onBlur: this.handleClose,
          tabIndex: '0',
          role: 'listbox',
          'aria-haspopup': 'true',
          'aria-activedescendant': active,
          'aria-label': this.props.label
        },
        div({className: 'react-select-box-label'}, this.label()),
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
        this.options().map(this.renderOption),
        this.renderCloseButton()
      )
    }
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
    
    if (this.isMultiple()) {
      return label(
        {
          className: className,
          key: option.value,
          tabIndex: '-1',
          onClick: this.handleCheck(option.value),
          role: 'option',
          'aria-selected': selected
        },
        input({
          checked: selected,
          type: 'checkbox',
          defaultValue: option.value,
          tabIndex: '-1',
          readOnly: true
        }),
        option.label
      )
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
  },

  renderCloseButton: function () {
    if (this.isMultiple() && this.props.closeText) {
      return button(
        {
          onClick: this.handleClose,
          className: 'react-select-box-close',
          'aria-label': 'Close ' + this.props.label + ' menu'
        },
        this.props.closeText
      )
    }
  }
})
