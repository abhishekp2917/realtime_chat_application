const connection = require("../model/config")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const maxAge = 3*24*60*60
const createToken = (id) => {
    return jwt.sign({"id" : id}, "ABHISHEKPANDEYLALAN", {
        expiresIn : maxAge
    })
}

const mainPagePostController = async (req, res) => {
    
    if(req.body.process=="signin"){

        const saltRounds = 10
        const email = req.body.username
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const sql = `SELECT * FROM users WHERE user_email='${email}' AND user_password='${password}'`
        connection.query(sql, (error, result) => {

            if(result.length!=0){

                // const token = createToken(result.user_id)
                // res.cookie("jwt", token, {httpOnly : true, maxAge : maxAge*1000})
                // res.cookie("useremail", email, {httpOnly : true, maxAge : maxAge*1000})
                // res.cookie("userpassword", password, {httpOnly : true, maxAge : maxAge*1000})
                req.session.user = {
                    useremail : email,
                    userpassword : password
                }

                req.session.save()

                res.status(201).json({
                    error : 0
                })
            }
            else{
                res.json({
                    error : 1,
                    errorMessage : "Invalid username or password"
                })
            }
        })
    }
    else{
        const duplicateUser = () => {

            return new Promise((resolve, reject) => {

                const sql = `SELECT * FROM users WHERE user_email='${req.body.email}'`
                connection.query(sql, (error, result) => {

                    if(error) reject(error)

                    resolve(result)
                })
            })
        }

        duplicateUser()

        .then(async data => {

            if(data.length==0){
                const saltRounds = 10
                const username = req.body.username
                const email = req.body.email
                const password = req.body.password

                // const hashedPassword = await bcrypt.hash(password, saltRounds)

                sql = `INSERT INTO users (user_name, user_email, user_password, user_profile_photo) VALUES ('${username}', '${email}', '${password}','default.png')`
                connection.query(sql, (error, result) => {
                    
                    // const token = createToken(result.insertId)
                    // set the cookies
                    // res.cookie("jwt", token, {httpOnly : true, maxAge : maxAge*1000})
                    // res.cookie("useremail", email, {httpOnly : true, maxAge : maxAge*1000})
                    // res.cookie("userpassword", password, {httpOnly : true, maxAge : maxAge*1000})
                    
                    req.session.user = {
                        useremail : email,
                        userpassword : password
                    }

                    req.session.save()

                    res.status(201).json({
                        error : 0
                    })
                })
            }
            else{
                res.json({
                    error : 1,
                    errorMessage : "Email already exists"
                })
            }
        })

        .catch(error => {
            console.log(error)
        })
    }
}

module.exports = mainPagePostController