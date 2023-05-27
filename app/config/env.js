const env = {
    "name": "development", // "production", "staging"
    "port": process.env.PORT || 3200,
    "salt": "codesecuresalt",
    "request_origin": 'http://localhost:4200'
}

module.exports = env;