// Import libraries
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Import configuration file
const config = require('../configurations/config');

router.use(bodyParser.json());

let HOSTNAME = '192.168.1.110',
    PORT = 8999,
    USERNAME = 'admin',
    PASSWORD = '',
    STOP_DELAY_MS = 500;

let Cam = require('../lib/onvif').Cam;
let keypress = require('keypress');

module.exports.recalibrateCamera = (req, res) => {

    new Cam({
        hostname : HOSTNAME,
        username : USERNAME,
        password : PASSWORD,
        port : PORT,
        timeout : 10000
    }, function CamFunc(err) {
        if (err) {
            console.log(err);
            return;
        }

        var cam_obj = this;
        var stop_timer;
        var ignore_keypress = false;
        var preset_names = [];
        var preset_tokens = [];

        cam_obj.getStreamUri({
                protocol : 'RTSP'
            },	// Completion callback function
            // This callback is executed once we have a StreamUri
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                    return;
                } else {

                    // start processing the keyboard
                    //console.log('processing keyboard');
                    //read_and_process_keyboard();
                }
            }
        );

        //1 preset left max
        //2 preset is left normal
        //3 preset right normal
        //4 preset exactly middle
        //5 preset right max

        cam_obj.getPresets({}, // use 'default' profileToken
            // Completion callback function
            // This callback is executed once we have a list of presets
            function (err, stream, xml) {
                if (err) {
                    console.log("GetPreset Error "+err);
                    return;
                } else {
                    // loop over the presets and populate the arrays
                    // Do this for the first 9 presets
                    console.log("GetPreset Reply");
                    var count = 1;
                    for(var item in stream) {
                        var name = item;          //key
                        var token = stream[item]; //value
                        // It is possible to have a preset with a blank name so generate a name
                        if (name.length == 0) name='no name ('+token+')';
                        preset_names.push(name);
                        preset_tokens.push(token);

                        // Show first 9 preset names to user
                        /*if (count < 9) {
                            console.log('Press key '+count+ ' for preset "' + name + '"');
                        count++;
                        }*/
                    }
                    goto_preset(4);
                }
            }
        );

        function move(x_speed, y_speed, zoom_speed, msg) {
            // Step 1 - Turn off the keyboard processing (so key-presses do not buffer up)
            // Step 2 - Clear any existing 'stop' timeouts. We will re-schedule a new 'stop' command in this function
            // Step 3 - Send the Pan/Tilt/Zoom 'move' command.
            // Step 4 - In the callback from the PTZ 'move' command we schedule the ONVIF Stop command to be executed after a short delay
            // and re-enable the keyboard

            // Pause keyboard processing
            ignore_keypress = true;

            // Clear any pending 'stop' commands
            if (stop_timer) clearTimeout(stop_timer);

            // Move the camera
            console.log('sending move command ' + msg);
            cam_obj.continuousMove({x : x_speed,
                    y : y_speed,
                    zoom : zoom_speed } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('move command sent '+ msg);
                        // schedule a Stop command to run in the future
                        stop_timer = setTimeout(stop,STOP_DELAY_MS);
                    }
                    // Resume keyboard processing
                    ignore_keypress = false;
                });
        }


        function stop() {
            // send a stop command, stopping Pan/Tilt and stopping zoom
            console.log('sending stop command');
            cam_obj.stop({panTilt: true, zoom: true},
                function (err,stream, xml){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('stop command sent');
                    }
                });
        }


        function goto_preset(number) {
            if (number > preset_names.length) {
                console.log ("No preset " + number);
                return;
            }

            console.log('sending goto preset command '+preset_names[number-1]);
            cam_obj.gotoPreset({ preset : preset_tokens[number-1] } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);

                        res.json({
                            success: false,
                            msg: err
                        });
                    } else {
                        //console.log('goto preset command sent ');
                        //exit process once done!
                        // process.exit();

                        //console.log('done');
                        res.json({
                            success:true,
                            msg:'Camera Recalibrate Success'
                        });
                    }
                });
        }
    });
};

