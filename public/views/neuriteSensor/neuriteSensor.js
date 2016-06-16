(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var NeuriteSensor = React.createClass({
  displayName: "NeuriteSensor",


  fetchDataTemp: function fetchDataTemp(key, count, callback) {
    var url = "/data";
    $.post(url, {
      "dataKey": key,
      "count": count
    }, callback.bind(this));
  },

  createChart: function createChart(id, data, title, yTitle) {
    $([id]).highcharts({
      chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10
      },
      title: {
        text: title
      },
      xAxis: {
        type: 'datetime'
      },
      //tickPixelInterval: 150
      //categories:
      yAxis: {
        title: {
          text: yTitle
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      /*
                  tooltip: {
                      formatter: function () {
                          return '<b>' + this.series.name + '</b><br/>' +
                              Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                              Highcharts.numberFormat(this.y, 2);
                      }
                  },
      */
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [{
        id: id,
        name: 'tempreature',
        data: data
      }]
    });
  },

  initChart: function initChart() {
    this.fetchDataTemp('office', 10, function (res, status) {
      if (res.success) {
        var ts;
        var tempData = [];
        var humiData = [];
        var lightData = [];
        var presData = [];

        res.data.reverse().map(function (d, i) {
          var dj = JSON.parse(d);
          ts = dj.ts;
          //var ts = moment(dj.ts).format('h:mm:ss');
          tempData.push({ x: ts, y: Number(dj.temp) });
          humiData.push({ x: ts, y: Number(dj.humi) });
          lightData.push({ x: ts, y: Number(dj.light) });
          presData.push({ x: ts, y: Number(dj.pres) });
        });

        this.ts = ts;
        this.createChart('tempChart', tempData, '', '℃');
        this.tempChart = $('#tempChart').highcharts();
        this.createChart('humiChart', humiData, '', '%');
        this.humiChart = $('#humiChart').highcharts();
        this.createChart('lightChart', lightData, '', 'lux');
        this.lightChart = $('#lightChart').highcharts();
        this.createChart('presChart', presData, '', 'hPa');
        this.presChart = $('#presChart').highcharts();
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
        if (dj.ts == this.ts) {
          console.log("skip same data");
        } else {
          this.ts = dj.ts;
          console.log(moment(dj.ts).format('h:mm:ss'), Number(dj.temp));
          this.tempChart.get('tempChart').addPoint([dj.ts, Number(dj.temp)], true, true);
          this.humiChart.get('humiChart').addPoint([dj.ts, Number(dj.humi)], true, true);
          this.lightChart.get('lightChart').addPoint([dj.ts, Number(dj.light)], true, true);
          this.presChart.get('presChart').addPoint([dj.ts, Number(dj.pres)], true, true);
        }
      } else {
        console.error(url, status, err.toString());
      }
    });
  },

  getInitialState: function getInitialState() {
    return {
      tempChart: {},
      humiChart: {},
      data: {}
    };
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
              React.createElement("div", { id: this.props.canvasId, style: { "height": "180px" } })
            )
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(NeuriteSensor, null), document.getElementById('neuriteSensor'));

},{}]},{},[1]);
