var LoginForm = React.createClass({
  
  getInitialState: function() {
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

  emailChange: function(event) {
    this.setState({email: event.target.value});
    //console.log("email", event.target.value);
  },

  passwordChange: function(event) {
    this.setState({password: event.target.value});
    //console.log("password", event.target.value);
  },

  submit: function(data) {
    event.preventDefault();
    var email = this.state.email.trim();
    var password = this.state.password.trim();
    var url = "/login";
    var updateRes = function(res) {
      this.setState({loginRes: res});
    }
    if (!email || !password) {
      return;
    }
    $.post(url,
      {
        "username": email,
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
            Link and Go
          </div>
        </div>

        <form className="ui form attached segment login-form" onSubmit={this.submit} >
          <div className="field">
            <label>Email Address</label>
            <input type="email" className="form-control" placeholder="Enter your email address here"
                  email={this.state.email} onChange={this.emailChange} />
            {
              this.state.showEmailSpan ? 
              <span className="help-block">help email address</span> : null
            }
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Enter password here"
                  email={this.state.password} onChange={this.passwordChange} />
            {
              this.state.showPwdSpan ? 
              <span className="help-block">help password</span> : null
            }
          </div>
          <div className="field button">
            <div className="row">
              <button type="submit" className="ui button">Sign In</button>
              <button className="ui button right">Sign Up</button>
            </div>
          </div>
        </form>

        {errorMessagesDiv}

      </div>
    );
  }
});


setInterval(function() {
  ReactDOM.render(
    <LoginForm name="someone" date={new Date()} />,
    document.getElementById('loginForm')
  );
}, 500);