//turn left
module.exports.turnLeftCamera = (req, res) => {

    new Cam({
        hostname : HOSTNAME,
        username : USERNAME,
        password : PASSWORD,
        port : PORT,
        timeout : 100
    }, function CamFunc(err) {
        if (err) {
            console.log(err);
            return;
        }

        var cam_obj = this;
        var stop_timer;
        var ignore_keypress = false;
        var preset_names = [];
        var preset_tokens = [];

        cam_obj.getStreamUri({
                protocol : 'RTSP'
            },	// Completion callback function
            // This callback is executed once we have a StreamUri
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    //THE FUNCTION NEEDED!
                    move(-1,0,0,'left');
                    res.json({
                        success:true,
                        msg:'Camera left'
                    });
                }
            }
        );

        function move(x_speed, y_speed, zoom_speed, msg) {
            // Step 1 - Turn off the keyboard processing if using keyboard input
            // Step 2 - Clear any existing 'stop' timeouts. We will re-schedule a new 'stop' command in this function
            // Step 3 - Send the Pan/Tilt/Zoom 'move' command.
            // Step 4 - In the callback from the PTZ 'move' command we schedule the ONVIF Stop command to be executed after a short delay and re-enable the keyboard

            // Pause keyboard processing
            ignore_keypress = true;

            // Clear any pending 'stop' commands
            if (stop_timer) clearTimeout(stop_timer);

            // Move the camera
            console.log('sending move command ' + msg);
            cam_obj.continuousMove({x : x_speed,
                    y : y_speed,
                    zoom : zoom_speed } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('move command sent '+ msg);
                        // schedule a Stop command to run in the future
                        stop_timer = setTimeout(stop,STOP_DELAY_MS);
                    }
                    // Resume keyboard processing
                    ignore_keypress = false;
                });
        }


        function stop() {
            // send a stop command, stopping Pan/Tilt and stopping zoom
            console.log('sending stop command');
            cam_obj.stop({panTilt: true, zoom: true},
                function (err,stream, xml){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('stop command sent');
                    }
                });
        }

    });
};


//turn right
module.exports.turnRightCamera = (req, res) => {

    new Cam({
        hostname : HOSTNAME,
        username : USERNAME,
        password : PASSWORD,
        port : PORT,
        timeout : 10000
    }, function CamFunc(err) {
        if (err) {
            console.log(err);
            return;
        }

        var cam_obj = this;
        var stop_timer;
        var ignore_keypress = false;
        var preset_names = [];
        var preset_tokens = [];

        cam_obj.getStreamUri({
                protocol : 'RTSP'
            },	// Completion callback function
            // This callback is executed once we have a StreamUri
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    //THE FUNCTION NEEDED!
                    move(1,0,0,'right');
                    res.json({
                        success:true,
                        msg:'Camera right'
                    });
                }
            }
        );

        function move(x_speed, y_speed, zoom_speed, msg) {
            // Step 1 - Turn off the keyboard processing if using keyboard input
            // Step 2 - Clear any existing 'stop' timeouts. We will re-schedule a new 'stop' command in this function
            // Step 3 - Send the Pan/Tilt/Zoom 'move' command.
            // Step 4 - In the callback from the PTZ 'move' command we schedule the ONVIF Stop command to be executed after a short delay and re-enable the keyboard

            // Pause keyboard processing
            ignore_keypress = true;

            // Clear any pending 'stop' commands
            if (stop_timer) clearTimeout(stop_timer);

            // Move the camera
            console.log('sending move command ' + msg);
            cam_obj.continuousMove({x : x_speed,
                    y : y_speed,
                    zoom : zoom_speed } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('move command sent '+ msg);
                        // schedule a Stop command to run in the future
                        stop_timer = setTimeout(stop,STOP_DELAY_MS);
                    }
                    // Resume keyboard processing
                    ignore_keypress = false;
                });
        }


        function stop() {
            // send a stop command, stopping Pan/Tilt and stopping zoom
            console.log('sending stop command');
            cam_obj.stop({panTilt: true, zoom: true},
                function (err,stream, xml){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('stop command sent');
                    }
                });
        }

    });
};

