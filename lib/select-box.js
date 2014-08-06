/** @jsx React.DOM */

var React = require('react/addons')
var optionKeyIndex = 0
var blurTimeout = null

var KEY_UP = 38
var KEY_DOWN = 40
var KEY_SPACE = 32
var KEY_ENTER = 13
var KEY_ESC = 27

function interceptEvent(event) {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }  
}

module.exports = React.createClass({
  getInitialState: function () {
    return {
      open: false,
      focusedOption: null
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
    this.setState({ open: false, focusedOption: null })
  },

  moveFocus: function (move) {
    var index = this.props.options.indexOf(this.state.focusedOption) + move
    if (this.props.options[index]) {
      this.setState({ focusedOption: this.props.options[index] })
    }
  },

  handleKeyDown: function (event) {
    switch(event.which) {
      case KEY_UP:
        interceptEvent(event)
        this.moveFocus(-1)
        break
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
        if (this.state.focusedOption) {
          this.handleChange(this.state.focusedOption.value)(event)
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
    var clickOutsideLayer
    var optionMenu
    if (this.state.open) {
      clickOutsideLayer = (
        <div
          className="react-select-box-click-outside-layer"
          onClick={this.handleClose}
        />
      )
      optionMenu = (
        <ul className="react-select-box-options">
          {this.props.options.map(this.renderOption)}
        </ul>
      )
    }
    var clearButton
    var labelClassName = 'react-select-box-label'
    if (this.props.value) {
      clearButton = (
        <a
          className="react-select-box-clear"
          onClick={this.handleClear}
          tabIndex="0">
          Clear selection
        </a>
      )
      labelClassName += ' react-select-box-label-active'
    }
    return (
      <div
        className="react-select-box"
        onClick={this.handleOpen}
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
        role="listbox">
        <div className={labelClassName}>
          {this.getLabel()}
        </div>
        {clickOutsideLayer}
        {clearButton}
        {optionMenu}
      </div>
    )
  },

  renderOption: function (option) {
    var key = 'react-select-box-option-' + optionKeyIndex++
    var className = 'react-select-box-option'
    if (option.value === this.props.value) {
      className += ' react-select-box-option-selected'
    }
    if (option === this.state.focusedOption) {
      className += ' react-select-box-option-focused'
    }
    return (
      <li
        onClick={this.handleChange(option.value)}
        className={className}
        key={key}
        role="option">
        {option.label}
      </li>
    )
  }
})

