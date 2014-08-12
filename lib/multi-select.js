var React = require('react/addons')
var label = React.DOM.label
var div = React.DOM.div
var button = React.DOM.button
var input = React.DOM.input
var button = React.DOM.button

var uniqueIndex = 0

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
  
  handleCheck: function (event) {
    var selected = this.props.value.slice(0)
    var index = selected.indexOf(event.target.value)
    if (!event.target.checked) {
      selected.splice(index, 1)
    } else if (index === -1) {
      selected.push(event.target.value)
    }
    this.props.onChange(selected)
  },

  handleLabelClick: function (event) {
    event.stopPropagation()
  },

  handleClear: function (event) {
    interceptEvent(event)
    this.props.onChange([])
  },

  handleOpen: function (event) {
    interceptEvent(event)
    this.setState({ open: true })
  },

  handleClose: function (event) {
    interceptEvent(event)
    this.setState({ open: false, focusedIndex: -1 })
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
      case KEY_ENTER:
      case KEY_SPACE:
        //interceptEvent(event)
        if (!this.state.open) {
          this.handleOpen(event)
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
    var value = Array.isArray(this.props.value) ? this.props.value : []
    var selected = this.props.options
      .filter(function (option) {
        return value.indexOf(option.value) !== -1
      })
      .map(function (option) {
        return option.label
      })

    if (selected.length > 1) {
      selected.push('and ' + selected.pop())
    }

    return selected.length === 0 ? this.props.label : selected.join(', ')
  },

  render: function () {
    var optionMenu
    var activeDecendant = this.props.value ? this.props.idPrefix + '-label' : ''
    var clickOutsideLayer
    if (this.state.open) {
      optionMenu = (
        div({
          className: 'react-select-box-options',
          ref: 'options',
          onClick: this.handleLabelClick},
          this.props.options.map(this.renderOption),
          button({
            onClick: this.handleClose,
            className: 'react-select-box-apply',
            disabled: this.props.value.length === 0 },
            'Apply')
        )
      )
      clickOutsideLayer = div({
        className: 'react-select-box-click-outside-layer',
        onClick: this.handleClose
      })
    }
    var clearButton
    var labelClassName = 'react-select-box-label'
    if (this.props.value.length > 0) {
      clearButton = (
        button({
          className: 'react-select-box-clear',
          onClick: this.handleClear,
          tabIndex: '0',
          'aria-label': 'Clear selection'}
        )
      )
      labelClassName += ' react-select-box-label-active'
    }
    return (
      div({
        className: 'react-select-box react-select-box-multi',
        onClick: this.handleOpen,
        onKeyDown: this.handleKeyDown,
        tabIndex: '0',
        role: 'listbox',
        'aria-haspopup': 'true',
        'aria-activedecendant': activeDecendant,
        'aria-label': this.props.label},
        div({className: labelClassName, id: this.props.idPrefix + '-label'},
          this.getLabel()
        ),
        clickOutsideLayer,
        clearButton,
        optionMenu
      )
    )
  },

  renderOption: function (option, i) {
    var className = 'react-select-box-option'
    if (this.props.value.indexOf(option.value) !== -1) {
      className += ' react-select-box-option-selected'
    }
    if (this.state.focusedIndex === i) {
      className += ' react-select-box-option-focused'
    }
    return (
      label({
        className: className,
        key: option.value,
        tabIndex: '-1',
        onClick: this.handleLabelClick
        },
        input({
          onChange: this.handleCheck,
          checked: this.props.value.indexOf(option.value) !== -1,
          type: 'checkbox',
          defaultValue: option.value,
          tabIndex: '-1'
        }),
        option.label
      )
    )
  }
})