//turn up
module.exports.turnUpCamera = (req, res) => {

    new Cam({
        hostname : HOSTNAME,
        username : USERNAME,
        password : PASSWORD,
        port : PORT,
        timeout : 10000
    }, function CamFunc(err) {
        if (err) {
            console.log(err);
            return;
        }

        var cam_obj = this;
        var stop_timer;
        var ignore_keypress = false;
        var preset_names = [];
        var preset_tokens = [];

        cam_obj.getStreamUri({
                protocol : 'RTSP'
            },	// Completion callback function
            // This callback is executed once we have a StreamUri
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    //THE FUNCTION NEEDED!
                    move(0,-1,0,'down');
                    res.json({
                        success:true,
                        msg:'Camera down'
                    });
                }
            }
        );

        function move(x_speed, y_speed, zoom_speed, msg) {
            // Step 1 - Turn off the keyboard processing if using keyboard input
            // Step 2 - Clear any existing 'stop' timeouts. We will re-schedule a new 'stop' command in this function
            // Step 3 - Send the Pan/Tilt/Zoom 'move' command.
            // Step 4 - In the callback from the PTZ 'move' command we schedule the ONVIF Stop command to be executed after a short delay and re-enable the keyboard

            // Pause keyboard processing
            ignore_keypress = true;

            // Clear any pending 'stop' commands
            if (stop_timer) clearTimeout(stop_timer);

            // Move the camera
            console.log('sending move command ' + msg);
            cam_obj.continuousMove({x : x_speed,
                    y : y_speed,
                    zoom : zoom_speed } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('move command sent '+ msg);
                        // schedule a Stop command to run in the future
                        stop_timer = setTimeout(stop,STOP_DELAY_MS);
                    }
                    // Resume keyboard processing
                    ignore_keypress = false;
                });
        }


        function stop() {
            // send a stop command, stopping Pan/Tilt and stopping zoom
            console.log('sending stop command');
            cam_obj.stop({panTilt: true, zoom: true},
                function (err,stream, xml){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('stop command sent');
                    }
                });
        }

    });
};

//turn down
module.exports.turnDownCamera = (req, res) => {

    new Cam({
        hostname : HOSTNAME,
        username : USERNAME,
        password : PASSWORD,
        port : PORT,
        timeout : 10000
    }, function CamFunc(err) {
        if (err) {
            console.log(err);
            return;
        }

        var cam_obj = this;
        var stop_timer;
        var ignore_keypress = false;
        var preset_names = [];
        var preset_tokens = [];

        cam_obj.getStreamUri({
                protocol : 'RTSP'
            },	// Completion callback function
            // This callback is executed once we have a StreamUri
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    //THE FUNCTION NEEDED!
                    move(0,1,0,'up');
                    res.json({
                        success:true,
                        msg:'Camera up'
                    });
                }
            }
        );

        function move(x_speed, y_speed, zoom_speed, msg) {
            // Step 1 - Turn off the keyboard processing if using keyboard input
            // Step 2 - Clear any existing 'stop' timeouts. We will re-schedule a new 'stop' command in this function
            // Step 3 - Send the Pan/Tilt/Zoom 'move' command.
            // Step 4 - In the callback from the PTZ 'move' command we schedule the ONVIF Stop command to be executed after a short delay and re-enable the keyboard

            // Pause keyboard processing
            ignore_keypress = true;

            // Clear any pending 'stop' commands
            if (stop_timer) clearTimeout(stop_timer);

            // Move the camera
            console.log('sending move command ' + msg);
            cam_obj.continuousMove({x : x_speed,
                    y : y_speed,
                    zoom : zoom_speed } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('move command sent '+ msg);
                        // schedule a Stop command to run in the future
                        stop_timer = setTimeout(stop,STOP_DELAY_MS);
                    }
                    // Resume keyboard processing
                    ignore_keypress = false;
                });
        }


        function stop() {
            // send a stop command, stopping Pan/Tilt and stopping zoom
            console.log('sending stop command');
            cam_obj.stop({panTilt: true, zoom: true},
                function (err,stream, xml){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('stop command sent');
                    }
                });
        }

    });
};



