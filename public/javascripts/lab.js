var myChart

require.config({
    paths:{
      echarts: 'http://echarts.baidu.com/build/dist'
    }
});

require(
    [
      'echarts',
      'echarts/chart/line',
      'echarts/chart/bar'
    ],
    function(ec) {
        myChart = ec.init(document.getElementById('chart-temp'), 'macarons');
        myChart.setOption(option);
    }
);

var  option = {
    title : {
        text: '气温',
        subtext: 'real'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['最高气温','最低气温']
    },
    toolbox: {
        show : true,
        feature : {
            //mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            //restore : {show: true},
            //saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value} °C'
            }
        }
    ],
    series : [
        {
            name:'最高气温',
            type:'line',
            data:[],
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        },
        {
            name:'最低气温',
            type:'line',
            data:[],
            //markPoint : {
            //    data : [
            //        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
            //    ]
            //},
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name : '平均值'}
                ]
            }
        }
    ]
};

setInterval(refresh, 3000);

function refresh() {
    //console.log("refresh chart");
    //var url = "http://192.168.1.14:3008/data";
    var url = "http://localhost:3008/data";
    $.getJSON(url, {key: "/neuro/chatroom"}, function(data, status) {
        console.log($.parseJSON(data));
        option.xAxis[0].data.push("13:11");
        option.series[0].data.push(parseInt($.parseJSON(data).TEMP_NOW));
        //option.series[1].data.push(Math.floor(Math.random() *100 )/10 - 5);
        myChart.setOption(option);
    });
}

$(window).on('resize', function(){
        if(mChart != null && myChart != undefined){
            myChart.resize();
        }
    });
