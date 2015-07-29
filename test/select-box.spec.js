var React = require('react/addons')
var TestUtils = React.addons.TestUtils
var SelectBox = React.createFactory(require('../lib/select-box'))

describe('SelectBox component', function () {

  var selectBox
  var options
  var testOptions = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ]

  function makeSelectBox(multi) {
      var args = testOptions.map(function (option) {
        return React.DOM.option({value: option.value}, option.label)
      })

      args.unshift({
        label: 'foo',
        value: null,
        multiple: multi !== true ? false : multi,
        onChange: function() {}
      })

      return TestUtils.renderIntoDocument(SelectBox.apply(null, args))
  }

  function scryRenderedDOMComponentsWithClass(name) {
    return TestUtils.scryRenderedDOMComponentsWithClass(
      selectBox,
      name
    )
  }

  describe('Single select mode', function () {

    beforeEach(function () {
      selectBox = makeSelectBox()
    })

    it('should render the label when no value is selected', function () {
      var label = scryRenderedDOMComponentsWithClass('react-select-box-label')
      label.should.have.length(1)
      label[0].getDOMNode().textContent.should.equal(selectBox.props.label)
    })
    
    it('should render the label when no value is selected', function () {
      var label = scryRenderedDOMComponentsWithClass('react-select-box-label')
      label.should.have.length(1)
      label[0].getDOMNode().textContent.should.equal(selectBox.props.label)
    })

    it('should render the label for the selected value', function (done) {
      selectBox.setProps({ value: testOptions[0].value }, function () {
        var label = scryRenderedDOMComponentsWithClass('react-select-box-label')
        label.should.have.length(1)
        label[0].getDOMNode().textContent.should.equal(testOptions[0].label)
        done()
      })
    })

    it('should not render the clear button with no value selected', function (done) {
      selectBox.setProps({ value: null }, function () {
        var clear = scryRenderedDOMComponentsWithClass('react-select-box-clear')
        clear.should.have.length(0)
        done()
      })
    })


    it('should render the clear button with a selected value', function (done) {
      selectBox.setProps({ value: testOptions[0].value }, function () {
        var clear = scryRenderedDOMComponentsWithClass('react-select-box-clear')
        clear.should.have.length(1)
        done()
      })
    })

    it('should add hidden class to options when state.open is false', function (done) {
      selectBox.setState({ open: false }, function () {
        var options = scryRenderedDOMComponentsWithClass('react-select-box-options')
        options.should.have.length(1)
        options[0].getDOMNode().className.should.match(/hidden/)
        done()
      })
    })

    it('should render options', function (done) {
      selectBox.setState({ open: true }, function () {
        var options = scryRenderedDOMComponentsWithClass('react-select-box-options')
        options.should.have.length(1)
        done()
      })
    })

    it('should show an option for each option in props.options', function (done) {
      selectBox.setState({ open: true }, function () {
        var options = scryRenderedDOMComponentsWithClass('react-select-box-option')
        options.should.have.length(options.length)
        options.forEach(function (option, i) {
          option.getDOMNode().textContent.should.equal(testOptions[i].label)
        })
        done()
      })
    })

    describe("Toggle options list open/closed", function() {
      var selectBoxElement

      beforeEach(function() {
          selectBoxElement = TestUtils.findRenderedDOMComponentWithClass(
            selectBox,
            'react-select-box'
          )
      })

      it('should close an open options list when select box is clicked', function(done) {
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

      it('should open a closed options list when select box is clicked', function(done) {
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

      it('should close an open select box when focused and ESC key is pressed', function(done) {
        selectBox.setState({ open: true }, function () {
          // Simulate focus event on selectBox
          TestUtils.Simulate.focus(selectBoxElement)
          // Simulate pressing escape key
          TestUtils.Simulate.keyDown(selectBoxElement, {keyCode: 27, which: 27})
          // Re-render component (to ensure state change occured)
          selectBox.forceUpdate(function() {
            // Check that it is closed
            selectBox.state.open.should.equal(false)
            // End test
            done()
          })
        })
      })

      it('should open a closed select box when focused and ENTER key is pressed', function(done) {
        selectBox.setState({ open: false }, function () {
          // Simulate focus event on selectBox
          TestUtils.Simulate.focus(selectBoxElement)
          // Simulate pressing down arrow key
          TestUtils.Simulate.keyDown(selectBoxElement, {keyCode: 40, which: 40})
          // Re-render component (to ensure state change occured)
          selectBox.forceUpdate(function() {
            // Check that it is open
            selectBox.state.open.should.equal(true)
            // End test
            done()
          })
        })
      })

    })

  })

  describe('Multi-select mode', function () {

    beforeEach(function () {
      selectBox = makeSelectBox(true)
    })

    it('should render the label for muliple selected values', function (done) {
      var testValues = [testOptions[0].value, testOptions[1].value];
      var expectedLabel = testOptions[0].label + ', ' + testOptions[1].label;

      selectBox.setProps({ value: testValues }, function () {
        var label = scryRenderedDOMComponentsWithClass('react-select-box-label')
        label.should.have.length(1)
        label[0].getDOMNode().textContent.should.equal(expectedLabel)
        done()
      })
    })

  })

})
