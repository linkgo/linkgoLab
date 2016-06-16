var NeuriteSensor = React.createClass({
  
  fetchDataTemp: function(key, count, callback) {
    var url = "/data";
    $.post(url,
      {
        "dataKey": key,
        "count": count
      },
      callback.bind(this)
    );
  },

  createChart: function(id, data, title, yTitle) {
  $([id]).highcharts({
      chart: {
          type: 'spline',
          animation: Highcharts.svg, // don't animate in old IE
      },
      title: {
          text: title
      },
      xAxis: {
          type: 'datetime',
          //tickPixelInterval: 150
          //categories: 
      },
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
      legend: {
          enabled: false
      },
      exporting: {
          enabled: true
      },
      series: [{
          id: id,
          name: 'tempreature',
          data: data
      }]
  });
  },

  initChart: function() {
    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });
    this.fetchDataTemp('office', 10, function(res, status) {
      if (res.success) {
        var ts;
        var tempData = [];
        var humiData = [];
        var lightData = [];
        var presData = [];

        res.data.reverse().map(function(d, i) {
          var dj = JSON.parse(d);
          ts = dj.ts;
          //var ts = moment(dj.ts).format('h:mm:ss');
          tempData.push({x: ts, y: Number(dj.temp)});
          humiData.push({x: ts, y: Number(dj.humi)});
          lightData.push({x: ts, y: Number(dj.light)});
          presData.push({x: ts, y: Number(dj.pres)});
        });

        this.ts = ts;
        this.createChart('tempChart', tempData, 'Temperature', '℃');
        this.tempChart = $('#tempChart').highcharts();
        this.createChart('humiChart', humiData, 'Humidity', '%');
        this.humiChart = $('#humiChart').highcharts();
        this.createChart('lightChart', lightData, 'Light', 'lux');
        this.lightChart = $('#lightChart').highcharts();
        this.createChart('presChart', presData, 'Pressure', 'hPa');
        this.presChart = $('#presChart').highcharts();
      } else {
        console.error(url, status, err.toString());
      }
    });
  },

  updateChart: function() {
    this.fetchDataTemp('office', 1, function(res, status) {
      if (res.success) {
        var dj = JSON.parse(res.data[0]);
        this.setState({data: dj});
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

  getInitialState: function() {
    return {
      tempChart: {},
      humiChart: {},
      data: {}
    };
  },

  componentDidMount: function() {
    setTimeout(this.initChart, 200);
    setInterval(this.updateChart, 5000);
  },

  render: function() {
    return (
      <div className="section content">
{/*
        <div className="row">
          <p>{JSON.stringify(this.state.data)}</p>
        </div>
*/}
        <div className="row">
          <div className="col-md-3 col-sm-6 col-xs-12">
            <InfoBox bgColor="bg-aqua" icon="ion ion-thermometer" infoName="Temperature" infoStr={this.state.data.temp} infoStrSuffix=" ℃" />
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12">
            <InfoBox bgColor="bg-green" icon="ion ion-waterdrop" infoName="Humidity" infoStr={this.state.data.humi} infoStrSuffix=" %" />
          </div>

          <div className="clearfix visible-sm-block">
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12">
            <InfoBox bgColor="bg-maroon" icon="fa fa-sun-o" infoName="Light" infoStr={this.state.data.light} infoStrSuffix=" lux" />
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12">
            <InfoBox bgColor="bg-yellow" icon="fa fa-rocket" infoName="Pressure" infoStr={this.state.data.pres} infoStrSuffix=" hPa" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <ChartBox chartTitle="Temperature" canvasId="tempChart" />
          </div>

          <div className="col-md-6">
            <ChartBox chartTitle="Humidity" canvasId="humiChart" />
          </div>

          <div className="col-md-6">
            <ChartBox chartTitle="Light" canvasId="lightChart" />
          </div>

          <div className="col-md-6">
            <ChartBox chartTitle="Pressure" canvasId="presChart" />
          </div>
        </div>

      </div>
    );
  }
});

var InfoBox = React.createClass({
  render: function() {
    return (
      <div className="info-box">
        <span className={"info-box-icon " + this.props.bgColor}><i className={this.props.icon}></i></span>
        <div className="info-box-content">
          <span className="info-box-text">{this.props.infoName}</span>
          <span className="info-box-number">{this.props.infoStr}<small>{this.props.infoStrSuffix}</small></span>
        </div>
      </div>
    );
  }
});

var ChartBox = React.createClass({
  render: function() {
    return (
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">History Report</h3>
          <div className="box-tools pull-right">
            <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i>
            </button>
          </div>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-md-12">
{/*
              <p className="text-center">
                <strong>{this.props.chartTitle}</strong>
              </p>
*/}

              <div className="chart">
                <div id={this.props.canvasId} style={{"height": "180px"}}></div>
              </div>
            </div>
{/*
            <div className="col-md-4">
              <p className="text-center">
                <strong>Statistics</strong>
              </p>

              <div className="progress-group">
                <span className="progress-text">Add Products to Cart</span>
                <span className="progress-number"><b>160</b>/200</span>

                <div className="progress sm">
                  <div className="progress-bar progress-bar-aqua" style={{"width": "80%"}}></div>
                </div>
              </div>
              <div className="progress-group">
                <span className="progress-text">Complete Purchase</span>
                <span className="progress-number"><b>310</b>/400</span>

                <div className="progress sm">
                  <div className="progress-bar progress-bar-red" style={{"width": "80%"}}></div>
                </div>
              </div>
              <div className="progress-group">
                <span className="progress-text">Visit Premium Page</span>
                <span className="progress-number"><b>480</b>/800</span>

                <div className="progress sm">
                  <div className="progress-bar progress-bar-green" style={{"width": "80%"}}></div>
                </div>
              </div>
              <div className="progress-group">
                <span className="progress-text">Send Inquiries</span>
                <span className="progress-number"><b>250</b>/500</span>

                <div className="progress sm">
                  <div className="progress-bar progress-bar-yellow" style={{"width": "80%"}}></div>
                </div>
              </div>
            </div>
*/}

          </div>
        </div>

{/*
        <div className="box-footer">
          <div className="row">
            <div className="col-sm-3 col-xs-6">
              <div className="description-block border-right">
                <span className="description-percentage text-green"><i className="fa fa-caret-up"></i> 17%</span>
                <h5 className="description-header">$35,210.43</h5>
                <span className="description-text">TOTAL REVENUE</span>
              </div>
            </div>
            <div className="col-sm-3 col-xs-6">
              <div className="description-block border-right">
                <span className="description-percentage text-yellow"><i className="fa fa-caret-left"></i> 0%</span>
                <h5 className="description-header">$10,390.90</h5>
                <span className="description-text">TOTAL COST</span>
              </div>
            </div>
            <div className="col-sm-3 col-xs-6">
              <div className="description-block border-right">
                <span className="description-percentage text-green"><i className="fa fa-caret-up"></i> 20%</span>
                <h5 className="description-header">$24,813.53</h5>
                <span className="description-text">TOTAL PROFIT</span>
              </div>
            </div>
            <div className="col-sm-3 col-xs-6">
              <div className="description-block">
                <span className="description-percentage text-red"><i className="fa fa-caret-down"></i> 18%</span>
                <h5 className="description-header">1200</h5>
                <span className="description-text">GOAL COMPLETIONS</span>
              </div>
            </div>
          </div>
        </div>
*/}
      </div>
    );
  }
});

ReactDOM.render(
  <NeuriteSensor />,
  document.getElementById('neuriteSensor')
);
