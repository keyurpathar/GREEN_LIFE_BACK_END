const jwt = require("jsonwebtoken");

const authAdmin = async (req, res, next) => {

    try {

        const { admintoken } = req.headers;
        // console.log('ALL HEADERS:', req.headers)
        // console.log('TOKEN:', admintoken)

        if (!admintoken) {
            return res.status(401).json({
                success: false,
                message: "not authorized"
            })
        }

        const token_decode = jwt.verify(admintoken, process.env.JWT_SECRET)

        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({
                success: false,
                message: "unauthorized"
            })
        }



        next()

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }

}

module.exports = authAdmin