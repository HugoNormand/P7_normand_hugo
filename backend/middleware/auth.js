const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        /* middleware d'authentification, vérification grâce au token */
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin
        /* on crée un req.isAdmin pour que l'Admin ait un status */
        req.isAdmin = { isAdmin }
        /* on crée un req.auth pour s'assurer de l'authentification */
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