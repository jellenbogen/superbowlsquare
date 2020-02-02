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
        name: "superbowl",
        connectionString: "mongodb://admin:0sVZlFd7x2iMffXp@superbowlsquare-shard-00-00-outkw.gcp.mongodb.net:27017,superbowlsquare-shard-00-01-outkw.gcp.mongodb.net:27017,superbowlsquare-shard-00-02-outkw.gcp.mongodb.net:27017/superbow?ssl=true&replicaSet=superbowlsquare-shard-0&authSource=admin&retryWrites=true&w=majority"
    },
    // ----------- Box Config -----------
    boxPrice: 20,
    sessionSecret: "S3CRE7"
};

module.exports = config;