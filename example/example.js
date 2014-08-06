/** @jsx React.DOM */

var React = require('react')
var SelectBox = require('./select-box')

var colors = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'black', label: 'Black' },
  { value: 'orange', label: 'Orange' },
  { value: 'greenish', label: 'Light greenish with a little bit of yellow' }
]

var Example = React.createClass({
  getInitialState: function () {
    return {
      color: null
    }
  },
  handleChange: function (color) {
    this.setState({ color: color })
  },
  render: function () {
    return(
      <div className="example">
        <h1>Select Box Example</h1>
        <SelectBox
          label="Favorite Color"
          onChange={this.handleChange}
          value={this.state.color}
          options={colors}
        />
      </div>
    )
  }
})

React.renderComponent(<Example />, document.body)
