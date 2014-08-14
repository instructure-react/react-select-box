var React = require('react')
var SelectBox = require('../lib/select-box')
var MultiSelect = require('../lib/multi-select')

React.DOM.option({value: 'red'}, 'Red')

var Example = React.createClass({displayName: 'Example',
  getInitialState: function () {
    return {
      color: null,
      colors: []
    }
  },
  handleChange: function (color) {
    this.setState({ color: color })
  },
  handleMultiChange: function (colors) {
    this.setState({ colors: colors })
  },
  render: function () {
    return(
      React.DOM.div({className: "example"},
        React.DOM.h1(null, "Select Box Example"),
        SelectBox(
          {
            label: "Favorite Color",
            onChange: this.handleChange,
            value: this.state.color
          },
          React.DOM.option({value: 'red'}, 'Red'),
          React.DOM.option({value: 'green'}, 'Green'),
          React.DOM.option({value: 'blue'}, 'Blue'),
          React.DOM.option({value: 'black'}, 'Black'),
          React.DOM.option({value: 'orange'}, 'Orange'),
          React.DOM.option({value: 'greenish'}, 'Light greenish with a little bit of yellow')
        ),
        React.DOM.h1(null, "Multi Select Example"),
        SelectBox(
          {
            label: "Favorite Colors",
            onChange: this.handleMultiChange,
            value: this.state.colors,
            multiple: true
          },
          React.DOM.option({value: 'red'}, 'Red'),
          React.DOM.option({value: 'green'}, 'Green'),
          React.DOM.option({value: 'blue'}, 'Blue'),
          React.DOM.option({value: 'black'}, 'Black'),
          React.DOM.option({value: 'orange'}, 'Orange'),
          React.DOM.option({value: 'greenish'}, 'Light greenish with a little bit of yellow')
        )
      )
    )
  }
})

React.renderComponent(Example(null), document.body)
