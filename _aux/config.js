var env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

if(env === "development" || env === "test") {

    var config  = {
            "test": {
                "PORT" : 3001,
                "MONGODB_URI": "mongodb://localhost:27017/JsStackDemoTest"
            },
            "development": {
                "PORT" : 3000,
                "MONGODB_URI": "mongodb://localhost:27017/JsStackDemo"
            }
        },
        env     = config[env];

    process.env = env;
}

module.exports = {
    
    mongoClient : require('mongodb').MongoClient.connect('mongodb://localhost:27017/JsStackDemo')
}