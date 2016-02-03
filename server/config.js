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