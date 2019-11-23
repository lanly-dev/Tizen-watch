/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var heart_rate = 0;

(function() {
	/**
	 * Handles the hardware key event.
	 * @private
	 * @param {Object} event - The hardware key event object
	 */
//	function keyEventHandler(event) {
//	if (event.keyName === "back") {
//	try {
//	// If the back key is pressed, exit the application.
//	tizen.application.getCurrentApplication().exit();
//	} catch (ignore) {}
//	}
//	}


	tizen.power.request("CPU", "CPU_AWAKE");
	tizen.power.request("SCREEN","SCREEN_NORMAL");

	/**
	 * Initializes the application.
	 * @private
	 */
	function init() {
		window.webapis.motion.start("HRM", onchangedCB);
		function onchangedCB(hrmInfo) 
		{
			if(hrmInfo.heartRate > 0) {
				heart_rate = hrmInfo.heartRate;
			} else {
			}
		}

//		var webSocketUrl = 'ws://172.16.94.196:3001';
//		var webSocketUrl = 'ws://172.16.95.100:3001';
//		var webSocketUrl = 'ws://172.16.95.100:4000';
		var webSocketUrl = 'wss://humane-girl.glitch.me';
		

		var webSocket = new WebSocket(webSocketUrl);

		/* If the connection fails or is closed with prejudice */
		webSocket.onerror = function(e) {
			alert(e);
		};
		var tizenId = tizen.systeminfo.getCapability('http://tizen.org/system/tizenid');
		function sendMessage(msg) {
//			alert(webSocket.readyState);
			if (webSocket.readyState === 1) {
				webSocket.send(msg);
			}
		}
		watchFunc();
		function successCallback(position) {
//			document.getElementById('locationInfo').innerHTML = 'Latitude: ' + position.coords.latitude +'<br/>Longitude: ' + position.coords.longitude;

			var message = {
					id : tizenId,
					hr : heart_rate,
					position : {					
						lat : position.coords.latitude,
						lng : position.coords.longitude
					}


			};

			sendMessage(JSON.stringify(message));
		}

		function errorCallback(error) {
//			var errorInfo = document.getElementById('locationInfo');

			switch (error.code) {
			case error.PERMISSION_DENIED:
				errorInfo.innerHTML = 'User denied the request for Geolocation.';
				break;
			case error.POSITION_UNAVAILABLE:
				errorInfo.innerHTML = 'Location information is unavailable.';
				break;
			case error.TIMEOUT:
				errorInfo.innerHTML = 'The request to get user location timed out.';
				break;
			case error.UNKNOWN_ERROR:
				errorInfo.innerHTML = 'An unknown error occurred.';
				break;
			}
		}

		function watchFunc() {
			if (navigator.geolocation) {
				navigator.geolocation.watchPosition(successCallback, errorCallback, {enableHighAccuracy: true});
			} else {
				document.getElementById('locationInfo').innerHTML = 'Geolocation is not supported.';
			}
		}

	}

	// The function "init" will be executed after the application successfully loaded.
	window.onload = init;
}());