//stop movement
module.exports.stopMovementCamera = (req, res) => {

    new Cam({
        hostname : HOSTNAME,
        username : USERNAME,
        password : PASSWORD,
        port : PORT,
        timeout : 10000
    }, function CamFunc(err) {
        if (err) {
            console.log(err);
            return;
        }

        var cam_obj = this;
        var stop_timer;
        var ignore_keypress = false;
        var preset_names = [];
        var preset_tokens = [];

        cam_obj.getStreamUri({
                protocol : 'RTSP'
            },	// Completion callback function
            // This callback is executed once we have a StreamUri
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    //console.log('in here');
                    //THE FUNCTION NEEDED!
                    stop();

                    res.json({
                        success:true,
                        msg:'Camera right'
                    });
                }
            }
        );

        function stop() {
            // send a stop command, stopping Pan/Tilt and stopping zoom
            console.log('sending stop command');
            cam_obj.stop({panTilt: true, zoom: true},
                function (err,stream, xml){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Camera Movement Stopped');
                    }
                });
        }

    });
};

//zoom in
module.exports.zoomInCamera = (req, res) => {

    new Cam({
        hostname : HOSTNAME,
        username : USERNAME,
        password : PASSWORD,
        port : PORT,
        timeout : 10000
    }, function CamFunc(err) {
        if (err) {
            console.log(err);
            return;
        }

        var cam_obj = this;
        var stop_timer;
        var ignore_keypress = false;
        var preset_names = [];
        var preset_tokens = [];

        cam_obj.getStreamUri({
                protocol : 'RTSP'
            },	// Completion callback function
            // This callback is executed once we have a StreamUri
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    //THE FUNCTION NEEDED!
                    move(0,0,1,'zoom in');
                    res.json({
                        success:true,
                        msg:'Camera zoom in'
                    });
                }
            }
        );

        function move(x_speed, y_speed, zoom_speed, msg) {

            // Pause keyboard processing
            ignore_keypress = true;

            // Clear any pending 'stop' commands
            if (stop_timer) clearTimeout(stop_timer);

            // Move the camera
            //console.log('sending move command ' + msg);
            cam_obj.continuousMove({x : x_speed,
                    y : y_speed,
                    zoom : zoom_speed } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('move command sent '+ msg);
                        // schedule a Stop command to run in the future
                        stop_timer = setTimeout(stop,STOP_DELAY_MS);
                    }
                    // Resume keyboard processing
                    ignore_keypress = false;
                });
        }


        function stop() {
            // send a stop command, stopping Pan/Tilt and stopping zoom
            console.log('sending stop command');
            cam_obj.stop({panTilt: true, zoom: true},
                function (err,stream, xml){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('stop command sent');
                    }
                });
        }

    });
};


