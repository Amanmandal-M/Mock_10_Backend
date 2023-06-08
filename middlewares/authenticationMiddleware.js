const jwt = require('jsonwebtoken');

const authentication = async (req,res,next) => {
    try {
        const normalToken = req.headers.authorization || "";

        // Verify the token
        jwt.verify(normalToken, process.env.NORMAL_KEY, (err, decoded) => {
        if(err) return res.status(401).json({ message: "Invalid token" });
          next();
        });
        
    } catch (error) {
        res.status(500).send({
            "message":error.message
        });
        console.log(`error: ${error.message}`)
    }
}

module.exports = { authentication };