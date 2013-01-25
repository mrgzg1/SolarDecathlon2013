var sdui = angular.module('sdui', ['sduiFilters'])


sdui.directive( 'viewport', function() {
    var linkFn = function(scope, element, attrs, http) {

      var panes = document.getElementsByClassName('button')

      scope.changethelanguage = function(newLanguage){
        scope.curLanguage = newLanguage
        scope.chartgraphs()
      }

      scope.willthiswork = function(){
        scope.curTemplate = 'partials/tablet.html'
        scope.curPage = this.pane.index
      }

      scope.backtohome = function(){
        scope.curTemplate = 'partials/home.html';
        console.log(scope)
      }

      scope.chartgraphs = function() {
        var chart1; // globally available
        Highcharts.setOptions({
                global: {
                        useUTC: false
                }
        });

        var tempchart;
        tempchart = new Highcharts.Chart({
                colors: ["#FFF"],
                chart: {
                        renderTo: 'tempchart',
                        type: 'spline',
                        backgroundColor:'rgba(255, 255, 255, 0)',
                        marginRight: 10,
                        events: {
                                load: function() {

                                        // set up the updating of the chart each second
                                        var series = this.series[0];
                                        setInterval(function() {
                                                var x = (new Date()).getTime(), // current time
                                                    y = Math.random()*10+70
                                                series.addPoint([x, y], true, true);
                                        }, 5000);
                                }
                        }
                },
                title: {
                        text: '',
                        style: {
                            color: '#FFF',
                            font: '12px neou'
                         }
                },
                xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                },
                yAxis: {
                        title: {
                                text: scope.panes[0].graphx[0][scope.curLanguage],
                                style: {
                                    color: '#FFF',
                                    font: '8px neou'
                                }
                        },
                        min: 0,
                        max: 100,
                        gridLineWidth: 0,
                        lineColor: '#FF0000',
                        plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#FFF'
                        }]

                },
                tooltip: {
                        formatter: function() {
                                        return '<b>'+ this.series.name +'</b><br/>'+
                                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                                        Highcharts.numberFormat(this.y, 2);
                        }
                },
                legend: {
                        enabled: false
                },
                exporting: {
                        enabled: false
                },
                credits: {
                        enabled: false
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            },
                            fillOpacity:.75
                        }
                    }
                },
                series: [{
                        name: 'Current Temperature',
                        data: (function() {
                                // generate an array of random data
                                var data = [],
                                        time = (new Date()).getTime(),
                                        i;

                                for (i = -40; i <= 0; i++) {
                                        data.push({
                                                x: time + i * 50000,
                                                y: Math.random()*10+70
                                        });
                                }
                                return data;
                        })()
                }]
        });

        var solarchart;
        solarchart = new Highcharts.Chart({
                colors: ["#FFF"],
                chart: {
                        renderTo: 'solarchart',
                        type: 'spline',
                        backgroundColor:'rgba(255, 255, 255, 0)',
                        marginRight: 10,
                        events: {
                                load: function() {

                                        // set up the updating of the chart each second
                                        var series = this.series[0];
                                        setInterval(function() {
                                                var x = (new Date()).getTime(), // current time
                                                    y = Math.random()*10+70;
                                                series.addPoint([x, y], true, true);
                                        }, 5000);
                                }
                        }
                },
                title: {
                        text: '',
                        style: {
                            color: '#FFF',
                            font: '12px neou'
                         }
                },
                xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                },
                yAxis: {
                        title: {
                                text: scope.panes[5].graphx[0][scope.curLanguage],
                                style: {
                                    color: '#FFF',
                                    font: '8px neou'
                                }
                        },
                        min: 0,
                        max: 100,
                        gridLineWidth: 0,
                        lineColor: '#FF0000',
                        plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#FFF'
                        }]
                },
                tooltip: {
                        formatter: function() {
                                        return '<b>'+ this.series.name +'</b><br/>'+
                                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                                        Highcharts.numberFormat(this.y, 2);
                        }
                },
                legend: {
                        enabled: false
                },
                exporting: {
                        enabled: false
                },
                credits: {
                        enabled: false
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            },
                            fillOpacity:.75
                        }
                    }
                },
                series: [{
                        name: 'Solar Production',
                        data: (function() {
                                // generate an array of random data
                                var data = [],
                                        time = (new Date()).getTime(),
                                        i;

                                for (i = -40; i <= 0; i++) {
                                        data.push({
                                                x: time + i * 50000,
                                                y: Math.random()*10+70
                                        });
                                }
                                return data;
                        })()
                }]
        });

        var energychart;
        energychart = new Highcharts.Chart({
                colors: ["#FFF"],
                chart: {
                        renderTo: 'energychart',
                        type: 'area',
                        backgroundColor:'rgba(0, 0, 0, 0)',
                        events: {
                                load: function() {

                                        // set up the updating of the chart each second
                                        var series = this.series[0];
                                        setInterval(function() {
                                                var x = (new Date()).getTime(), // current time
                                                        y = Math.random()*100-50;
                                                series.addPoint([x, y], true, true);
                                        }, 5000);
                                }
                        }
                },
                title: {
                        text: '',
                        style: {
                            color: '#FFF',
                            font: '12px neou'
                         }
                },
                xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                },
                yAxis: {
                        title: {
                                text: scope.panes[6].graphx[0][scope.curLanguage],
                                style: {
                                    color: '#FFF',
                                    font: '8px neou'
                                }
                        },
                        gridLineWidth: 0,
                        gridLineColor: '#FF0000',
                        plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#FFF'
                        }]
                },
                tooltip: {
                        formatter: function() {
                                        return '<b>'+ this.series.name +'</b><br/>'+
                                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                                        Highcharts.numberFormat(this.y, 2);
                        }
                },
                legend: {
                        enabled: false
                },
                exporting: {
                        enabled: false
                },
                credits: {
                        enabled: false
                },
                plotOptions: {
                    area: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            },
                            fillOpacity:.75
                        }
                    }
                },
                series: [{
                        name: 'Net Production',
                        data: (function() {
                                // generate an array of random data
                                var data = [],
                                        time = (new Date()).getTime(),
                                        i;

                                for (i = -400; i <= 0; i++) {
                                        data.push({
                                                x: time + i * 5000,
                                                y: Math.random()*100-50
                                        });
                                }
                                return data;
                        })()
                }]
        });
    }

    };
    return{
      restrict: 'E',
      link: linkFn,
      template: '<div ng-include="curTemplate"></div>',
      controller: HomeControl
    }
})


sdui.directive( 'settingsUi', function() {
    var settingslinkFn = function(scope, element, attrs, http) {
        console.log("settings")
        console.log(scope)

    };
    return{
      restrict: 'E',
      link: settingslinkFn
    }
})













