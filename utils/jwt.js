const jwt = require('jsonwebtoken')
const createError = require('http-errors')
require('dotenv').config()
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
module.exports = {
    signAccessToken(payload){
        console.log(accessTokenSecret)
        console.log(payload)
        return new Promise((resolve, reject) => {
            jwt.sign({ payload }, accessTokenSecret, {
                expiresIn: '1h'
            }, (err, token) => {
                if (err) {
                reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken(token){
        return new Promise((resolve, reject) => {
            jwt.verify(token, accessTokenSecret, (err, payload) => {
                if (err) {
                    const message = 'le secret est : ' + accessTokenSecret + ' ' + err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
                    console.log(message)
                    return reject(createError.Unauthorized(message))
                }
                console.log(payload)
                resolve(payload)
            })
        })
    }
}