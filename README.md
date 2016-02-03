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

### Example config.js
```
var config = {
    // ----------- Venmo Config -----------
    venmo: {
        clientId: "1111",
        clientSecret: "rwfkjfwelkfjweB82FzXNnKZe9AKHRvz3tv",
        callbackUrl: "http://[yourdomain.com]/auth/venmo/callback"
    },
    // ----------- Mongo Config -----------
    mongo: {
        url: "mongodb://localhost:27017/superbowl",
        host: "localhost",
        port: 27017, // mongo db port
        name: "superbowl"
    },
    // ----------- Box Config -----------
    boxPrice: 10
    sessionSecret: "someSecret"
};

module.exports = config;
```
### Notes:
You're going to need to change the callback url in your venmo settings depening on whether or not you are running in dev or in production.
