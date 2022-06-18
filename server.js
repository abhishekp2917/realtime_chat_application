const express = require("express")
const app = express()
const http = require("http").Server(app)
const path = require("path")
const cookieParser = require("cookie-parser")
const connection = require("./model/config")
const io = require("socket.io")(http)
const syncsql = require("sync-sql")
const session = require("express-session")

const config = {
    host : "localhost",
    user : "root",
    password : "",
    database: "chat_application",
}

const port = process.env.PORT || 5000

const mainPageRoute = require("./routes/mainPage-route")
const chatPageRoute = require("./routes/chatPage-route")
const exp = require("constants")



app.set("view engine", "ejs")

app.use(cookieParser())

app.use(session({
    resave : true,
    saveUninitialized : true,
    secret : "ABHISHEKPANDEYLALAN"
}))

app.use(express.json())

app.use(express.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, "/public")))

app.use(mainPageRoute)

app.use(chatPageRoute)




// making connection to DBMS and creating server
connection.connect((error) => {
    if(error) throw error

    console.log("Connected to Database")
    
    http.listen(port, error => {
        if(error) throw error
        console.log(`Listening to port ${port}`)
    })
})

// get socket id
const get_socket_id = (user_id) => {
    const sql = `SELECT * FROM users WHERE users.user_id=${user_id}`

    const result = syncsql.mysql(config, sql).data.rows

    if(result.length>0){
        return result.user_socket_id
    }
}

// set the connected user to online
const setOnline = (user_id, socket_id) => {
    const sql = `UPDATE users SET users.user_active=1, users.user_socket_id='${socket_id}' WHERE users.user_id=${user_id}`

    const result = syncsql.mysql(config, sql).data.rows.affectedRows

    if(result>0){
        console.log(`${socket_id} online`)
    }
    else{
        console.log("online error")
    }
}

// set the disconnected user to offline
const setOffline = (user_id, socket_id) => {
    const sql1 = `UPDATE users SET users.user_active=0 WHERE users.user_socket_id='${socket_id}'`
    const result1 = syncsql.mysql(config, sql1).data.rows.affectedRows

    if(result1>0){
        console.log(`${socket_id} offline`)

        const sql2 = `SELECT * FROM users WHERE users.user_socket_id='${socket_id}'`
        const result2 = syncsql.mysql(config, sql2).data.rows

        const sql3 = `UPDATE friends SET chat_opened=0 WHERE first_person=${user_id} AND chat_opened=1`
        const result3 = syncsql.mysql(config, sql3).data.rows

        if(result2.length>0){
            io.emit("offline", result2[0].user_id)
        }
        else{
            console.log("offline broadcast error")
        }
    }
    else{
        console.log("offline error")
    }
}

io.on("connection", socket => {

    let online_user_id = ""

    socket.emit("custom_event", "connected")

    socket.on("online", user_id => {
        setOnline(user_id, socket.id)
        socket.broadcast.emit("online", user_id)
        online_user_id = user_id
    })

    socket.on("disconnect", () => {
        setOffline(online_user_id, socket.id)
    })

    socket.on("send_message", chat_id => {

        const sql1 = `SELECT * FROM chats INNER JOIN users ON chats.chat_target=users.user_id WHERE chats.chat_id=${chat_id}`

        const result1 = syncsql.mysql(config, sql1).data.rows

        const sql2 = `SELECT * FROM friends WHERE first_person=${result1[0].chat_target} AND second_person=${result1[0].chat_source}`

        const result2 = syncsql.mysql(config, sql2).data.rows


        if(result1.length>0 && result2.length>0){
            console.log("message sent to ",result1[0].user_socket_id)
            socket.to(result1[0].user_socket_id).emit("receive_message", result1[0],  result2[0])
        }
        else{
            console.log("socket send message error")
        }
    })

    socket.on("chat_open", object => {

        const user_id = object.user_id
        const friend_id = object.friend_id

        const sql = `SELECT chat_id FROM chats WHERE chat_source=${friend_id} AND chat_target=${user_id} AND chat_seen=0`

        const result = syncsql.mysql(config, sql).data.rows

        console.log(result)

        if(result.length>0){
            socket.to(get_socket_id(friend_id)).emit("message_seen", result)
        }
    })
})
