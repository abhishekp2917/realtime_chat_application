const connection = require("../model/config")
const { redirect } = require("express/lib/response")
const jwt = require("jsonwebtoken")
const syncsql = require("sync-sql")

const config = {
    host : "localhost",
    user : "root",
    password : "",
    database: "chat_application",
}

const chatPageMiddleware = (req, res, next) => {

    const token = req.cookies.jwt
    const secretKey = "ABHISHEKPANDEYLALAN"

    const user = req.session.user

    if(user){

        const useremail = user.useremail
        const userpassword = user.userpassword

        if(useremail && userpassword){
            const sql = `SELECT * FROM users WHERE users.user_email='${useremail}' AND users.user_password='${userpassword}'`

            const result = syncsql.mysql(config, sql).data.rows

            if(result.length>0){
                console.log("success")
                res.locals.user = result
                next()
            }
            else{
                res.redirect("/")
            }
        }
        else{
            res.redirect("/")
        }
    }
    else{
        res.redirect("/")
    }

    // if(token){
    //     jwt.verify(token,secretKey, (error, decodedResult) => {
    //         if(error){
    //             res.redirect("/")
    //         }
    //         else {
    //             const sql = `SELECT * FROM users WHERE user_id=8`
    //             connection.query(sql, (error, result) => {
    //                 res.locals.user = result
    //                 next()
    //             })
    //         }
    //     })
    // }
    // else{
    //     res.redirect("/")
    // }
}

module.exports = chatPageMiddleware