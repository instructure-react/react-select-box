var SelectBox = require('../lib/select-box.es6')
var React = require('react/addons')
var TestUtils = React.addons.TestUtils

describe('SelectBox component', () => {

  let selectBox
  let options
  let testOptions

  beforeEach(() => {
    testOptions = [
      { value: 'red', label: 'Red' },
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue' },
    ]

    let options = testOptions.map((option) => {
      return <option key={option.value} value={option.value}>{option.label}</option>
    })

    selectBox = TestUtils.renderIntoDocument(
      <SelectBox
          label='foo'
          value={null}
          onChange={function(){}}>
        {options}
      </SelectBox>
    )
  })

  it('should render the label when no value is selected', () => {
    var label = TestUtils.scryRenderedDOMComponentsWithClass(
      selectBox,
      'react-select-box-label'
    )
    label.should.have.length(1)
    React.findDOMNode(label[0]).textContent.should.equal(selectBox.props.label)
  })

  it('should render the label for the selected value', (done) => {
    selectBox.setProps({ value: testOptions[0].value }, () => {
      var label = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-label'
      )
      label.should.have.length(1)
      React.findDOMNode(label[0]).textContent.should.equal(testOptions[0].label)
      done()
    })
  })

  it('should not render the clear button with no value selected', (done) => {
    selectBox.setProps({ value: null }, () => {
      var clear = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-clear'
      )
      clear.should.have.length(0)
      done()
    })
  })


  it('should render the clear button with a selected value', function (done) {
    selectBox.setProps({ value: testOptions[0].value }, function () {
      var clear = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-clear'
      )
      clear.should.have.length(1)
      done()
    })
  })

  it('should add hidden class to options when state.open is false', function (done) {
    selectBox.setState({ open: false }, function () {
      var options = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-options'
      )
      options.should.have.length(1)
      React.findDOMNode(options[0]).className.should.match(/hidden/)
      done()
    })
  })

  it('should render options', function (done) {
    selectBox.setState({ open: true }, function () {
      var options = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-options'
      )
      options.should.have.length(1)
      done()
    })
  })

  it('should show an option for each option in props.options', function (done) {
    selectBox.setState({ open: true }, () => {
      var options = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-option'
      )
      options.should.have.length(options.length)
      options.forEach(function (option, i) {
        console.log(React.findDOMNode(option).textContent,testOptions[i].label)
        React.findDOMNode(option).textContent.should.equal(testOptions[i].label)
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
      selectBox.setState({ open: true }, function () {
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
      selectBox.setState({ open: false }, function () {
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
