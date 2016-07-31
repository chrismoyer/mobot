Mobot the Robot
===============

Code for Dayton Nodebots Day 2016, http://gemcityjs.com/nodebots/

This code assumes running on a Raspberry Pi 3 with a Sony Dualshock 4 connected via Bluetooth. Video playback
uses omxplayer on Pi, included with Raspian. Video files are assumed to be in ~/mobot-videos. Video titles are hard coded because I'm lazy and am not a node ninja.

Default controls are video game style... R stick is speed and L stick is steering. L2 and R2 spin in place with speed reported by analog trigger. Holding L1 enables "tank style" controls where each stick controls the speed of each wheel independently. Holding R1 cuts all speeds in half when you're just feeling slow. 

To make the DS4 work, after running `npm install` copy the file ds4.json into node_modules/dualshock-controller/controllerConfiurations. 
