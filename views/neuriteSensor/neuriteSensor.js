var React = require('react');
var ReactDOM = require('react-dom');

var NewLink = require('./../../components/test');
var NeuriteSensor = require('./../../components/neuriteSensor');

var newLink = React.createElement(NewLink);
var neuriteSensor = React.createElement(NeuriteSensor);

ReactDOM.render(
  neuriteSensor,
  document.getElementById('neuriteSensor')
);
