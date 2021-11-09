const config = require('../config');
const ReturnResult = require('../libs/ReturnResult');

module.exports = (req, res, next) => {
    try {
        const apiKey = req.headers.secret;
        const isValid = apiKey.localeCompare(config.get('secret.COMMUNICATE_API_KEY'))
        if(isValid !== 0)
            return res.status(401).json(new ReturnResult(null, null, null, `API Error: API Secret key is not valid`));
        next();
    } catch (error) {
        console.log("[API-SECRET-GUARD MIDDLEWARE]: FAILED -> " + error.message);
        if(error instanceof TypeError){
            return res.status(400).json(new ReturnResult(null, null, null, `API Error: API key is not found`));
        }
        res.status(401).json(new ReturnResult(error, null, null, `API Error: ${error.message}`));
    }
};