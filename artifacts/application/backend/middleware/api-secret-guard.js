const config = require('../config');
const ReturnResult = require('../libs/ReturnResult');
const colorConsole = require('../config/colors')

module.exports = (req, res, next) => {
    try {
        const apiKey = req.headers.secret;
        console.log(colorConsole.FgYellow,`Secret API: ${apiKey}`)
        const isValid = apiKey.localeCompare(config.get('secret.COMMUNICATE_API_KEY'))
        if(isValid !== 0)
            return res.json(new ReturnResult(null, null, null, `API Error: API Secret key is not valid`));
        next();
    } catch (error) {
        console.log(colorConsole.FgRed,"[API-SECRET-GUARD MIDDLEWARE]: FAILED -> " + error.message);
        if(error instanceof TypeError){
            return res.json(new ReturnResult(null, null, null, `API Error: API Secret key is not found`));
        }
        res.json(new ReturnResult(error, null, null, `API Error: ${error.message}`));
    }
};