var LoginForm = React.createClass({
  getInitialState: function() {
    return {
      showPwdSpan: false,
      showEmailSpan: false,
    };
  },

  render: function() {
    return (
      <form className="ui form">
        <fieldset class="form-group">
          <label>Email Address</label>
          <input type="email" class="form-control" placeholder="Enter your email address here" />
          {
            this.state.showEmailSpan ? 
            <span class="help-block">help email address</span> : null
          }
        </fieldset>
        <fieldset class="form-group">
          <label>Password</label>
          <input type="password" class="form-control" placeholder="Enter password here" />
          {
            this.state.showPwdSpan ? 
            <span class="help-block">help password</span> : null
          }
        </fieldset>
        <button type="submit" class="btn btn-primary">Sign In</button>
        <p>
          We are react now, {this.props.name} <input type="text" placeholder="Your name here" />
          It is {this.props.date.toTimeString()}
        </p>
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
