import React from 'react'
import SelectBox from '../lib/select-box.es6'

require('../select-box.css')
require('./example.css')

var Example = React.createClass({

  displayName: 'Example',

  getInitialState () {
    return {
      color: null,
      colors: []
    }
  },

  handleChange (color) {
    this.setState({ color: color })
  },

  handleMultiChange (colors) {
    this.setState({ colors: colors })
  },

  render () {
    return (
      <div className='example'>
        <select>
          <option></option>
          <option>1</option>
          <option>2</option>
        </select>

        <h1>Select Box Example</h1>

        <SelectBox
            label="Favorite Color"
            className="my-example-select-box"
            onChange={this.handleChange}
            value={this.state.color}>
          <option value='red'>Red</option>
          <option value='green'>Green</option>
          <option value='blue'>Blue</option>
          <option value='black'>Black</option>
          <option value='orange'>Orange</option>
          <option value='greenish'>Light greenish with a little bit of yellow</option>
        </SelectBox>

        <h1>Multi Select Example</h1>
        <SelectBox
            label="Favorite Color"
            className="my-example-select-box"
            onChange={this.handleMultiChange}
            value={this.state.colors}
            multiple={true}>
          <option value='red'>Red</option>
          <option value='green'>Green</option>
          <option value='blue'>Blue</option>
          <option value='black'>Black</option>
          <option value='orange'>Orange</option>
          <option value='greenish'>Light greenish with a little bit of yellow</option>
        </SelectBox>
      </div>
    )
  }
})

React.render(<Example/>, document.getElementById('example'))
