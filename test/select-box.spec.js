var React = require('react')
var SelectBox = React.createFactory(require('../lib/select-box'))
var TestUtils = require('react-addons-test-utils')

describe('SelectBox component', function() {

  var selectBox
  const testOptions = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ]
  const defaultProps = {
    label: 'foo',
    value: null,
    onChange: function() {
    }
  };
  var childrens

  function setProps(props, callback) {
    var readyProps = [Object.assign({}, defaultProps[0], props), childrens]
    selectBox = TestUtils.renderIntoDocument(SelectBox.apply(null, readyProps))
    return callback()
  }

  beforeEach(function() {
    childrens = testOptions.map(function(option) {
      return React.DOM.option({ value: option.value }, option.label)
    })

    var args = childrens.slice();
    args.unshift(defaultProps);

    selectBox = TestUtils.renderIntoDocument(SelectBox.apply(null, args))
  })

  it('should render the label when no value is selected', function() {
    var label = TestUtils.scryRenderedDOMComponentsWithClass(
      selectBox,
      'react-select-box-label'
    )
    label.should.have.length(1)
    label[0].textContent.should.equal(selectBox.props.label)
  })

  it('should render the label for the selected value', function(done) {
    setProps({ value: testOptions[0].value }, function() {
      var label = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-label'
      )
      label.should.have.length(1)
      label[0].textContent.should.equal(testOptions[0].label)
      done()
    })
  })

  it('should not render the clear button with no value selected', function(done) {
    setProps({ value: null }, function() {
      var clear = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-clear'
      )
      clear.should.have.length(0)
      done()
    })
  })


  it('should render the clear button with a selected value', function(done) {
    setProps({ value: testOptions[0].value }, function() {
      var clear = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-clear'
      )
      clear.should.have.length(1)
      done()
    })
  })

  it('should add hidden class to options when state.open is false', function(done) {
    selectBox.setState({ open: false }, function() {
      var options = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-options'
      )
      options.should.have.length(1)
      options[0].className.should.match(/hidden/)
      done()
    })
  })

  it('should render options', function(done) {
    selectBox.setState({ open: true }, function() {
      var options = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-options'
      )
      options.should.have.length(1)
      done()
    })
  })

  it('should show an option for each option in props.options', function(done) {
    selectBox.setState({ open: true }, function() {
      var options = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-option'
      )
      options.should.have.length(options.length)
      options.forEach(function(option, i) {
        option.textContent.should.equal(testOptions[i].label)
      })
      done()
    })
  })

  describe("Toggle options list open/closed when select box is clicked", function() {
    var selectBoxElement

    beforeEach(function() {
      selectBoxElement = TestUtils.findRenderedDOMComponentWithClass(
        selectBox,
        'react-select-box'
      )
    })

    it('should close options list when select box is clicked on (if options list is already open)', function(done) {
      // Start with open options list
      selectBox.setState({ open: true }, function() {
        // Simulate a click on the select box (element with class tag `react-select-box`)
        TestUtils.Simulate.click(selectBoxElement)
        // Re-render component (to ensure state change occured)
        selectBox.forceUpdate(function() {
          // Check if it is closed
          selectBox.state.open.should.equal(false)
          // End test
          done()
        })
      })
    })

    it('should open options list when select box is clicked on (if options list is closed)', function(done) {
      // Start with closed options list
      selectBox.setState({ open: false }, function() {
        // Simulate a click on the select box (element with class tag `react-select-box`)
        TestUtils.Simulate.click(selectBoxElement)
        // Re-render component (to ensure state change occured)
        selectBox.forceUpdate(function() {
          // Check if it is open
          selectBox.state.open.should.equal(true)
          // End test
          done()
        })
      })
    })

  })
})