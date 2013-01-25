var ClimateControl = function($scope, $routeParams, $http) {


	$http.get('data/climate.json').success(function(data) {
		$scope.climate = data
		
		var indoor,outdoor,heating,cooling;

        for(var i in $scope.climate.data){
            indoor = $scope.climate.data[i] * $scope.maxTemp;
            $scope.indoor.push( indoor );
            $scope.outdoor.push( indoor);
        }

        $scope.outdoor.reverse();


		for(var i in $scope.indoor){

            if($scope.indoor[i] < $scope.outdoor[i]){
                $scope.cooling[i] = $scope.outdoor[i] - $scope.indoor[i];
                $scope.heating[i] = 0;
                $scope.recycled[i] = $scope.cooling[i] * 0.35;
            }else{
                $scope.heating[i] = $scope.indoor[i] - $scope.outdoor[i];
                $scope.cooling[i] = 0;
                $scope.recycled[i] = $scope.heating[i] * 0.25;
            }
		}

		$scope.updateslider();
		$scope.chartgraphs();
	});

	$scope.indoor = [];
	$scope.outdoor = [];
	$scope.heating = [];
	$scope.cooling = [];
	$scope.recycled = []
    $scope.graph = [];
	$scope.currentThermostat = 0.5;
	$scope.maxTemp = 110;
}


sdui.directive( 'climateUi', function() {
    var climateLinkFn = function(scope, element, attrs, http) {


    	scope.chartgraphs = function(){

    		scope.detailIndoor = [];
            scope.detailOutdoor = [];
		    scope.detailStart = Date.UTC(2012, 7, 1);
    		scope.masterChart;
    		scope.detailChart;

	        masterChart = new Highcharts.Chart({
                chart: {
                    renderTo: 'climatechartmaster',
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
                    data: scope.indoor
                },{
                    type: 'area',
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: Date.UTC(2010, 0, 01),
                    data: scope.outdoor
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
		                renderTo: 'climatechartdetail',
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
		                min: (scope.maxTemp * .6),
	                    max: (scope.maxTemp * .85),
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
		                    var indoor = this.points[0];
                            var outdoor = this.points[1];
		                    return '<b>'+ scope.climate.text[4][scope.$parent.curLanguage] + '</b>' + " " + Highcharts.numberFormat(indoor.y, 2) +'°F<br/>'+
                                '<b>'+ scope.climate.text[5][scope.$parent.curLanguage] + '</b>' + " " + Highcharts.numberFormat(outdoor.y, 2) +'°F<br/>'+
		                        Highcharts.dateFormat('%e/%m/%y', this.x)
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

    	scope.updateslider = function(){
        	scope.thermostatslider = $( "#thermostatslider" );
        	scope.thermostatslider.slider({
				orientation: "vertical",
				range: "min",
				min: 0,
				max: 100,
				value: (scope.currentThermostat * scope.maxTemp),
				slide: function( event, ui ) {

			    }
          	});
        }


    };
    return{
      restrict: 'E',
      link: climateLinkFn,
      controller: ClimateControl
    }
})