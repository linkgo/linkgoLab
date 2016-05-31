(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var SignupForm = React.createClass({
  displayName: 'SignupForm',


  getInitialState: function getInitialState() {
    return {
      username: 'testman',
      email: 'test@test.com',
      password: '123456',
      passwordConfirm: '123456',
      showUsernameHelpSpan: false,
      showEmailHelpSpan: false,
      showPwdHelpSpan: false,
      showPwdConfirmHelpSpan: false,
      loginRes: {
        success: false,
        errors: [],
        errfor: {}
      }
    };
  },

  usernameChange: function usernameChange(event) {
    this.setState({ username: event.target.value });
    //console.log("username", event.target.value);
  },

  emailChange: function emailChange(event) {
    this.setState({ email: event.target.value });
    //console.log("email", event.target.value);
  },

  passwordChange: function passwordChange(event) {
    this.setState({ password: event.target.value });
    //console.log("password", event.target.value);
  },

  passwordConfirmChange: function passwordConfirmChange(event) {
    this.setState({ passwordConfirm: event.target.value });
    //console.log("passwordConfirm", event.target.value});
  },

  submit: function submit(event) {
    event.preventDefault();
    var username = this.state.username.trim();
    var email = this.state.email.trim();
    var password = this.state.password.trim();
    if (!username || !email || !password) {
      return;
    }
    var url = '/signup';
    console.log(username, email, password);
    $.post(url, {
      "username": username,
      "email": email,
      "password": password
    }, function (res, status) {
      if (res.success) {
        location.href = "/login";
      } else {
        this.setState({ loginRes: res });
      }
    }.bind(this));
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'container signup-container' },
      React.createElement(
        'div',
        { className: 'ui attached message' },
        React.createElement(
          'div',
          { className: 'header' },
          'Sign Up'
        )
      ),
      React.createElement(
        'form',
        { className: 'ui form attached segment signup-form', onSubmit: this.submit },
        React.createElement(
          'div',
          { className: 'field' },
          React.createElement(
            'label',
            null,
            'Username'
          ),
          React.createElement('input', { type: 'text', className: 'form-control', placeholder: 'Pick a username',
            email: this.state.username, onChange: this.usernameChange }),
          this.state.showUsernameHelpSpan ? React.createElement(
            'span',
            { className: 'help-block' },
            'help username'
          ) : null
        ),
        React.createElement(
          'div',
          { className: 'field' },
          React.createElement(
            'label',
            null,
            'Email'
          ),
          React.createElement('input', { type: 'email', className: 'form-control', placeholder: 'Enter your email address',
            email: this.state.email, onChange: this.emailChange }),
          this.state.showEmailHelpSpan ? React.createElement(
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
          React.createElement('input', { type: 'password', className: 'form-control', placeholder: 'Choose a password',
            email: this.state.password, onChange: this.passwordChange }),
          this.state.showPwdHelpSpan ? React.createElement(
            'span',
            { className: 'help-block' },
            'help password'
          ) : null
        ),
        React.createElement(
          'div',
          { className: 'field' },
          React.createElement(
            'label',
            null,
            'Password Confirm'
          ),
          React.createElement('input', { type: 'password', className: 'form-control', placeholder: 'Enter the password you choose again',
            email: this.state.passwordConfirm, onChange: this.passwordConfirmChange }),
          this.state.showPwdConfirmHelpSpan ? React.createElement(
            'span',
            { className: 'help-block' },
            'help passwordConfirm'
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
              'Sign Up'
            )
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(SignupForm, null), document.getElementById('signupForm'));

},{}]},{},[1]);
