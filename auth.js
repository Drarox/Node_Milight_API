const config = require('./config');

module.exports = (req, res, next) => {
    try {
        if (req.body.auth == config.authToken){
            next();
        }
        else {
            return res.status(401).json({ error: 'Invalid auth token' });
        }
    } catch (e) {
        res.status(401).json({
            error: new Error('Invalid request! '+e)
        });
    }
};