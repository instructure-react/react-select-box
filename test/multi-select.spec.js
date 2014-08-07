var MultiSelect = require('../lib/multi-select')
var TestUtils = require('react/addons').addons.TestUtils

describe('MultiSelect component', function () {
  
  var selectBox
  var optionsProp

  beforeEach(function () {
    optionsProp = [
      { value: 'red', label: 'Red' },
      { value: 'green', label: 'Green' },
      { value: 'blue', label: 'Blue' },
    ]

    selectBox = TestUtils.renderIntoDocument(MultiSelect({
      label: 'foo',
      value: [],
      onChange: function() {},
      options: optionsProp
    }))
  })
  
  it('should render the label when no value is selected', function () {
    var label = TestUtils.scryRenderedDOMComponentsWithClass(
      selectBox,
      'react-select-box-label'
    )
    label.should.have.length(1)
    label[0].getDOMNode().textContent.should.equal(selectBox.props.label)
  })

  it('should render the label for multiple selected values', function (done) {
    selectBox.setProps({ value: ['red', 'green'] }, function () {
      var label = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-label'
      )
      label.should.have.length(1)
      label[0].getDOMNode().textContent.should.equal('Red, and Green')
      done()
    })
  })

  it('should render the label for the selected value', function (done) {
    selectBox.setProps({ value: [optionsProp[0].value] }, function () {
      var label = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-label'
      )
      label.should.have.length(1)
      label[0].getDOMNode().textContent.should.equal(optionsProp[0].label)
      done()
    })
  })


  it('should not render the clear button with no value selected', function (done) {
    selectBox.setProps({ value: [] }, function () {
      var clear = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-clear'
      )
      clear.should.have.length(0)
      done()
    })
  })


  it('should render the clear button with a selected value', function (done) {
    selectBox.setProps({ value: optionsProp[0].value }, function () {
      var clear = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-clear'
      )
      clear.should.have.length(1)
      done()
    })
  })

  it('should not show options when state.open is false', function (done) {
    selectBox.setState({ open: false }, function () {
      var options = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-options'
      )
      options.should.have.length(0)
      done()
    })
  })

  it('should show options when state.open is true', function (done) {
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
    selectBox.setState({ open: true }, function () {
      var options = TestUtils.scryRenderedDOMComponentsWithClass(
        selectBox,
        'react-select-box-option'
      )
      options.should.have.length(optionsProp.length)
      options.forEach(function (option, i) {
        option.getDOMNode().textContent.should.equal(optionsProp[i].label)
      })
      done()
    })
  })



})

