var five = require("johnny-five"),
    board = new five.Board();
    
var dualShock = require('dualshock-controller');
var Omx = require('node-omxplayer');
var player;

board.on("ready", function() {

	// Johnny Five Configuration

	var motors = new five.Motors([
			five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD.M1,
			five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD.M2,
		]),
		leftMotor = motors[0],
      	rightMotor = motors[1];

	console.log('Mobot engaged and ready for world domination!');
	
	var left_x, left_y, right_x, right_y;
	var right_trigger, left_trigger;
	var l1 = 0;
	var r1 = 0;
  
  	var controller = dualShock(
	{
		config : "ds4",
		accelerometerSmoothing : true,
		analogStickSmoothing : false
	});
	
	
	// MOVEMENT CONTROL CODE
	
	controller.on('left:move', function(data) {
		left_x = data['x'];
		left_y = data['y'];
		
		roll_on();
	});
	
	var roll_on = function() { 
	
		if (l1 == 1) {
		
			if (left_y <= 128) {
				var speed = (128 - left_y) * 2;
				if (speed == 0) {
					motors[0].stop();
				} else {
					motors[0].fwd(get_speed(speed));
				}
			} else {
				var speed = (left_y - 128) * 2;
				motors[0].rev(get_speed(speed));
			}
			
			if (right_y <= 128) {
				var speed = (128 - right_y) * 2;
				if (speed == 0) {
					motors[1].stop();
				} else {
					motors[1].fwd(get_speed(speed));
				}
			} else {
				var speed = (right_y - 128) * 2;
				motors[1].rev(get_speed(speed));
			}
		
		} else {
	
			if (right_trigger > 0 || left_trigger > 0) {
				if (right_trigger > 0) {
					motors[0].fwd(get_speed(right_trigger));
					motors[1].rev(get_speed(right_trigger));
				} else {
					motors[0].rev(get_speed(left_trigger));
					motors[1].fwd(get_speed(left_trigger));			
				}
			
			} else {
				var right_scale = 1.0, left_scale = 1.0;

				if (left_x < 128) {
					left_scale = left_x / 128;
				} else if (left_x > 128){
					right_scale = 1 - (left_x - 128) / 128;		
				}
		
				if (right_y <= 128) {
					var speed = (128 - right_y) * 2;
					if (speed == 0) {
						motors.stop();
					} else {
						motors[0].fwd(get_speed(speed * left_scale));
						motors[1].fwd(get_speed(speed * right_scale));
					}
				} else {
					var speed = (right_y - 128) * 2;
					motors[0].rev(get_speed(speed * right_scale));
					motors[1].rev(get_speed(speed * left_scale));

				}
			}
		}
	}
	
	var get_speed = function(speed) {
		if (r1 == 1) {
			return speed * .5;
		} else {
			return speed;
		}	
		
	}
	
	controller.on('right:move', function(data) {
		right_x = data['x'];
		right_y = data['y'];	
		
		roll_on();	
	});
	
	controller.on('r2Analog:move', function(data) {
		right_trigger = data['x'];
		roll_on();
	});

	controller.on('l2Analog:move', function(data) {
		left_trigger = data['x'];
		roll_on();
	});
	
	controller.on('l1:press', function(data) {
		l1 = 1;
	});
	
	controller.on('l1:release', function(data) {
		l1 = 0;
	});
	
	controller.on('r1:press', function(data) {
		r1 = 1;
	});
	
	controller.on('r1:release', function(data) {
		r1 = 0;
	});
	
	
	// VIDEO CONTROL CODE
	
	var tvMovies = ['../mobot-videos/tv/ghostbusters.mp4',
					'../mobot-videos/tv/gijoe.mp4',
					'../mobot-videos/tv/he-man.mp4',
					'../mobot-videos/tv/inspectorgadget.mp4',
					'../mobot-videos/tv/thundercats.mp4',
					'../mobot-videos/tv/tmnt.mp4',
					'../mobot-videos/tv/transformers.mp4',
					'../mobot-videos/tv/voltron.mp4'];

	var musicMovies = ['../mobot-videos/music/bassnectar.mp4',
					   '../mobot-videos/music/robots.mp4']
	
	var selectedMovie = '../mobot-videos/kitty.mp4';
	
	var play_movie = function(movie) {
		// Create an instance of the player with the source. 
		if (player) {
			player.newSource(movie);
		} else {
			player = Omx(movie);
		}
	}
	
	controller.on('triangle:press', function(data) {
		play_movie('../mobot-videos/rick.mp4');
	});
	
	var rand = function(max) {
		return Math.floor(Math.random() * max);
	}
	
	controller.on('circle:press', function(data) {
		movie = musicMovies[rand(musicMovies.length)];
		console.log('Playing: ' + movie);	
		play_movie(movie);
	});
	
	controller.on('x:press', function(data) {
		movie = tvMovies[rand(tvMovies.length)];
		console.log('Playing: ' + movie);	
		play_movie(movie);
	});	
	
	controller.on('square:press', function(data) {
		// Create an instance of the player with the source. 
		if (player) {	
			if (player.running) {	
				player.quit();
			}
		}
	});
	
	
});