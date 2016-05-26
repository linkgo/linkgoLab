var LoginForm = React.createClass({
  getInitialState: function() {
    return {
      showPwdSpan: false,
      showEmailSpan: false,
    };
  },

  render: function() {
    return (
      <form className="ui form login-form">
        <div className="field">
          <label>Email Address</label>
          <input type="email" className="form-control" placeholder="Enter your email address here" />
          {
            this.state.showEmailSpan ? 
            <span className="help-block">help email address</span> : null
          }
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" className="form-control" placeholder="Enter password here" />
          {
            this.state.showPwdSpan ? 
            <span className="help-block">help password</span> : null
          }
        </div>
        <div className="field">
          <button type="submit" className="ui button">Sign In</button>
        </div>
      </form>
    );
  }
});

setInterval(function() {
  ReactDOM.render(
    <LoginForm name="someone" date={new Date()} />,
    document.getElementById('loginForm')
  );
}, 500);
