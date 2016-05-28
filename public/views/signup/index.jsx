var SignupForm = React.createClass({

  getInitialState: function() {
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
      },
    };
  },

  usernameChange: function(event) {
    this.setState({username: event.target.value});
    //console.log("username", event.target.value);
  },

  emailChange: function(event) {
    this.setState({email: event.target.value});
    //console.log("email", event.target.value);
  },

  passwordChange: function(event) {
    this.setState({password: event.target.value});
    //console.log("password", event.target.value);
  },

  passwordConfirmChange: function(event) {
    this.setState({passwordConfirm: event.target.value});
    //console.log("passwordConfirm", event.target.value});
  },

  submit: function(event) {
    event.preventDefault();
    var username = this.state.username.trim();
    var email = this.state.email.trim();
    var password = this.state.password.trim();
    if (!username || !email || !password) {
      return;
    }
    var url = '/signup';
    $.post(url,
      {
        "username": username,
        "email": email,
        "password": password
      },
      function(res, status) {
        console.log(res);
      }.bind(this)
    );
  },
  
  render: function() {
    return (
      <div className="container signup-container">

        <div className="ui attached message">
          <div className="header">
            Sign Up
          </div>
        </div>

        <form className="ui form attached segment signup-form" onSubmit={this.submit} >
          <div className="field">
            <label>Username</label>
            <input type="text" className="form-control" placeholder="Pick a username"
                  email={this.state.username} onChange={this.usernameChange} />
            {
              this.state.showUsernameHelpSpan ? 
              <span className="help-block">help username</span> : null
            }
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" className="form-control" placeholder="Enter your email address"
                  email={this.state.email} onChange={this.emailChange} />
            {
              this.state.showEmailHelpSpan ? 
              <span className="help-block">help email address</span> : null
            }
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Choose a password"
                  email={this.state.password} onChange={this.passwordChange} />
            {
              this.state.showPwdHelpSpan ? 
              <span className="help-block">help password</span> : null
            }
          </div>
          <div className="field">
            <label>Password Confirm</label>
            <input type="password" className="form-control" placeholder="Enter the password you choose again"
                  email={this.state.passwordConfirm} onChange={this.passwordConfirmChange} />
            {
              this.state.showPwdConfirmHelpSpan ? 
              <span className="help-block">help passwordConfirm</span> : null
            }
          </div>
          <div className="field button">
            <div className="row">
              <button type="submit" className="ui button">Sign Up</button>
            </div>
          </div>
          
        </form>
      </div>
    );
  }
});

ReactDOM.render(
  <SignupForm />,
  document.getElementById('signupForm')
);

