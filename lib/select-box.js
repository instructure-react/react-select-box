var React = require('react/addons')
var li = React.DOM.li
var ul = React.DOM.ul
var div = React.DOM.div
var button = React.DOM.button

var uniqueIndex = 0
var blurTimeout = null

var KEY_UP = 38
var KEY_DOWN = 40
var KEY_SPACE = 32
var KEY_ENTER = 13
var KEY_ESC = 27
var KEY_J = 74
var KEY_K = 75

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
      idPrefix: 'react-select-box-' + uniqueIndex++
    }
  },

  handleChange: function (val) {
    var _this = this
    return function (event) {
      event.stopPropagation()
      _this.props.onChange(val)
      _this.handleClose(event)
    }
  },

  handleClear: function (event) {
    interceptEvent(event)
    this.handleChange(null)(event)
  },

  handleOpen: function (event) {
    interceptEvent(event)
    this.setState({ open: true })
  },

  handleClose: function (event) {
    interceptEvent(event)
    this.setState({ open: false, focusedIndex: -1 })
  },

  handleBlur: function (event) {
    interceptEvent(event)
    blurTimeout = setTimeout(this.handleClose, 0)
  },

  handleFocus: function (event) {
    interceptEvent(event)
    clearTimeout(blurTimeout)
  },

  moveFocus: function (move) {
    if (this.refs.options) {
      var children = this.refs.options.getDOMNode().childNodes
      var maxIndex = this.props.options.length
      var index = (this.state.focusedIndex + move + maxIndex) % maxIndex
      this.setState({ focusedIndex: index  }, function () {
        children[index].focus()
      })
    }
  },

  handleKeyDown: function (event) {
    switch(event.which) {
      case KEY_K:
      case KEY_UP:
        interceptEvent(event)
        this.moveFocus(-1)
        break
      case KEY_J:
      case KEY_DOWN:
        interceptEvent(event)
        if (!this.state.open) {
          this.handleOpen(event)
        }
        this.moveFocus(1)
        break
      case KEY_SPACE:
        interceptEvent(event)
        if (!this.state.open) {
          this.handleOpen(event)
        }
        break
      case KEY_ENTER:
        var index = this.state.focusedIndex
        if (index > -1) {
          this.handleChange(this.props.options[index].value)(event)
        }
        break
      case KEY_ESC:
        if (this.state.open) {
          this.handleClose(event)
        } else {
          // TODO: Decide if this is wanted
          this.handleClear(event)
        }
        break
    }
  },

  getLabel: function () {
    var selected = this.props.options.filter(function (option) {
      return option.value === this.props.value
    }, this)
    return selected.length > 0 ? selected[0].label : this.props.label
  },

  render: function () {
    var optionMenu
    var activeDecendant = this.props.value ? this.props.idPrefix + '-label' : ''
    if (this.state.open) {
      optionMenu = (
        ul({className: "react-select-box-options", ref: "options"},
          this.props.options.map(this.renderOption)
        )
      )
    }
    var clearButton
    var labelClassName = 'react-select-box-label'
    if (this.props.value) {
      clearButton = (
        button({
          className: "react-select-box-clear",
          onClick: this.handleClear,
          tabIndex: "0",
          'aria-label': "Clear selection"}
        )
      )
      labelClassName += ' react-select-box-label-active'
    }
    return (
      div({
        className: "react-select-box",
        onClick: this.handleOpen,
        onKeyDown: this.handleKeyDown,
        onBlur: this.handleBlur,
        onFocus: this.handleFocus,
        tabIndex: "0",
        role: "listbox",
        'aria-haspopup': "true",
        'aria-activedecendant': activeDecendant,
        'aria-label': this.props.label},
        div({className: labelClassName, id: this.props.idPrefix + '-label'},
          this.getLabel()
        ),
        clearButton,
        optionMenu
      )
    )
  },

  renderOption: function (option) {
    var key = 'react-select-box-option-' + uniqueIndex++
    var className = 'react-select-box-option'
    if (option.value === this.props.value) {
      className += ' react-select-box-option-selected'
    }
    return (
      li({
        onClick: this.handleChange(option.value),
        onBlur: this.handleBlur,
        onFocus: this.handleFocus,
        className: className,
        key: key,
        role: "option",
        'aria-label': option.label,
        tabIndex: "-1"},
        option.label
      )
    )
  }
})
