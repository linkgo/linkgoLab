var LoginForm = React.createClass({
  
  getInitialState: function() {
    return {
      username: 'test@test.com',
      password: '123456',
      showPwdHelpSpan: false,
      showUsernameHelpSpan: false,
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

  passwordChange: function(event) {
    this.setState({password: event.target.value});
    //console.log("password", event.target.value);
  },

  submit: function(event) {
    event.preventDefault();
    var username = this.state.username.trim();
    var password = this.state.password.trim();
    var updateRes = function(res) {
      this.setState({loginRes: res});
    }
    if (!username || !password) {
      return;
    }
    var url = '/login';
    $.post(url,
      {
        "username": username,
        "password": password
      },
      function (res, status) {
        console.log(res);
        this.setState({loginRes: res});
      }.bind(this)
    );
  },

  render: function() {

    var errorMessages = this.state.loginRes.errors.map(function(errorMsg, index) {
      return (
          <div className="row" key={index} >
            <i className="icon warning circle"></i>
            {errorMsg}
          </div>
      );
    });

    var errorMessagesDiv;
    if (this.state.loginRes.errors.length == 0) {
      errorMessagesDiv = null;
    } else {
      errorMessagesDiv = 
        <div className="ui bottom attached warning message">
          {errorMessages}
        </div>
        
    }

    return (

      <div className="container login-container">
          
        <div className="ui attached message">
          <div className="header">
            Sign In
          </div>
        </div>

        <form className="ui form attached segment login-form" onSubmit={this.submit} >
          <div className="field">
            <label>Username</label>
            <input type="text" className="form-control" placeholder="Enter your username"
                  username={this.state.username} onChange={this.usernameChange} />
            {
              this.state.showUsernameHelpSpan ? 
              <span className="help-block">help username</span> : null
            }
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Enter your password"
                  password={this.state.password} onChange={this.passwordChange} />
            {
              this.state.showPwdHelpSpan ? 
              <span className="help-block">help password</span> : null
            }
          </div>
          <div className="field button">
            <div className="row">
              <button type="submit" className="ui button">Sign In</button>
              <a className="ui button right" href="/signup/">Sign Up</a>
            </div>
          </div>
        </form>

        {errorMessagesDiv}

      </div>
    );
  }
});

ReactDOM.render(
  <LoginForm />,
  document.getElementById('loginForm')
);
