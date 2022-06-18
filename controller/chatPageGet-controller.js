const res = require("express/lib/response")
const syncsql = require("sync-sql")

const config = {
    host : "localhost",
    user : "root",
    password : "",
    database: "chat_application",
}


const getNotifications = (user_id) => {

    const sql = `SELECT * FROM notifications INNER JOIN users ON notifications.notify_source=users.user_id WHERE notify_target=${user_id} ORDER BY notify_id DESC`
    const result = syncsql.mysql(config, sql).data.rows
    return result
}

const getUnseenNotificationCount = (user_id) => {

    const sql = `SELECT * FROM notifications WHERE notify_target=${user_id} AND notify_seen=0`
    const result = syncsql.mysql(config, sql).data.rows
    return result.length
}

const timePassed = (t2, t1) => {
    const seconds = t2-t1
    const minutes = parseInt((t2-t1)/60)
    const hours = parseInt((t2-t1)/3600)
    const days = parseInt((t2-t1)/(3600*24))
    const weeks = parseInt((t2-t1)/(3600*24*7))
    const months = parseInt((t2-t1)/(3600*24*30))
    const years = parseInt((t2-t1)/(3600*24*30*12))

    let output = ""

    if(years!=0){
        output = `${years} years ago`
    }
    else if(months!=0){
        output = `${months} months ago`
    }
    else if(weeks!=0){
        output = `${weeks} weeks ago`
    }
    else if(days!=0){
        output = `${days} days ago`
    }
    else if(hours!=0){
        output = `${hours} hours ago`
    }
    else if(minutes!=0){
        output = `${minutes} minutes ago`
    }
    else if(seconds!=0){
        output = `${seconds} seconds ago`
    }
    return output
}

const getFriends = (user_id) => {
    const sql = `SELECT * FROM friends
                INNER JOIN users ON friends.second_person=users.user_id 
                WHERE friends.first_person=${user_id} AND friends.status='friend'`
    const result = syncsql.mysql(config, sql).data.rows
    return result
}

const resetOpenedChat = (user_id) => {
    const sql = `UPDATE friends SET chat_opened=0 WHERE friends.first_person=${user_id}`
    const result = syncsql.mysql(config, sql).data.rows.affectedRows
    return result
}

const getChats = (user_id) => {
    let chats = []

    const result1 = getFriends(user_id)

    result1.forEach(friends => {
        let sql = `SELECT * FROM chats WHERE chat_source IN (${user_id}, ${friends.second_person}) AND chat_target IN (${user_id}, ${friends.second_person})`
        let result = syncsql.mysql(config, sql).data.rows

        chats.push(result)
    })

    return chats
}

const chatPageGetController = (req, res) => {
    const user_id = res.locals.user[0].user_id
    res.locals.notificationList = getNotifications(user_id)
    res.locals.unseenNotificationCount = getUnseenNotificationCount(user_id)
    res.locals.timePassed = timePassed
    res.locals.friendList = getFriends(user_id)
    res.locals.chats = getChats(user_id)
    resetOpenedChat(user_id)

    res.render("chat_page",res.locals)
}

module.exports = chatPageGetController