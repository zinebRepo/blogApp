const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const authToken = req.headers.authorization
    if (authToken) {
        const token = authToken.split(' ')[1]
        try {
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decodedPayload
            next()
        } catch (error) {
            return res.status(401).json({message: 'invalid token, access denied!'})
        }
    } else  {
        return res.status(401).json({message: 'token is not provided, access denied!'})
    }
}

//verfication of token and admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json({ message: 'Ur forbidden!'})
        }
    })
}

//verfication of token and only admin themself
function verifyTokenAndOnlyUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next()
        } else {
            return res.status(403).json({ message: 'Ur forbidden!'})
        }
    })
}


module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser
}