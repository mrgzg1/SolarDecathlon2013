var WaterControl = function($scope, $routeParams, $http) {


	$http.get('data/water.json').success(function(data) {
		$scope.water = data
		
		var consumption,recycled,flushed,used;

		for(var i in $scope.water.data){
			consumption = $scope.water.data[i] * $scope.tankCapacity;
			recycled = $scope.water.data[i] * consumption;
			flushed = $scope.water.data[i] * recycled;
			used = recycled -flushed;

			$scope.consumption.push( consumption );
			$scope.recycled.push( recycled );
			$scope.flushed.push( flushed );
			$scope.used.push( used );
		}

		$scope.updateslider();
		$scope.chartgraphs();
	});

	$scope.consumption = [];
	$scope.recycled = [];
	$scope.flushed = [];
	$scope.used = [];
	$scope.graph = [];
	$scope.currentTankLevel = 0.5;
	$scope.tankCapacity = 120;
}


sdui.directive( 'waterUi', function() {
    var waterLinkFn = function(scope, element, attrs, http) {



    	scope.chartgraphs = function(){

    		scope.detailData = [],
		    scope.detailStart = Date.UTC(2012, 7, 1);
    		scope.masterChart;
    		scope.detailChart;

	        masterChart = new Highcharts.Chart({
                chart: {
                    renderTo: 'waterchartmaster',
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

                            scope.detailData = [],
    
                            // reverse engineer the last part of the data
                            jQuery.each(this.series[0].data, function(i, point) {
                                if (point.x > min && point.x < max) {
                                    scope.detailData.push({
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
    
    
                            scope.detailChart.series[0].setData(scope.detailData);
    						
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
                    name: 'USD to EUR',
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: Date.UTC(2010, 0, 01),
                    data: scope.consumption
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
		                scope.detailData.push({
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
		                renderTo: 'waterchartdetail',
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
		                min: (scope.tankCapacity * .6),
	                    max: (scope.tankCapacity * .85),
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
		                    var point = this.points[0];
		                    return '<b>'+ scope.water.text[10][scope.$parent.curLanguage] +'</b><br/>'+
		                        Highcharts.dateFormat('%e/%m/%y', this.x) + ':<br/>'+
		                       	Highcharts.numberFormat(point.y, 2) + " " + scope.water.text[9][scope.$parent.curLanguage];
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
		                data: scope.detailData
		            }],

		            exporting: {
		                enabled: false
		            }

		        });
		    }
    	}

    	scope.updateslider = function(){
        	scope.tankslider = $( "#tankslider" );
        	scope.tankslider.slider({
				orientation: "vertical",
				range: "min",
				min: 0,
				max: 100,
				value: (scope.currentTankLevel * scope.tankCapacity),
				slide: function( event, ui ) {

			    }
          	});
        }

        scope.flushThatShit = function(){
        	scope.currentTankLevel = 0;
        	scope.updateslider();
        }

        $('#theflusher').bind('click', function() {
			scope.flushThatShit();
		});


    };
    return{
      restrict: 'E',
      link: waterLinkFn,
      controller: WaterControl
    }
})