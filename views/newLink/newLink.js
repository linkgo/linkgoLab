var React = require('react');
var ReactDOM = require('react-dom');

var NewLink = require('./../../components/test');

var newLink = React.createElement(NewLink);

ReactDOM.render(
  newLink,
  document.getElementById('newLink')
);
