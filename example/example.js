var React = require('react')
var SelectBox = require('../lib/select-box')

var colors = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'black', label: 'Black' },
  { value: 'orange', label: 'Orange' },
  { value: 'greenish', label: 'Light greenish with a little bit of yellow' }
]

var Example = React.createClass({displayName: 'Example',
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
      React.DOM.div({className: "example"},
        React.DOM.h1(null, "Select Box Example"),
        SelectBox({
          label: "Favorite Color",
          onChange: this.handleChange,
          value: this.state.color,
          options: colors}
        )
      )
    )
  }
})

React.renderComponent(Example(null), document.body)
