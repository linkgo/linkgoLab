var WeahterStation = React.createClass({
  
  fetchData: function(key, location, count, callback) {
    var url = "/data";
    $.post(url,
      {
        "dataKey": key,
        "location": location,
        "count": count
      },
      callback.bind(this)
    );
  },

  createChart: function(labels, data) {
    var tempChartCanvas = document.getElementById("tempChart").getContext("2d");
    var dataSet = {
          labels: labels,
          datasets: [
              {
                  fillColor: "rgba(151,187,205,0.2)",
                  strokeColor: "rgba(151,187,205,1)",
                  pointColor: "rgba(151,187,205,1)",
                  pointStrokeColor: "#fff",
                  data: data
              }
          ]
    };

    var tempChart = new Chart(tempChartCanvas).Line(dataSet, {animationSteps: 15}); 
    this.setState({tempChart: tempChart});
  },

  initChart: function(location) {
    this.fetchData('weather', location, 6, function(res, status) {
      if (res.success) {
        var ts = [];
        var temp = [];
        res.data.map(function(d, i) {
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

  updateChart: function(location) {
    this.fetchData('weather', location, 1, function(res, status) {
      if (res.success) {
        var dj = JSON.parse(res.data[0]);
        console.log(Number(dj.TEMP_NOW), dj.ts);
        this.setState({data: dj});
        this.state.tempChart.addData([Number(dj.TEMP_NOW)], dj.ts);
        this.state.tempChart.removeData();
      } else {
        console.error(url, status, err.toString());
      }
    });
  },

  getInitialState: function() {
    return {data: {}};
  },

  componentDidMount: function() {
    setTimeout(this.initChart, 200, 'Shanghai');
    setInterval(this.updateChart, 5000, 'Shanghai');
  },

  render: function() {
    return (
      <div className="section content">
        <div className="row">
          <p>{JSON.stringify(this.state.data)}</p>
        </div>
        <div className="row">
          <div className="col-md-3 col-sm-6 col-xs-12">
            <InfoBox bgColor="bg-aqua" icon="ion ion-ios-gear-outline" infoName="CPU Traffic" infoStr="90" infoStrSuffix="%" />
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12">
          </div>

          <div className="clearfix visible-sm-block">
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12">
          </div>

          <div className="col-md-3 col-sm-6 col-xs-12">
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <ChartBox />
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
{/*
            <div className="btn-group">
              <button type="button" className="btn btn-box-tool dropdown-toggle" data-toggle="dropdown">
                <i className="fa fa-wrench"></i></button>
              <ul className="dropdown-menu" role="menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li className="divider"></li>
                <li><a href="#">Separated link</a></li>
              </ul>
            </div>
            <button type="button" className="btn btn-box-tool" data-widget="remove"><i className="fa fa-times"></i></button>
*/}
          </div>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-md-8">
              <p className="text-center">
                <strong>Temperature</strong>
              </p>

              <div className="chart">
                <canvas id="tempChart" style={{"height": "180px"}}></canvas>
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
  <WeahterStation pollInterval={1000}/>,
  document.getElementById('weatherStation')
);
