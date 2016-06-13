(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var WeahterStation = React.createClass({
  displayName: "WeahterStation",


  fetchData: function fetchData(key, location, count, callback) {
    var url = "/data";
    $.post(url, {
      "dataKey": key,
      "location": location,
      "count": count
    }, callback.bind(this));
  },

  createChart: function createChart(labels, data) {
    var tempChartCanvas = document.getElementById("tempChart").getContext("2d");
    var dataSet = {
      labels: labels,
      datasets: [{
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        data: data
      }]
    };

    var tempChart = new Chart(tempChartCanvas).Line(dataSet, { animationSteps: 15 });
    this.setState({ tempChart: tempChart });
  },

  initChart: function initChart(location) {
    this.fetchData('weather', location, 6, function (res, status) {
      if (res.success) {
        var ts = [];
        var temp = [];
        res.data.map(function (d, i) {
          var dj = JSON.parse(d);
          temp.push(Number(dj.TEMP_NOW));
          ts.push(dj.ts);
        });
        console.log(ts, temp);
        this.createChart(ts, temp);
      } else {
        console.error(url, status, err.toString());
      }
    });
  },

  updateChart: function updateChart(location) {
    this.fetchData('weather', location, 1, function (res, status) {
      if (res.success) {
        var dj = JSON.parse(res.data[0]);
        console.log(Number(dj.TEMP_NOW), dj.ts);
        this.setState({ data: dj });
        this.state.tempChart.addData([Number(dj.TEMP_NOW)], dj.ts);
        this.state.tempChart.removeData();
      } else {
        console.error(url, status, err.toString());
      }
    });
  },

  getInitialState: function getInitialState() {
    return { data: {} };
  },

  componentDidMount: function componentDidMount() {
    setTimeout(this.initChart, 200, 'Shanghai');
    setInterval(this.updateChart, 5000, 'Shanghai');
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "section content" },
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "p",
          null,
          JSON.stringify(this.state.data)
        )
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-md-3 col-sm-6 col-xs-12" },
          React.createElement(InfoBox, { bgColor: "bg-aqua", icon: "ion ion-ios-gear-outline", infoName: "CPU Traffic", infoStr: "90", infoStrSuffix: "%" })
        ),
        React.createElement("div", { className: "col-md-3 col-sm-6 col-xs-12" }),
        React.createElement("div", { className: "clearfix visible-sm-block" }),
        React.createElement("div", { className: "col-md-3 col-sm-6 col-xs-12" }),
        React.createElement("div", { className: "col-md-3 col-sm-6 col-xs-12" })
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-md-12" },
          React.createElement(ChartBox, null)
        )
      )
    );
  }
});

var InfoBox = React.createClass({
  displayName: "InfoBox",

  render: function render() {
    return React.createElement(
      "div",
      { className: "info-box" },
      React.createElement(
        "span",
        { className: "info-box-icon " + this.props.bgColor },
        React.createElement("i", { className: this.props.icon })
      ),
      React.createElement(
        "div",
        { className: "info-box-content" },
        React.createElement(
          "span",
          { className: "info-box-text" },
          this.props.infoName
        ),
        React.createElement(
          "span",
          { className: "info-box-number" },
          this.props.infoStr,
          React.createElement(
            "small",
            null,
            this.props.infoStrSuffix
          )
        )
      )
    );
  }
});

var ChartBox = React.createClass({
  displayName: "ChartBox",

  render: function render() {
    return React.createElement(
      "div",
      { className: "box" },
      React.createElement(
        "div",
        { className: "box-header with-border" },
        React.createElement(
          "h3",
          { className: "box-title" },
          "History Report"
        ),
        React.createElement(
          "div",
          { className: "box-tools pull-right" },
          React.createElement(
            "button",
            { type: "button", className: "btn btn-box-tool", "data-widget": "collapse" },
            React.createElement("i", { className: "fa fa-minus" })
          )
        )
      ),
      React.createElement(
        "div",
        { className: "box-body" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-md-8" },
            React.createElement(
              "p",
              { className: "text-center" },
              React.createElement(
                "strong",
                null,
                "Temperature"
              )
            ),
            React.createElement(
              "div",
              { className: "chart" },
              React.createElement("canvas", { id: "tempChart", style: { "height": "180px" } })
            )
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(WeahterStation, { pollInterval: 1000 }), document.getElementById('weatherStation'));

},{}]},{},[1]);
