(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var LoginForm = React.createClass({
  displayName: "LoginForm",

  getInitialState: function getInitialState() {
    return {
      showPwdSpan: false,
      showEmailSpan: false
    };
  },

  render: function render() {
    return React.createElement(
      "form",
      { className: "ui form login-form" },
      React.createElement(
        "div",
        { className: "field" },
        React.createElement(
          "label",
          null,
          "Email Address"
        ),
        React.createElement("input", { type: "email", className: "form-control", placeholder: "Enter your email address here" }),
        this.state.showEmailSpan ? React.createElement(
          "span",
          { className: "help-block" },
          "help email address"
        ) : null
      ),
      React.createElement(
        "div",
        { className: "field" },
        React.createElement(
          "label",
          null,
          "Password"
        ),
        React.createElement("input", { type: "password", className: "form-control", placeholder: "Enter password here" }),
        this.state.showPwdSpan ? React.createElement(
          "span",
          { className: "help-block" },
          "help password"
        ) : null
      ),
      React.createElement(
        "div",
        { className: "field" },
        React.createElement(
          "button",
          { type: "submit", className: "ui button" },
          "Sign In"
        )
      )
    );
  }
});

setInterval(function () {
  ReactDOM.render(React.createElement(LoginForm, { name: "someone", date: new Date() }), document.getElementById('loginForm'));
}, 500);

},{}]},{},[1]);
