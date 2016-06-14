(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var WeahterStation = React.createClass({
  displayName: "WeahterStation",


  fetchDataTemp: function fetchDataTemp(key, count, callback) {
    var url = "/data";
    $.post(url, {
      "dataKey": key,
      "count": count
    }, callback.bind(this));
  },

  createChart: function createChart(id, labels, data) {
    var canvas = document.getElementById(id).getContext("2d");
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

    var chart = new Chart(canvas).Line(dataSet, { animationSteps: 15 });
    this.setState(_defineProperty({}, id, chart));
  },

  initChart: function initChart() {
    this.fetchDataTemp('office', 20, function (res, status) {
      if (res.success) {
        var data = {
          ts: [],
          temp: [],
          humi: [],
          pres: [],
          light: []
        };
        res.data.reverse().map(function (d, i) {
          var dj = JSON.parse(d);
          data.ts.push(moment(dj.ts).format('h:mm:ss'));
          data.temp.push(Number(dj.temp));
          data.humi.push(Number(dj.humi));
          data.pres.push(Number(dj.pres));
          data.light.push(Number(dj.light));
        });
        this.createChart('tempChart', data.ts, data.temp);
        this.createChart('humiChart', data.ts, data.humi);
        this.createChart('lightChart', data.ts, data.light);
        this.createChart('presChart', data.ts, data.pres);
      } else {
        console.error(url, status, err.toString());
      }
    });
  },

  updateChart: function updateChart() {
    this.fetchDataTemp('office', 1, function (res, status) {
      if (res.success) {
        var dj = JSON.parse(res.data[0]);
        this.setState({ data: dj });
        this.state.tempChart.addData([Number(dj.temp)], moment(dj.ts).format('h:mm:ss'));
        this.state.tempChart.removeData();
        this.state.humiChart.addData([Number(dj.humi)], moment(dj.ts).format('h:mm:ss'));
        this.state.humiChart.removeData();
        this.state.lightChart.addData([Number(dj.light)], moment(dj.ts).format('h:mm:ss'));
        this.state.lightChart.removeData();
        this.state.presChart.addData([Number(dj.pres)], moment(dj.ts).format('h:mm:ss'));
        this.state.presChart.removeData();
      } else {
        console.error(url, status, err.toString());
      }
    });
  },

  getInitialState: function getInitialState() {
    return { data: {} };
  },

  componentDidMount: function componentDidMount() {
    setTimeout(this.initChart, 200);
    setInterval(this.updateChart, 5000);
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "section content" },
      React.createElement(
        "div",
        { className: "row", style: { "visibility": "hidden" } },
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
          React.createElement(InfoBox, { bgColor: "bg-aqua", icon: "ion ion-thermometer", infoName: "Temperature", infoStr: this.state.data.temp, infoStrSuffix: " ℃" })
        ),
        React.createElement(
          "div",
          { className: "col-md-3 col-sm-6 col-xs-12" },
          React.createElement(InfoBox, { bgColor: "bg-green", icon: "ion ion-waterdrop", infoName: "Humidity", infoStr: this.state.data.humi, infoStrSuffix: " %" })
        ),
        React.createElement("div", { className: "clearfix visible-sm-block" }),
        React.createElement(
          "div",
          { className: "col-md-3 col-sm-6 col-xs-12" },
          React.createElement(InfoBox, { bgColor: "bg-maroon", icon: "fa fa-sun-o", infoName: "Light", infoStr: this.state.data.light, infoStrSuffix: " lux" })
        ),
        React.createElement(
          "div",
          { className: "col-md-3 col-sm-6 col-xs-12" },
          React.createElement(InfoBox, { bgColor: "bg-yellow", icon: "fa fa-rocket", infoName: "Pressure", infoStr: this.state.data.pres, infoStrSuffix: " hPa" })
        )
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-md-6" },
          React.createElement(ChartBox, { chartTitle: "Temperature", canvasId: "tempChart" })
        ),
        React.createElement(
          "div",
          { className: "col-md-6" },
          React.createElement(ChartBox, { chartTitle: "Humidity", canvasId: "humiChart" })
        ),
        React.createElement(
          "div",
          { className: "col-md-6" },
          React.createElement(ChartBox, { chartTitle: "Light", canvasId: "lightChart" })
        ),
        React.createElement(
          "div",
          { className: "col-md-6" },
          React.createElement(ChartBox, { chartTitle: "Pressure", canvasId: "presChart" })
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
            { className: "col-md-12" },
            React.createElement(
              "p",
              { className: "text-center" },
              React.createElement(
                "strong",
                null,
                this.props.chartTitle
              )
            ),
            React.createElement(
              "div",
              { className: "chart" },
              React.createElement("canvas", { id: this.props.canvasId, style: { "height": "180px" } })
            )
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(WeahterStation, null), document.getElementById('weatherStation'));

},{}]},{},[1]);
