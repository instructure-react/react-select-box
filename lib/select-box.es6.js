import React from 'react'
import classnames from 'classnames'
import findIndex from 'lodash/array/findIndex'

let idInc = 0

const keyHandlers = {
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

module.exports = React.createClass({

  displayName: 'SelectBox',

  propTypes: {
    label: React.PropTypes.string,
    value: React.PropTypes.any,
    closeText: React.PropTypes.string,
    onChange: React.PropTypes.func,
    multiple: React.PropTypes.bool,
    changeOnClose: React.PropTypes.bool,
    className: React.PropTypes.string
  },

  getDefaultProps () {
    return {
      closeText: 'Close',
      multiple: false,
      changeOnClose: false
    }
  },

  getInitialState () {
    return {
      id: 'react-select-box-' + (++idInc),
      expanded: false,
      focusedIndex: -1,
      pendingValue: [],
      focused: false
    }
  },

  changeOnClose () {
    return this.isMultiple() && String(this.props.changeOnClose) === 'true'
  },

  updatePendingValue (value, cb) {
    if (this.changeOnClose()) {
      this.setState({pendingValue: value}, cb)
      return true
    }
    return false
  },

  componentWillMount () {
    this.updatePendingValue(this.props.value)
  },

  componentWillReceiveProps (next) {
    this.updatePendingValue(next.value)
  },

  blurTimeout: null,

  handleMouseDownOnButton() {
    this.clickingButton = true
    setTimeout(() => {
      this.clickingButton = false
    }, 0)
  },

  handleMouseDownOnOption() {
    this.clickingOption = true
  },

  handleChange (value, cb) {
    return (event) => {
      this.clickingOption = false
      this.clickingButton = false
      interceptEvent(event)

      const indexOfValue = findIndex(this.options(), option => {
        return option.value === value
      })
      this.setState({focusedIndex: indexOfValue})

      if (this.isMultiple()) {
        var selected = []
        if (value != null) {
          selected = this.value().slice(0)
          var index = selected.indexOf(value)
          if (index !== -1) {
            selected.splice(index, 1)
          } else {
            selected.push(value)
          }
        }
        this.updatePendingValue(selected, cb) || this.props.onChange(selected)
      } else {
        this.updatePendingValue(value, cb) || this.props.onChange(value)
        this.handleClose()
        React.findDOMNode(this.refs['button']).focus()
      }
    }
  },

  handleNativeChange (event) {
    var val = event.target.value
    if (this.isMultiple()) {
      var children = [].slice.call(event.target.childNodes, 0)
      val = children.reduce((memo, child) => {
        if (child.selected) {
          memo.push(child.value)
        }
        return memo
      }, [])
    }
    this.props.onChange(val)
  },

  handleClear (event) {
    interceptEvent(event)
    this.handleChange(null, () => {
      // only called when change="true"
      this.props.onChange(this.state.pendingValue)
    })(event)
  },

  handleClickOnButton (event) {
    interceptEvent(event)
    if(this.state.expanded) {
      this.setState({expanded: false})
      React.findDOMNode(this.refs.button).focus()
    } else {
      this.setState({expanded: true})
      this.handleOpen()
    }
  },

  handleOpen (event) {
    interceptEvent(event)
    this.setState({expanded: true})
    React.findDOMNode(this.refs.menu).focus()
  },

  handleClose (event) {
    interceptEvent(event)
    if(!this.clickingOption) {
      this.setState({expanded: false})
    }
    if (this.changeOnClose()) {
      this.props.onChange(this.state.pendingValue)
    }
  },

  moveFocus (move) {
    const length = React.Children.count(this.props.children)
    let index = (this.state.focusedIndex + move)
    if(index > length - 1) {
      index = length - 1
    } else if (index < 0) {
      index = 0
    }
    this.setState({focusedIndex: index})
  },

  handleKeyDown (event) {
    if (keyHandlers[event.which]) {
      this[keyHandlers[event.which]](event)
    }
  },

  handleUpKey (event) {
    interceptEvent(event)
    if (!this.state.expanded) {
      this.handleOpen(event)
      if(this.state.focusedIndex === -1) {
        this.moveFocus(1)
      }
    } else {
      this.moveFocus(-1)
    }
  },

  handleDownKey (event) {
    interceptEvent(event)
    if (!this.state.expanded) {
      this.handleOpen(event)
      if(this.state.focusedIndex === -1) {
        this.moveFocus(1)
      }
    } else {
      this.moveFocus(1)
    }
  },

  handleSpaceKey (event) {
    interceptEvent(event)
    if (!this.state.expanded) {
      this.handleOpen(event)
    } else if (this.state.focusedIndex !== -1) {
      this.handleEnterKey(event)
    } else {
      this.handleClose(event)
    }
  },

  handleEnterKey (event) {
    if (this.state.focusedIndex !== -1) {
      this.handleChange(this.options()[this.state.focusedIndex].value)(event)
    } else {
      this.handleClose(event)
    }
  },

  handleEscKey (event) {
    if (this.state.expanded) {
      this.handleClose(event)
    } else {
      this.handleClear(event)
    }
  },

  label () {
    var selected = this.options()
      .filter((option) => {
        return this.isSelected(option.value)
      })
      .map((option) => {
        return option.label
      })
    return selected.length > 0 ? selected.join(', ') : this.props.label
  },

  isMultiple () {
    return String(this.props.multiple) === 'true'
  },

  options () {
    return this.props.children.map((option) => {
      return {
        value: option.props.value,
        label: option.props.children
      }
    })
  },

  value () {
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

  hasValue () {
    if (this.isMultiple()) {
      return this.value().length > 0
    }
    return this.value() != null && this.value() !== ''
  },

  isSelected (value) {
    if (this.isMultiple()) {
      return this.value().indexOf(value) !== -1
    }
    return this.value() === value
  },

  render () {
    var className = classnames('ReactSelectBox3-container', this.props.className, {
      'ReactSelectBox3-multi': this.isMultiple(),
      'ReactSelectBox3-empty': !this.hasValue(),
      'ReactSelectBox3--focus': this.state.focused,
      'ReactSelectBox3--expanded': this.state.expanded,
      'ReactSelectBox3--collapsed': !this.state.expanded
    })

    const labelId = `ReactSelectBox3-label-${this.state.id}`

    return (
      <div
          onKeyDown={this.handleKeyDown}
          ref='container'
          className={className}>
        <button
            id={this.state.id}
            ref='button'
            label={this.props.label}
            className='ReactSelectBox3'
            onMouseDown={this.handleMouseDownOnButton}
            onClick={this.handleClickOnButton}
            onFocus={this.handleButtonFocus}
            onBlur={this.handleButtonBlur}
            aria-haspopup={true}
            aria-labelledby={labelId}
            tabIndex={0}
        >
          <div
              className='ReactSelectBox3-label'
              id={labelId}>
            {this.label()}
          </div>
        </button>
        {this.renderOptionMenu()}
        {this.renderClearButton()}
        {this.renderNativeFormElements()}
      </div>
    )
  },

  handleButtonFocus () {
    this.setState({focused: true})
  },

  handleButtonBlur (event) {
    setTimeout(() => {
      const focusIsWithin = React.findDOMNode(this.refs.container).contains(document.activeElement)
      if(!focusIsWithin && !this.clickingButton) {
        this.setState({focused: false})
        this.handleClose()
      } else {
        React.findDOMNode(this.refs['button']).focus()
      }
    }, 0)
  },

  renderNativeFormElements () {
    const isMultiple = this.isMultiple()

    if (!isMultiple) {
      let id = this.state.id + '-native-select'
      let empty = isMultiple ? null : <option key='' value=''>No Selection</option>
      let options = [empty].concat(this.props.children)
      return (
        <div className='ReactSelectBox3-native-inputs'>
          <select
              name={this.props.name}
              tabIndex={-1}
              id={id}
              value={this.props.value || (isMultiple ? [] : '')}>
            {options}
          </select>
        </div>
      )
    }

    const inputs = this.options().map(option => {
      const isSelected = this.isSelected(option.value)

      return (
        <label key={option.value}>
          {option.label}
          <input
              name={this.props.name}
              type='checkbox'
              readOnly={true}
              value={option.value}
              checked={isSelected}
              tabIndex={-1} />
        </label>
      )
    })
    return (
      <div className='ReactSelectBox3-native-inputs'>
        {/* <label htmlFor={id}>{this.props.label}</label> */}
        {inputs}
      </div>
    )
  },

  renderOptionMenu () {
    var className = 'ReactSelectBox3-options'
    if (!this.state.expanded) {
      className += ' ReactSelectBox3-hidden'
    }
    /*
    var active = null
    if (this.state.focusedIndex !== -1) {
      active = this.state.id + '-' + this.state.focusedIndex
    }
    */
    return (
      <div
          className={className}
          aria-hidden={true}
          ref='menu'
      >
        <div className='ReactSelectBox3-off-screen'>
          {this.options().map(this.renderOption)}
        </div>
      </div>
    )
  },

  renderOption (option, i) {
    var className = 'ReactSelectBox3-option'
    if (i === this.state.focusedIndex) {
      className += ' ReactSelectBox3-option-focused'
    }
    if (this.isSelected(option.value)) {
      className += ' ReactSelectBox3-option-selected'
    }
    return (
      <div
        id={this.state.id + '-' + i}
        onClick={this.handleChange(option.value)}
        onMouseDown={this.handleMouseDownOnOption}
        className={className}
        tabIndex={-1}
        key={option.value}
        role='menuitem'
      >
        {option.label}
      </div>
    )
  },

  renderClearButton () {
    if (this.hasValue() && !this.state.expanded) {
      return (
        <button
          className='ReactSelectBox3-clear'
          aria-hidden={true}
          tabIndex={-1}
          onClick={this.handleClear} />
      )
    }
  },

  renderCloseButton () {
    if (this.isMultiple() && this.props.closeText) {
      return (
        <button
            tabIndex={-1}
            onClick={this.handleClose}
            className='ReactSelectBox3-close'>
          {this.props.closeText}
        </button>
      )
    }
  }
})

