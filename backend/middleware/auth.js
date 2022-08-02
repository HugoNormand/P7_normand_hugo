const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin
        req.isAdmin = { isAdmin }
        req.auth = { userId }
        if(req.isAdmin) {
            next()
        } else {
            if(req.body.userId && req.body.userId !== userId) {
                throw 'Non valable'
            } else {
                next()
            }
        }
    } catch (error) {
        res.status(401).json({ error })
    } 
}