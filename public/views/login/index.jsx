var LoginForm = React.createClass({
  render: function() {
    return (
      <p>
        We are react now, {this.props.name} <input type="text" placeholder="Your name here" />!
        It is {this.props.date.toTimeString()}
      </p>
    );
  }
});

setInterval(function() {
  ReactDOM.render(
    <LoginForm name="someone" date={new Date()} />,
    document.getElementById('loginForm')
  );
}, 500);
