const socket = io("ws://localhost:5000")

socket.on("connect", () => {
    const user_id = document.querySelector("#user_profile_photo").getAttribute("data-user_id")
    socket.emit("online", user_id)

    socket.on("online", friend_id => {
        const activity_status = document.querySelector(`#activity_status_${friend_id}`)
        if(activity_status){
            activity_status.innerHTML = "Online"
        }
    })
    
    socket.on("offline", friend_id => {
        const activity_status = document.querySelector(`#activity_status_${friend_id}`)
        if(activity_status){
            activity_status.innerHTML = ""
        }
    })
    
    socket.on("receive_message", (chat, friend) => {
        const friend_id = chat.chat_source
        const chat_content = document.querySelector(`#chat_content_${friend_id}`)
        const message = 
        `<div id="message_container_${chat.chat_id}" data-source="${chat.chat_source}" data-target="${chat.chat_target}" class="message_container my-1 d-flex">
            <div class="income_message bg-white p-2 d-inline-block">
                <p class="message">${chat.chat_content}</p>
                <span class="time pt-1 d-small">${chat.chat_time}</span>
            </div>
        </div>`

        if(chat_content){
            chat_content.innerHTML += message
        }    
        // send new message notification
        if(friend.chat_opened!=1){
            const new_msg_count = document.querySelector(`#new_msg_count_${friend.second_person}`)
            if(new_msg_count){
                if(new_msg_count.classList.contains("d-none")){
                    new_msg_count.classList.remove("d-none")
                    new_msg_count.innerHTML = 1
                }
                else{
                    new_msg_count.innerHTML = parseInt(new_msg_count.innerHTML)+1
                }
            }
        }
    })

    socket.on("message_seen", chats_id => {
        console.log("client seen")
        chats_id.forEach(id => {
            let message_status = document.querySelector(`message_status_${id}`)
            console.log(message_status)
            message_status.lastChild().classList.add("chat_seen")
        });
    })
    
})





