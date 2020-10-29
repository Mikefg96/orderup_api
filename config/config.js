const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    // default should point towards your local MongoDB server (not in this case tho)
    default: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    }
};

exports.get = function get(env) {
    return config[env] || config.default;
}