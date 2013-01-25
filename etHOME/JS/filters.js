var filters = angular.module('sduiFilters', [])

filters.filter('removeCurrent', function() {
  return function(input, current) {
	  var out = [];
	  for (var i = 0; i < input.length; i++) {
	    	if(i!=current)
	    		out.push( input[i] )
	  }
	  return out;
  };
});

filters.filter('average', function() {
	return function(input, minmax) {
		
		var out = [];
		var sum = 0;
		var i = minmax[0];
		for (i; i<minmax[1]; i++) {
			sum = sum + input[i];
		}
		i = minmax[1] - minmax[0]
		return sum/i;
  	};
});

filters.filter('max', function() {
	return function(input, minmax) {
		var max = 0;
		var i = minmax[0];
		for (i; i<minmax[1]; i++) {
			if(input[i]>max){
				max = input[i];
			}
		}
		return max;
  	};
});

filters.filter('unit', function() {
	return function(input, unit) {
		if(unit == '%'){
			console.log(input)
			input = (1-input)*100;
		}
		return input.toFixed(1)+ " " + unit
  	};
});

filters.filter('celcius', function() {
	return function(input, language) {
		if(language == 'zhongguo'){
			input = (input - 32)*5/9;
		}
		return input
  	};
});

filters.filter('sigfig', function() {
	return function(input, sigfig) {
		input = input;
		return input.toFixed(sigfig)
  	};
});

filters.filter('times', function() {
	return function(input, timezer) {
		return input* timezer
  	};
});

filters.filter('height', function() {
	return function(input) {
		return { height : input.toFixed(0)+'px'}
  	};
});