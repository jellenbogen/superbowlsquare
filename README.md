# superbowlsquare
This is a small web app to run a Super Bowl square site.

## Setup
1. Create Venmo developer credentials via the settings section on venmo.com
2. From venmo you'll need:
	- client Id
	- client Secret
	- callback url
3. Install all the required node modules ```npm install``` from ```/server```
4. Install mongo on your host, this will be required to run the app.
5. Replace the temporary values in the ```server/config.js``` file with your config values
6. Start the server ```forever start SuperBowlServer.js``` from ```/server```

### Notes:
You're going to need to change the callback url in your venmo settings depening on whether or not you are running in dev or in production.
