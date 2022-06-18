const connection = require("../model/config")
const syncsql = require("sync-sql")

const config = {
    host : "localhost",
    user : "root",
    password : "",
    database: "chat_application",
}

const chatPagePostController = (req, res) => {

    const queryType = req.body.queryType

    if(queryType=="search people"){

        const query = req.body.query

        var data = ""
         
        const sql1 = `SELECT * FROM users WHERE users.user_name LIKE '%${query}%'`

        const people = syncsql.mysql(config,sql1).data.rows

        if(people.length!=0){

            people.forEach(user => {

                var person1_id = req.body.user_id
                var person2_id = user.user_id

                if(person1_id!=person2_id){
                
                    const sql2 = `SELECT * FROM friends WHERE (first_person=${person1_id} AND second_person=${person2_id}) OR (first_person=${person2_id} AND second_person=${person1_id})`
                    
                    const friend = syncsql.mysql(config,sql2).data.rows
                    
                    data +=
                        `<li class="friend_overview d-flex p-2 px-3 bg-white">
                            <button class="see_info_btn img_container mr-3 d-flex justify-content-center align-items-center">
                                <img class="friend_profile_img" src="assets/user_profile/${user.user_profile_photo}" alt="profile_photo">
                            </button>
                            <div class="friend_info d-flex flex-column w-100 position-relative">
                                <p>${user.user_name}</p>
                                <div>`
                                if(friend.length==0){
                                    data+=  
                                    `<button class="add_friend_btn w-100 d-small p-2 mt-1 text-white" data-user_id="${user.user_id}">
                                        <i class='fas fa-user-plus mr-2'></i>Add Friend
                                    </button>`
                                }
                                else if(friend[0].status=="pending"){
                                    data +=
                                    `<button class="cancel_friend_request_btn w-100 d-small p-2 mt-1 text-white" data-user_id="${user.user_id}">              
                                            <i class="fa fa-ban mr-2" aria-hidden="true"></i>Cancel Request
                                    </button>`
                                }
                                else if(friend[0].status=="friend"){
                                    data += 
                                    `<button class="remove_friend_btn w-100 d-small p-2 mt-1 text-white" data-user_id="${user.user_id}">
                                            <i class="fa fa-user-times mr-2" aria-hidden="true"></i>Unfriend
                                    </button>`
                                }
                    data +=            
                                `</div>
                            </div>
                        </li>`
                }
            })

            res.status(201).json({
                data : data
            })
        }
        else{
            res.status(201).json({
                data : `<div class="p-2 d-flex justify-content-center bg-white align-items-center"><i class="material-icons mr-2">sentiment_very_dissatisfied</i><div>User not found</div></div>`
            })
        }
    }
    else if(queryType=="send friend request"){
        const person1_id = req.body.sender_id
        const person2_id = req.body.receiver_id

        const sql1 = `INSERT INTO friends (first_person, second_person, status, chat_opened) VALUES (${person1_id}, ${person2_id}, 'pending', 0)`

        const result1 = syncsql.mysql(config, sql1).data.rows.affectedRows

        const sql2 = `INSERT INTO friends (first_person, second_person, status, chat_opened) VALUES (${person2_id}, ${person1_id}, 'pending', 0)`

        const result2 = syncsql.mysql(config, sql2).data.rows.affectedRows

        const date = new Date()

        const sql3 = `INSERT INTO notifications (notify_source, notify_target, notify_type, notify_time, notify_seen) VALUES (${person1_id}, ${person2_id}, 'friend request', ${parseInt(date.getTime()/1000)}, 0)`

        const result3 = syncsql.mysql(config, sql3).data.rows.affectedRows

        if(result1>0 && result2>0 && result3>0){
            res.status(201).json({
                error : 0,
            })
        }
        else{
            console.log("send friend request error")
        }
    }
    else if(queryType=="cancel friend request"){

        const person1_id = req.body.sender_id
        const person2_id = req.body.receiver_id

        const sql1 = `DELETE FROM friends WHERE (first_person=${person1_id} AND second_person=${person2_id}) OR (first_person=${person2_id} AND second_person=${person1_id})`

        const result1 = syncsql.mysql(config, sql1).data.rows.affectedRows

        const sql2 = `DELETE FROM notifications WHERE notify_source=${person1_id} AND notify_target=${person2_id} AND notify_type='friend request'`

        const result2 = syncsql.mysql(config, sql2).data.rows.affectedRows

        if(result1>0 && result2>0){
            res.status(201).json({
                error : 0,
            })
        }
        else{
            console.log("cancel friend request error")
        }
    }
    else if(queryType=="unfriend request"){
        const person1_id = req.body.sender_id
        const person2_id = req.body.receiver_id

        const sql1 = `DELETE FROM friends WHERE first_person IN (${person1_id},${person2_id}) AND second_person IN(${person2_id}, ${person1_id})`

        const result1 = syncsql.mysql(config, sql1).data.rows.affectedRows

        const date = new Date()

        const sql2 = `INSERT INTO notifications (notify_source, notify_target, notify_type, notify_time, notify_seen) VALUES (${person1_id}, ${person2_id}, 'unfriend request', ${parseInt(date.getTime()/1000)}, 0)`

        const result2 = syncsql.mysql(config, sql2).data.rows.affectedRows

        if(result1>0 && result2>0){
            res.status(201).json({
                error : 0,
            })
        }
        else{
            console.log("unfriend request error")
        }

    }
    else if(queryType=="accept friend request"){
        const person1_id = req.body.sender_id
        const person2_id = req.body.receiver_id

        const sql1 = `UPDATE friends SET status='friend' WHERE first_person IN (${person1_id},${person2_id}) AND second_person IN(${person2_id}, ${person1_id})`

        const result1 = syncsql.mysql(config, sql1).data.rows.affectedRows

        const date = new Date()

        const sql2 = `INSERT INTO notifications (notify_source, notify_target, notify_type, notify_time, notify_seen) VALUES (${person1_id}, ${person2_id}, 'accept friend request', ${parseInt(date.getTime()/1000)}, 0)`

        const result2 = syncsql.mysql(config, sql2).data.rows.affectedRows

        const sql3 = `DELETE FROM notifications WHERE notify_source=${person2_id} AND notify_target=${person1_id} AND notify_type='friend request'`

        const result3 = syncsql.mysql(config, sql3).data.rows.affectedRows

        const sql4 = `SELECT * FROM users WHERE user_id=${person2_id}`

        const result4 = syncsql.mysql(config, sql4).data.rows

        if(result1>0 && result2>0 && result3>0){
            const data1 = `<div class="p-2 d-flex justify-content-center align-items-center"><i class="material-icons mr-2">mood</i><div>You and ${result4[0].user_name} are now friends</div></div>`

            res.status(201).json({
                error : 0,
                data1 : data1,
            })
        }
        else{
            console.log("accept friend request error")
        }

    }
    else if(queryType=="reject friend request"){
        const person1_id = req.body.sender_id
        const person2_id = req.body.receiver_id

        const sql1 = `DELETE FROM friends WHERE first_person IN (${person1_id},${person2_id}) AND second_person IN(${person2_id}, ${person1_id})`

        const result1 = syncsql.mysql(config, sql1).data.rows.affectedRows

        const date = new Date()

        const sql2 = `INSERT INTO notifications (notify_source, notify_target, notify_type, notify_time, notify_seen) VALUES (${person1_id}, ${person2_id}, 'reject friend request', ${parseInt(date.getTime()/1000)}, 0)`

        const result2 = syncsql.mysql(config, sql2).data.rows.affectedRows

        const sql3 = `DELETE FROM notifications WHERE notify_source=${person2_id} AND notify_target=${person1_id} AND notify_type='friend request'`

        const result3 = syncsql.mysql(config, sql3).data.rows.affectedRows

        if(result1>0 && result2>0 && result3>0){
            res.status(201).json({
                error : 0,
            })
        }
        else{
            console.log("reject friend request error")
        }
    }
    else if(queryType=="new notification"){

        const sql = `UPDATE notifications set notify_seen=1 WHERE notify_target=${req.body.user_id} AND notify_seen=0`

        const result = syncsql.mysql(config, sql).data.rows.affectedRows

        res.status(201).json({
            error : 0,
        })
    }
    else if(queryType=="open chat"){

        const sql1 = `SELECT * FROM friends WHERE first_person=${req.body.user_id} AND second_person=${req.body.friend_id} AND status='friend'`

        const result1 = syncsql.mysql(config, sql1).data.rows

        if(result1.length>0){

            const sql2 = `UPDATE friends SET unseen_chats=0 WHERE first_person=${req.body.user_id} AND second_person=${req.body.friend_id}`

            const result2 = syncsql.mysql(config, sql2).data.rows.affectedRows

            const sql3 = `UPDATE friends SET chat_opened=0 WHERE first_person=${req.body.user_id}`

            const result3 = syncsql.mysql(config, sql3).data.rows.affectedRows
            
            const sql4 = `UPDATE friends SET chat_opened=1 WHERE first_person=${req.body.user_id} AND second_person=${req.body.friend_id}`

            const result4 = syncsql.mysql(config, sql4).data.rows.affectedRows

            const sql5 = `UPDATE chats SET chat_seen=1 WHERE chat_source=${req.body.user_id} AND chat_target=${req.body.friend_id}`

            const result5 = syncsql.mysql(config, sql5).data.rows.affectedRows


            if(result2>0 && result3>0 && result4>0){
                res.status(201).json({
                    error : 0
                })
            }
            else{
                console.log("open chat error")
            }
        }
        else{
            res.json({
                error: 1
            })
        }
    }
    else if(queryType=="send message"){
        const sender_id = req.body.sender_id
        const receiver_id = req.body.receiver_id
        const message = req.body.message
        const time = req.body.time

        const sql1 = `SELECT * FROM friends WHERE first_person=${receiver_id} AND second_person=${sender_id} AND status='friend'`

        const result1 = syncsql.mysql(config, sql1).data.rows

        // check if they are friends or not
        if(result1.length>0){
            var sql2 = ""
            var sql3 = ""

            const date = new Date()
            const curr_date = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`

            if(result1[0].chat_opened==1){
                sql2 = `INSERT INTO chats (chat_content, chat_source, chat_target, chat_time, chat_seen) VALUES ('${message}', ${sender_id}, ${receiver_id}, '${time}', 1)`
                sql3 = `UPDATE friends SET unseen_chats=unseen_chats+0 WHERE friends.first_person=${receiver_id} AND friends.second_person=${sender_id}`
            }
            else{
                sql2 = `INSERT INTO chats (chat_content, chat_source, chat_target, chat_time, chat_seen) VALUES ('${message}', ${sender_id}, ${receiver_id}, '${time}', 0)`
                sql3 = `UPDATE friends SET unseen_chats=unseen_chats+1 WHERE friends.first_person=${receiver_id} AND friends.second_person=${sender_id}`
            }

            const sql4 = `UPDATE users SET last_chat='${message}', last_chat_date='${curr_date}' WHERE users.user_id IN (${receiver_id}, ${sender_id})`

            // insert chats
            const result2 = syncsql.mysql(config, sql2).data.rows

            // update unsen chats count
            const result3 = syncsql.mysql(config, sql3).data.rows.affectedRows

            // update last chat
            const result4 = syncsql.mysql(config, sql4).data.rows.affectedRows 

            if(result2.affectedRows>0 && result3>0 && result4>0){

                if(result1[0].chat_opened==1){
                    res.status(201).json({
                        error: 0,
                        chat_seen : 1,
                        chat_id : result2.insertId
                    }) 
                }
                else{
                    res.status(201).json({
                        error: 0,
                        chat_seen : 0,
                        chat_id : result2.insertId
                    }) 
                }
            }
            else{
                console.log("send message error")
            }
        }
        else{
            res.json({
                error: 1,
                chat_seen : 0
            })
        }
    }
}

module.exports = chatPagePostController