//zoom out
module.exports.zoomOutCamera = (req, res) => {

    new Cam({
        hostname : HOSTNAME,
        username : USERNAME,
        password : PASSWORD,
        port : PORT,
        timeout : 10000
    }, function CamFunc(err) {
        if (err) {
            console.log(err);
            return;
        }

        var cam_obj = this;
        var stop_timer;
        var ignore_keypress = false;
        var preset_names = [];
        var preset_tokens = [];

        cam_obj.getStreamUri({
                protocol : 'RTSP'
            },	// Completion callback function
            // This callback is executed once we have a StreamUri
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    //THE FUNCTION NEEDED!
                    move(0,0,-1,'zoom out')
                    res.json({
                        success:true,
                        msg:'Camera zoom out'
                    });
                }
            }
        );

        function move(x_speed, y_speed, zoom_speed, msg) {

            // Pause keyboard processing
            ignore_keypress = true;

            // Clear any pending 'stop' commands
            if (stop_timer) clearTimeout(stop_timer);

            // Move the camera
            //console.log('sending move command ' + msg);
            cam_obj.continuousMove({x : x_speed,
                    y : y_speed,
                    zoom : zoom_speed } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('move command sent '+ msg);
                        // schedule a Stop command to run in the future
                        stop_timer = setTimeout(stop,STOP_DELAY_MS);
                    }
                    // Resume keyboard processing
                    ignore_keypress = false;
                });
        }


        function stop() {
            // send a stop command, stopping Pan/Tilt and stopping zoom
            console.log('sending stop command');
            cam_obj.stop({panTilt: true, zoom: true},
                function (err,stream, xml){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('stop command sent');
                    }
                });
        }

    });
};

module.exports.go_to_podium = (req, res) => {

    new Cam({
        hostname : HOSTNAME,
        username : USERNAME,
        password : PASSWORD,
        port : PORT,
        timeout : 10000
    }, function CamFunc(err) {
        if (err) {
            console.log(err);
            return;
        }

        var cam_obj = this;
        var stop_timer;
        var ignore_keypress = false;
        var preset_names = [];
        var preset_tokens = [];

        cam_obj.getStreamUri({
                protocol : 'RTSP'
            },	// Completion callback function
            // This callback is executed once we have a StreamUri
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                    return;
                } else {

                }
            }
        );

        cam_obj.getPresets({}, // use 'default' profileToken

            function (err, stream, xml) {
                if (err) {
                    console.log("GetPreset Error "+err);
                    return;
                } else {
                    // loop over the presets and populate the arrays
                    // Do this for the first 9 presets
                    console.log("GetPreset Reply");
                    var count = 1;
                    for(var item in stream) {
                        var name = item;          //key
                        var token = stream[item]; //value
                        // It is possible to have a preset with a blank name so generate a name
                        if (name.length == 0) name='no name ('+token+')';
                        preset_names.push(name);
                        preset_tokens.push(token);

                        // Show first 9 preset names to user
                        /*if (count < 9) {
                            console.log('Press key '+count+ ' for preset "' + name + '"');
                        count++;
                        }*/
                    }
                    goto_preset(8); //3 right 9 bit down
                }
            }
        );

        function move(x_speed, y_speed, zoom_speed, msg) {

            // Pause keyboard processing
            ignore_keypress = true;

            // Clear any pending 'stop' commands
            if (stop_timer) clearTimeout(stop_timer);

            // Move the camera
            console.log('sending move command ' + msg);
            cam_obj.continuousMove({x : x_speed,
                    y : y_speed,
                    zoom : zoom_speed } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('move command sent '+ msg);
                        // schedule a Stop command to run in the future
                        stop_timer = setTimeout(stop,STOP_DELAY_MS);
                    }
                    // Resume keyboard processing
                    ignore_keypress = false;
                });
        }


        function stop() {
            // send a stop command, stopping Pan/Tilt and stopping zoom
            console.log('sending stop command');
            cam_obj.stop({panTilt: true, zoom: true},
                function (err,stream, xml){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('stop command sent');
                    }
                });
        }


        function goto_preset(number) {
            if (number > preset_names.length) {
                console.log ("No preset " + number);
                return;
            }

            console.log('sending goto preset command '+preset_names[number-1]);
            cam_obj.gotoPreset({ preset : preset_tokens[number-1] } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);

                        res.json({
                            success: false,
                            msg: err
                        });
                    } else {
                        //console.log('goto preset command sent ');
                        //exit process once done!
                        // process.exit();

                        //console.log('done');
                        res.json({
                            success:true,
                            msg:'Camera Recalibrate Success'
                        });
                    }
                });
        }
    });
};

