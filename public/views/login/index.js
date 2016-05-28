(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var LoginForm = React.createClass({
  displayName: 'LoginForm',


  getInitialState: function getInitialState() {
    return {
      email: 'test@test.com',
      password: '123456',
      showPwdSpan: false,
      showEmailSpan: false,
      testValue: 'zero',
      loginRes: {
        success: false,
        errors: [],
        errfor: {}
      }
    };
  },

  emailChange: function emailChange(event) {
    this.setState({ email: event.target.value });
    //console.log("email", event.target.value);
  },

  passwordChange: function passwordChange(event) {
    this.setState({ password: event.target.value });
    //console.log("password", event.target.value);
  },

  submit: function submit(data) {
    event.preventDefault();
    var email = this.state.email.trim();
    var password = this.state.password.trim();
    var url = "/login";
    var updateRes = function updateRes(res) {
      this.setState({ loginRes: res });
    };
    if (!email || !password) {
      return;
    }
    $.post(url, {
      "username": email,
      "password": password
    }, function (res, status) {
      console.log(res);
      this.setState({ loginRes: res });
    }.bind(this));
  },

  render: function render() {

    var errorMessages = this.state.loginRes.errors.map(function (errorMsg, index) {
      return React.createElement(
        'div',
        { className: 'row', key: index },
        React.createElement('i', { className: 'icon warning circle' }),
        errorMsg
      );
    });

    var errorMessagesDiv;
    if (this.state.loginRes.errors.length == 0) {
      errorMessagesDiv = null;
    } else {
      errorMessagesDiv = React.createElement(
        'div',
        { className: 'ui bottom attached warning message' },
        errorMessages
      );
    }

    return React.createElement(
      'div',
      { className: 'container login-container' },
      React.createElement(
        'div',
        { className: 'ui attached message' },
        React.createElement(
          'div',
          { className: 'header' },
          'Link and Go'
        )
      ),
      React.createElement(
        'form',
        { className: 'ui form attached segment login-form', onSubmit: this.submit },
        React.createElement(
          'div',
          { className: 'field' },
          React.createElement(
            'label',
            null,
            'Email Address'
          ),
          React.createElement('input', { type: 'email', className: 'form-control', placeholder: 'Enter your email address here',
            email: this.state.email, onChange: this.emailChange }),
          this.state.showEmailSpan ? React.createElement(
            'span',
            { className: 'help-block' },
            'help email address'
          ) : null
        ),
        React.createElement(
          'div',
          { className: 'field' },
          React.createElement(
            'label',
            null,
            'Password'
          ),
          React.createElement('input', { type: 'password', className: 'form-control', placeholder: 'Enter password here',
            email: this.state.password, onChange: this.passwordChange }),
          this.state.showPwdSpan ? React.createElement(
            'span',
            { className: 'help-block' },
            'help password'
          ) : null
        ),
        React.createElement(
          'div',
          { className: 'field button' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'button',
              { type: 'submit', className: 'ui button' },
              'Sign In'
            ),
            React.createElement(
              'button',
              { className: 'ui button right' },
              'Sign Up'
            )
          )
        )
      ),
      errorMessagesDiv
    );
  }
});

setInterval(function () {
  ReactDOM.render(React.createElement(LoginForm, { name: 'someone', date: new Date() }), document.getElementById('loginForm'));
}, 500);

},{}]},{},[1]);
