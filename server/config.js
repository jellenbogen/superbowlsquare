const config = {
    // ----------- Venmo Config -----------
    venmo: {
        clientId: "1232",
        clientSecret: "rAgY6MexND5B82FzXNnKZe9AKHRvz3tv",
        callbackUrl: "http://superbowlsquare.me/auth/venmo/callback"
    },
    // ----------- Mongo Config -----------
    mongo: {
        url: "mongodb://127.0.0.1:27017/superbowl",
        host: "localhost",
        port: 27017, // mongo db port
        name: "superbowl"
    },
    // ----------- Box Config -----------
    boxPrice: 20,
    sessionSecret: "S3CRE7"
};

module.exports = config;