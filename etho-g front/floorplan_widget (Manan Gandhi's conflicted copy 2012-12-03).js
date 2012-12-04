console.log("HELLO");

var floorplan = {
	init:function(){
		//this.drawFloorPlan();
		this.drawFloorPlan1();
	},
	drawFloorPlan1:function(){
		var  paper = new Raphael(document.getElementById("holder"), 465, 730); 

		var scale_x = scale_y = 100; //change this to scale the plan
		var disp_x = disp_y = 10;
		var outerWalls = paper.path('M '+(0*scale_x+disp_x)+' '+(0*scale_y+disp_y)+' \
			L '+(0*scale_x+disp_x)+' '+(1*scale_y+disp_y)+' \
			L '+(1*scale_x+disp_x)+' '+(1*scale_y+disp_y)+' \
			L '+(1*scale_x+disp_x)+' '+(0*scale_y+disp_y)+' \
			L '+(0*scale_x+disp_x)+' '+(0*scale_y+disp_y));
		/*var outerWalls =   paper.path('\
			M 185 27 L 185 179 \
                        L 220 179 L 220 176 \
                        L 200 176 L 200 27  \
                        L 185 27 \
                        \
                        M 185 42 L 75 42 \
                        L 75 26 L 185 26 \
                        L 185 42\
                        \
                        M 75 32 L 28 32 \
                        L 28 26 L 75 26 \
                        L 75 32\
                        \
                        M 75 39 L 39 39 \
                        L 39 37 L 75 37 \
                        L 75 39\
                        \
                        M 28 32 L 32 32 \
                        L 32  283 L 28 283 \
                        L 28 32 \
                        \
                        M 39 32 L 41 32 \
                        L 41  283 L 39 283 \
                        L 39 32 \
                        \
                        M 39 350 L 41 350 \
                        L 41  423 L 39 423 \
                        L 39 350 \
                        \
                        M 28 283 L 200 283 \
                        L 200 290 L 28 290 \
                        L 28 283 \
                        \
                        M 28 290 L 42 290 \
                        L 42  350 L 28 350 \
                        L 28 290 \
                        \
                        M 28 350 L 32 350 \
                        L 32  423 L 28 423 \
                        L 28 350 \
                        \
                        M 28 423 L 42 423 \
                        L 42  498 L 28 498 \
                        L 28 423 \
                        \
                        M 155 290 L 155 384 \
                        L 165 384 L 165 290 \
                        L 155 290 \
                        \
                        M 42 498 L 114 498 \
                	L 114 484 L 42 484 \
                        L 42 498 \
                        \
                        M 114 498 L 150 498 \
                	L 150 494 L 114 494 \
                        L 114 498 \
                        \
                        M 150 498 L 185 498 \
                	L 185 484 L 150 484 \
                        L 150 498 \
                        \
                        M 200 290 L 200 300 \
                        L 190 300 L 190 290 \
                        L 200 290 \
                        \
                  	M 165 375 L 200 375 \
                        L 200 365 L 165 365 \
                        L 165 375 \
                        \
                  	M 200 355 L 200 365 \
                        L 190 365 L 190 355 \
                        L 200 355 \
                        \
                  	M 155 415 L 155 425 \
                        L 165 425 L 165 415 \
                        L 155 415 \
                        \
            		M 155 425 L 200 425 \
                        L 200 431 L 155 431 \
                        L 155 425 \
                        \
            		M 155 425 L 325 425 \
                        L 325 426 L 155 426 \
                        L 155 425 \
                        \
            		M 155 432 L 320 432 \
                        L 320 433 L 155 433 \
                        L 155 432 \
                        \
      			M 185 431 L 200 431 \
                        L 200 434 L 185 434 \
                        L 185 431 \
                        \
            		M 199 430 L 199 477 \
                        L 197 477 L 197 430 \
                        L 199 430 \
			\
      			M 210 477 L 210 548 \
                        L 185 548 L 185 477 \
                        L 210 477 \
			\
			M 319 432 L 340 432 \
                        L 340 520 L 319 520 \
                        L 319 432 \
                        \
			M 325 425 L 344 425 \
                        L 344 432 L 325 432 \
                        L 325 425 \
                        \
 			M 325 520 L 325 561 \
                        L 327 561 L 327 520 \
                        L 325 520 \
			\
			M 325 561 L 325 579 \
                        L 340 579 L 340 561 \
                        L 325 561 \
			\
			M 340 566 L 340 581 \
                        L 374 581 L 374 566 \
                        L 340 566 \
			\
			M 374 578 L 374 581 \
                        L 410 581 L 410 578 \
                        L 374 578 \
			\
			M 410 566 L 410 581 \
                        L 482 581 L 482 566 \
                        L 410 566 \
			\
			M 482 425 L 482 581 \
                        L 499 581 L 499 425 \
                        L 482 425 \
			\
			M 374 425 L 374 432 \
                        L 482 432 L 482 425 \
                        L 374 425 \
			\
			M 381 419 L 381 425 \
                        L 388 425 L 388 419 \
                        L 381 419 \
			\
			M 482 425 L 482 310 \
                        L 499 310 L 499 425 \
                        L 482 425 \
			\
			M 388 310 L 388 316 \
                        L 482 316 L 482 310 \
                        L 388 310 \
			\
			M 380 284 L 380 389 \
                        L 388 389 L 388 284 \
                        L 380 284 \
			\
			M 372 284 L 372 291 \
                        L 380 291 L 380 284 \
                        L 372 284 \
			\
			M 372 366 L 372 373 \
                        L 380 373 L 380 366 \
                        L 372 366 \
			\
			M 325 284 L 325 389 \
                        L 333 389 L 333 284 \
                        L 325 284 \
			\
			M 333 367 L 333 373 \
                        L 342 373 L 342 367 \
                        L 333 367 \
			\
			M 333 334 L 333 341 \
                        L 380 341 L 380 334 \
                        L 333 334 \
			\
			M 333 284 L 333 291 \
                        L 342 291 L 342 284 \
                        L 333 284 \
			\
			M 482 109 L 482 310 \
                        L 499 310 L 499 109 \
                        L 482 109 \
			\
			M 432 109 L 432 124 \
                        L 482 124 L 482 109 \
                        L 432 109 \
			\
			M 395 110 L 395 123 \
                        L 432 123 L 432 110 \
                        L 395 110 \
			\
			M 341 109 L 341 124 \
                        L 395 124 L 395 109 \
                        L 341 109 \
			\
			M 319 61 L 319 179 \
                        L 341 179 L 341 61 \
                        L 319 61 \
			\
			M 302 176 L 302 179 \
                        L 319 179 L 319 176 \
                        L 302 176 \
			\
			M 220 176 L 220 177 \
                        L 302 177 L 302 176 \
                        L 220 176 \
			\
			M 220 178 L 220 179 \
                        L 302 179 L 302 178 \
                        L 220 178 \
			\
			').attr({fill:'45-#1a1a1a-#333:25-#555:50-#333:75-#1a1a1a','fill-opacity':'1', 'stroke':'#d9d9d9','stroke-width':'2','stroke-opacity':'0.4'});
		*/
	
	} ,
	drawFloorPlan:function() {
		var  paper = new Raphael(document.getElementById("holder"), 465, 730); 
	 
	 	/**
	 	 * Declare the room shapes and define the shape
	 	 */
		var office =  paper.rect(7.649,420.289,234.119,186.509).attr({"fill": "#3E3E3E", "stroke": "#000000", "stroke-width": 0, "opacity": 0.4, 'stroke-opacity':'0'});
		var bathroom =  paper.rect(353.063,362.191,105.048,159.005).attr({"fill": "#3E3E3E", "stroke": "#000000", "stroke-width": 0, "opacity": 0.4, 'stroke-opacity':'0'});
		var livingroom = paper.path('M 241.8 128.9 L 230.2 128.9 L 230.2 8.9 L 7.6 8.9 L 7.6 128.9 L 7.6 420.3 L 241.8 420.3 L 241.8 128.9').attr({"fill": "#3E3E3E", "stroke": "#000000", "stroke-width": 0, "opacity": 0.4, 'stroke-opacity':'0'}); 
		var bedroom = paper.rect(241.769,521.196,216.343,204.668).attr({"fill": "#3E3E3E", "stroke": "#000000", "stroke-width": 0, "opacity": 0.4, 'stroke-opacity':'0'});
		var hall =  paper.rect(241.155,361.281,112.799,159.916).attr({"fill": "#3E3E3E", "stroke": "#000000", "stroke-width": 0, "opacity": 0.4, 'stroke-opacity':'0'});
		var kitchen =  paper.rect(241.155,128.944,216.956,233.247).attr({"fill": "#3E3E3E", "stroke": "#000000", "stroke-width": 0, "opacity": 0.4, 'stroke-opacity':'0'});
		/**
	 	* Declare the outside shapes which will not be clickable
	 	*/
		var outerDoors = paper.path('M 241.8 128.9 L 241.2 128.9 L 230.2 128.9 L 230.2 8.9 L 7.6 8.9 L 7.6 128.9 L 7.6 420.3 L 7.6 606.8 L 241.8 606.8 L 241.8 725.9 L 458.1 725.9 L 458.1 521.2 L 458.1 362.2 L 458.1 128.9 L 241.8 128.9').attr({'fill':'none','stroke':'#cccccc','stroke-width':'2','fill-opacity':'1','stroke-opacity':'0.4'}); 
		var innerDoors = paper.path('M 241.8 431.7 L 241.8 521.2 L 353.1 521.2 L 353.1 447.9').attr({'fill':'none','stroke':'#cccccc','stroke-width':'2','fill-opacity':'0','stroke-opacity':'0.4'}); 
		var outerWalls =   paper.path('M 238.4 620.6 L 238.4 610.3 L 11.1 610.3 L 7.6 610.3 L 4.2 610.3 L 4.2 395.8 L 11.1 395.8 L 11.1 416.8 L 238.4 416.8 L 238.4 357.6 L 245.4 357.6 L 245.4 441.8 L 238.4 441.8 L 238.4 423.8 L 11.1 423.8 L 11.1 603.3 L 238.4 603.3 L 238.4 493 L 245.4 493 L 245.4 517.7 L 254.2 517.7 L 254.2 524.7 L 245.4 524.7 L 245.4 620.6 L 238.4 620.6 M 226.1 12.4 L 226.1 132 L 229.6 132 L 233.1 132 L 254.2 132 L 254.2 125 L 233.1 125 L 233.1 5.4 L 229.6 5.4 L 226.1 5.4 L 11.1 5.4 L 7.6 5.4 L 4.2 5.4 L 4.2 344.6 L 11.1 344.6 L 11.1 12.4 L 226.1 12.4 M 461.6 125 L 454.8 125 L 454.8 125 L 305.9 125 L 305.9 132 L 454.6 132 L 454.6 357.8 L 305.9 357.8 L 305.9 364.8 L 349.8 364.8 L 349.8 460.4 L 356.8 460.4 L 356.8 364.8 L 454.6 364.8 L 454.6 517.7 L 356.8 517.7 L 356.8 511.4 L 349.8 511.4 L 349.8 517.7 L 305.9 517.7 L 305.9 524.7 L 454.6 524.7 L 454.6 722.4 L 245.8 722.4 L 245.8 671 L 238.8 671 L 238.8 729.4 L 241.2 729.4 L 245.8 729.4 L 454.6 729.4 L 454.8 729.4 L 461.6 729.4 L 461.6 125').attr({fill:'45-#1a1a1a-#333:25-#555:50-#333:75-#1a1a1a','fill-opacity':'1', 'stroke':'#d9d9d9','stroke-width':'2','stroke-opacity':'0.4'});

		/**
		 * Push the rooms into an array in order to assign events to all of them at once
		 */
		var rooms = paper.set();
		rooms.push(
			kitchen,
			livingroom,
			hall,
			office,
			bathroom,
			bedroom
		);
		/**
		 * Give each room an identifier so we can decide which one has been selected and display it
		 */
		kitchen.key = "Kitchen";
		livingroom.key = "Living Room";
		hall.key = "Hallway";
		office.key = "Office";
		bathroom.key = "Bathroom";
		bedroom.key = "Bedroom";
		
		/**
		 * Assign handlers to the room objects to update the gui accordingly
		 * Add Logic to update the statistics data and chart data via ajax.
		 * @param {Object} event
		 */
		rooms.mouseover(function (event) {
		    this.attr({"opacity": 1});
		});
		rooms.mouseout(function (event) {
		    this.attr({"opacity": 0.4});
		});
		rooms.click(function (event) {
		    document.getElementById("space").innerHTML = "<h3>"+this.key+"</h3>";
			Cufon.replace('h3', { fontFamily: 'Thin' }); // Font Replacement: update the replacement at every refresh
			$('.device').removeClass('deviceSelected');
			$('.lightSwitch').addClass('inactive');
		});
		
	}

};

//Load sequence for the floor plan
//when transitionting to module mode call the function below to init the app
window.onload = function(){
	floorplan.init();
}