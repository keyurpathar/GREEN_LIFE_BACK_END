const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {

    try {

        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "not authorized"
            })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        req.body = req.body || {};
        req.body.userId = token_decode.id;
        req.user_id = token_decode.id;

        next()

    }
    catch (err) {
        console.log(err)
        res.status(401).json({
            success: false,
            message: "not authorized (token expired or invalid)"
        })
    }

}

module.exports = authUser