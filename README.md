# React Select Box

[![Build Status](https://travis-ci.org/instructure-react/react-select-box.svg?branch=master)](https://travis-ci.org/instructure/react-select-box) 

An accessible select box component for React.

## Demo

[http://instructure-react.github.io/react-select-box/](http://instructure-react.github.io/react-select-box/)


## Installation

```bash
$ npm install react-select-box --save
```

## Usage
To add a single select box:

```JavaScript
import React from 'react';
import SelectBox from 'react-select-box';

var option = React.createElement.bind(null, 'option');

export default class Example extends React.Component {

	constructor() {
		super();
		this.state = {
			color: null
		};
	}
	
	handleChange(color) {
		this.setState({color});
	}
	
	render() {
		return (
			<div>
				<SelectBox label="Favorite Color" onChange={this.handleChange.bind(this)} value={this.state.color}>
					<option value={'red'}>Red</option>
					<option value={'green'}>Green</option>
					<option value={'blue'}>Blue</option>
				</SelectBox>
			</div>
		);
	}

}

```

To add a multi select box:

```JavaScript
import React from 'react';
import SelectBox from 'react-select-box';

var option = React.createElement.bind(null, 'option');

export default class Example extends React.Component {

	constructor() {
		super();
		this.state = {
			colors: []
		};
	}
	
	handleMultiChange(colors) {
		this.setState({colors});
	}
	
	render() {
		return (
			<div>
				<SelectBox label="Favorite Colors" onChange={this.handleMultiChange.bind(this)} value={this.state.colors} multiple={true}>
					<option value={'red'}>Red</option>
					<option value={'green'}>Green</option>
					<option value={'blue'}>Blue</option>
				</SelectBox>
			</div>
		);
	}

}

```

## Development

```bash
$ git clone git@github.com:instructure/react-select-box.git
$ npm install
```

### Run the tests

```bash
$ npm test
```

### Start the dev server

```bash
$ PORT=4000 npm start
```

Defaults to port `1337` if no port env variable is set.

