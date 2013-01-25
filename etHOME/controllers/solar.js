var SolarControl = function($scope, $routeParams, $http) {


    $http.get('data/solar.json').success(function(data) {
        $scope.solar = data
        
        var solarPower, pvPower, insolation, effeciency;

        for(var i in $scope.solar.data){
            solarPower = $scope.solar.data[i] * $scope.maxPower;
            pvPower = (1-$scope.solar.data[i]) * solarPower 
            insolation = $scope.solar.data[i] * $scope.maxInsolation;
            effeciency = pvPower/solarPower;

            $scope.solarPower.push( solarPower );
            $scope.pvPower.push( pvPower);
            $scope.solarEnergy.push( solarPower * $scope.kwtokj );
            $scope.pvEnergy.push( pvPower * $scope.kwtokj );
            $scope.insolation.push( insolation )
            $scope.effeciency.push( effeciency )
        }

        $scope.chartgraphs();
    });

    $scope.solarPower = [];
    $scope.pvPower = [];
    $scope.solarEnergy = [];
    $scope.pvEnergy = [];
    $scope.insolation = [];
    $scope.effeciency = [];
    $scope.graph = [];
    $scope.kwtokj = 24;
    $scope.maxPower = 60;
    $scope.maxInsolation = 25;
}


sdui.directive( 'solarUi', function() {
    var solarLinkFn = function(scope, element, attrs, http) {


        scope.chartgraphs = function(){

            scope.detailIndoor = [];
            scope.detailOutdoor = [];
            scope.detailStart = Date.UTC(2012, 7, 1);
            scope.masterChart;
            scope.detailChart;

            masterChart = new Highcharts.Chart({
                chart: {
                    renderTo: 'solarchartmaster',
                    reflow: false,
                    borderWidth: 0,
                    backgroundColor: null,
                    marginLeft: 50,
                    marginRight: 20,
                    zoomType: 'x',
                    events: {
    
                        // listen to the selection event on the master chart to update the
                        // extremes of the detail chart
                        selection: function(event) {
                            var extremesObject = event.xAxis[0],
                                min = extremesObject.min,
                                max = extremesObject.max,
                                xAxis = this.xAxis[0];

                            scope.detailIndoor = [],
                            scope.detailOutdoor = [],
    
                            // reverse engineer the last part of the data
                            jQuery.each(this.series[0].data, function(i, point) {
                                if (point.x > min && point.x < max) {
                                    scope.detailIndoor.push({
                                        x: point.x,
                                        y: point.y
                                    });
                                    scope.graph[1] = i;
                                }else if(point.x < min){
                                    scope.graph[0] = i;
                                }
                            });

                            jQuery.each(this.series[1].data, function(i, point) {
                                if (point.x > min && point.x < max) {
                                    scope.detailOutdoor.push({
                                        x: point.x,
                                        y: point.y
                                    });
                                    scope.graph[1] = i;
                                }else if(point.x < min){
                                    scope.graph[0] = i;
                                }
                            });
                                
                            // move the plot bands to reflect the new detail span
                            xAxis.removePlotBand('mask-before');
                            xAxis.addPlotBand({
                                id: 'mask-before',
                                from: Date.UTC(2010, 0, 1),
                                to: min,
                                color: 'rgba(0, 0, 0, 0.2)'
                            });
    
                            xAxis.removePlotBand('mask-after');
                            xAxis.addPlotBand({
                                id: 'mask-after',
                                from: max,
                                to: Date.UTC(20011, 11, 31),
                                color: 'rgba(0, 0, 0, 0.2)'
                            });
    
    
                            scope.detailChart.series[0].setData(scope.detailIndoor);
                            scope.detailChart.series[1].setData(scope.detailOutdoor);

                            scope.$digest();

                            return false;
                        }
                    }
                },
                title: {
                    text: null
                },
                xAxis: {
                    type: 'datetime',
                    showLastTickLabel: true,
                    maxZoom: 14 * 24 * 3600000, // fourteen days
                    plotBands: [{
                        id: 'mask-before',
                        from: Date.UTC(2010, 0, 1),
                        to: Date.UTC(2012, 7, 1),
                        color: 'rgba(0, 0, 0, 0.2)'
                    }],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    gridLineWidth: 0,
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    min: 0.6,
                    showFirstLabel: false
                },
                tooltip: {
                    formatter: function() {
                        return false;
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        fillColor: {
                            linearGradient: [0, 0, 0, 70],
                            stops: [
                                [0, '#4572A7'],
                                [1, 'rgba(0,0,0,0)']
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: false
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    type: 'area',
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: Date.UTC(2010, 0, 01),
                    data: scope.pvPower
                },{
                    type: 'area',
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: Date.UTC(2010, 0, 01),
                    data: scope.solarPower
                }],
                exporting: {
                    enabled: false
                }
    
            }, function(masterChart) {
                createDetail(masterChart)
            });
    
            // create the detail chart
            function createDetail(masterChart) {
                


                jQuery.each(masterChart.series[0].data, function(i, point) {
                    if (point.x >= scope.detailStart) {
                        scope.detailIndoor.push({
                            x: point.x,
                            y: point.y
                        });
                        scope.graph[1] = i;
                    }else if(point.x < scope.detailStart){
                        scope.graph[0] = i;
                    }
                });

                jQuery.each(masterChart.series[1].data, function(i, point) {
                    if (point.x >= scope.detailStart) {
                        scope.detailOutdoor.push({
                            x: point.x,
                            y: point.y
                        });
                        scope.graph[1] = i;
                    }else if(point.x < scope.detailStart){
                        scope.graph[0] = i;
                    }
                });

                // create a detail chart referenced by a global variable
                scope.detailChart = new Highcharts.Chart({
                    colors: ["#FFF"],
                    chart: {
                        renderTo: 'solarchartdetail',
                        backgroundColor:'rgba(255, 255, 255, 0)',
                        reflow: false,
                        marginLeft: 50,
                        marginRight: 20,
                        style: {
                            position: 'absolute'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: '',
                        style: {
                            color: '#FFF',
                            font: '12px neou'
                         }
                    },
                    xAxis: {
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
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
                            var pvPower = this.points[0];
                            var solarPower = this.points[1];
                            return '<b style ="{\"color: \"red\" }">'+ scope.solar.text[17][scope.$parent.curLanguage] + '</b>' + " " + Highcharts.numberFormat(solarPower.y, 2) +'kJ<br/>'+
                                '<b>'+ scope.solar.text[15][scope.$parent.curLanguage] + '</b>' + " " + Highcharts.numberFormat(pvPower.y, 2) +'kJ<br/>'+
                                Highcharts.dateFormat('%e/%m/%y', this.x)
                        },
                        style: {
                        },
                        shared: true
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false,
                                states: {
                                    hover: {
                                        enabled: true,
                                        radius: 3
                                    }
                                }
                            }
                        }
                    },
                    series: [{
                        pointStart: scope.detailStart,
                        pointInterval: 24 * 3600 * 1000,
                        data: scope.detailIndoor
                    },{
                        pointStart: scope.detailStart,
                        pointInterval: 24 * 3600 * 1000,
                        data: scope.detailOutdoor
                    }],
                    exporting: {
                        enabled: false
                    }

                });
            }
        }


    };
    return{
      restrict: 'E',
      link: solarLinkFn,
      controller: SolarControl
    }
})