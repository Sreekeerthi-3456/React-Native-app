import React, {useRef, useEffect} from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';

const KlineChart = ({klineData, onCandleClick, webViewRef}) => {
  useEffect(() => {
    if (webViewRef.current && klineData.length > 0) {
      webViewRef.current.postMessage(JSON.stringify(klineData));
    }
  }, [klineData]);

  const initialContent = `<!DOCTYPE HTML>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
  <script type="text/javascript">
    window.onload = function () {
      var options = {
        chart: {
          type: 'candlestick',
          height: 350,
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 100
            }
          },
          toolbar: {
            show: false,
            autoSelected: 'pan',
            tools: {
              download: false,
              selection: false,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true
            }
          },
          events: {
            dataPointSelection: function(event, chartContext, config) {
              var data = config.w.config.series[config.seriesIndex].data[config.dataPointIndex];
              window.ReactNativeWebView.postMessage(JSON.stringify({
                o: data.y[0],
                h: data.y[1],
                l: data.y[2],
                c: data.y[3]
              }));
            }
          }
        },
        series: [{
          name: 'candle',
          data: []
        }],
        noData: {
          text: 'Loading...'
        },
        xaxis: {
          type: 'datetime',
          tooltip: {
            enabled: true
          },
          tickPlacement: 'on',
          labels: {
            style: {
              fontSize: '12px'
            },
            datetimeUTC: false, 
          }
        },
        yaxis: {
          tooltip: {
            enabled: true
          },
          opposite: true,
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: '#00FF00',
              downward: '#FF0000'
            },
            wick: {
              useFillColor: true,
            },
          }
        },
        stroke: {
          width: 1,
          colors: ['#00FF00', '#FF0000']
        },
        tooltip: {
          enabled: true,
          x: {
            show: true,
            format: 'dd MMM HH:mm'
          },
          y: {
            formatter: function(value) {
              return value.toFixed(2);
            }
          }
        }
      };
      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();

      document.addEventListener("message", function(event) {
        var newData = JSON.parse(event.data);
        chart.updateSeries([{ data: newData }], true);
      });
    }
  </script>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    #chart {
      max-height: 350px;
    }
  </style>
</head>
<body>
  <div id="chart" style="height:100%"></div>
</body>
</html>
`;

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={{height: 350}}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{width: screenWidth * 2}}>
        <WebView
          ref={webViewRef}
          source={{html: initialContent}}
          onMessage={event => {
            const candleData = JSON.parse(event.nativeEvent.data);
            if (onCandleClick) {
              onCandleClick(candleData);
            }
          }}
          style={{width: screenWidth * 2}}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

export default KlineChart;