module.exports.turn_to_audience = (req, res) => {

    new Cam({
        hostname : HOSTNAME,
        username : USERNAME,
        password : PASSWORD,
        port : PORT,
        timeout : 10000
    }, function CamFunc(err) {
        if (err) {
            console.log(err);
            return;
        }

        var cam_obj = this;
        var stop_timer;
        var ignore_keypress = false;
        var preset_names = [];
        var preset_tokens = [];

        cam_obj.getStreamUri({
                protocol : 'RTSP'
            },	// Completion callback function
            // This callback is executed once we have a StreamUri
            function (err, stream, xml) {
                if (err) {
                    console.log(err);
                    return;
                } else {

                }
            }
        );

        cam_obj.getPresets({}, // use 'default' profileToken

            function (err, stream, xml) {
                if (err) {
                    console.log("GetPreset Error "+err);
                    return;
                } else {
                    // loop over the presets and populate the arrays
                    // Do this for the first 9 presets
                    console.log("GetPreset Reply");
                    var count = 1;
                    for(var item in stream) {
                        var name = item;          //key
                        var token = stream[item]; //value
                        // It is possible to have a preset with a blank name so generate a name
                        if (name.length == 0) name='no name ('+token+')';
                        preset_names.push(name);
                        preset_tokens.push(token);

                        // Show first 9 preset names to user
                        /*if (count < 9) {
                            console.log('Press key '+count+ ' for preset "' + name + '"');
                        count++;
                        }*/
                    }
                    goto_preset(5);
                }
            }
        );

        function move(x_speed, y_speed, zoom_speed, msg) {

            // Pause keyboard processing
            ignore_keypress = true;

            // Clear any pending 'stop' commands
            if (stop_timer) clearTimeout(stop_timer);

            // Move the camera
            console.log('sending move command ' + msg);
            cam_obj.continuousMove({x : x_speed,
                    y : y_speed,
                    zoom : zoom_speed } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('move command sent '+ msg);
                        // schedule a Stop command to run in the future
                        stop_timer = setTimeout(stop,STOP_DELAY_MS);
                    }
                    // Resume keyboard processing
                    ignore_keypress = false;
                });
        }


        function stop() {
            // send a stop command, stopping Pan/Tilt and stopping zoom
            console.log('sending stop command');
            cam_obj.stop({panTilt: true, zoom: true},
                function (err,stream, xml){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('stop command sent');
                    }
                });
        }


        function goto_preset(number) {
            if (number > preset_names.length) {
                console.log ("No preset " + number);
                return;
            }

            console.log('sending goto preset command '+preset_names[number-1]);
            cam_obj.gotoPreset({ preset : preset_tokens[number-1] } ,
                // completion callback function
                function (err, stream, xml) {
                    if (err) {
                        console.log(err);

                        res.json({
                            success: false,
                            msg: err
                        });
                    } else {
                        //console.log('goto preset command sent ');
                        //exit process once done!
                        // process.exit();

                        //console.log('done');
                        res.json({
                            success:true,
                            msg:'Camera Recalibrate Success'
                        });
                    }
                });
        }
    });
};

/*
		if      (key && key.name == 'up')    move(0,1,0,'up');
			else if (key && key.name == 'down')  move(0,-1,0,'down');
			else if (key && key.name == 'left')  move(-1,0,0,'left');
			else if (key && key.name == 'right') move(1,0,0,'right');
			else if (ch  && ch       == '-')     move(0,0,-1,'zoom out');
			else if (ch  && ch       == '+')     move(0,0,1,'zoom in');
 */