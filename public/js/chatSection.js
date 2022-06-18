$(document).ready(() => {

    const chat_section = document.querySelectorAll(".chat_section")
    const chat_to_friend_btn = document.querySelectorAll(".chat_section .back_to_friend_btn")
    const chat_option_btn = document.querySelectorAll(".chat_section .chat_option_btn")
    const emoji_btn = document.querySelectorAll('.chat_section .emoji_btn')
    const send_btn = document.querySelectorAll(".chat_section .send_btn")
    
    const sendMessage = (message, sender_id, receiver_id, time, message_status) => {
        $.ajax({
            url : "/chat",
            type : "POST",
            data : JSON.stringify({
                queryType : "send message",
                message : message,
                sender_id : sender_id,
                receiver_id : receiver_id,
                time : time
            }),
            contentType : "application/json",
            cache: false,
            processData : false,
            beforeSend : () => {
               
            },
            success : (response) => {
                if(response.error==0){

                    let status = ""
                    if(response.chat_seen==1){
                        status = `${time} <i class="chat_seen fas fa-check ml-1"></i>`
                    }
                    else{
                        status = `${time} <i class="fas fa-check ml-1"></i>`
                    }
                    message_status.innerHTML = status
                    message_status.setAttribute("id",`message_status_${response.chat_id}`)

                    // socket connection
                    const socket = io("ws://localhost:5000")

                    socket.emit("send_message", response.chat_id)  
                }
                else{

                    let status = `${time} <i class='chat_not_sent fas fa-exclamation-triangle'></i>`
                    message_status.innerHTML = status
                }
            },
            error : (error, errorType, message) => {
                console.log(error)
            }
        })
    }

    if(chat_section.length>0){

        chat_to_friend_btn.forEach(btn => {
            btn.addEventListener("click", e => {
                friend_section.style.zIndex = "20"
            })
        })

        send_btn.forEach(btn => {

            const sender_id = document.querySelector("#user_profile_photo").getAttribute("data-user_id")
            const receiver_id = btn.getAttribute("data-user_id")
            const chat_content = document.querySelector(`#chat_content_${receiver_id}`)

            btn.addEventListener("click", e => {
                
                
                const user_input = document.querySelector(`#user_input_${receiver_id}`)
                const input = user_input.value

                // getting current time
                const date = new Date()

                let time = ""
                let hours = date.getHours()
                let minutes = date.getMinutes()

                if(hours>12){
                    hours %=12
                    time = `${hours}:${minutes} pm`
                }
                else{
                    time = `${hours}:${minutes} am`
                }

                if(input!=""){
                    const date = new Date()
                    const curr_time = date.getTime()

                    const message = 
                    `<div class="message_container my-1 d-flex justify-content-end">
                        <div class="outgoing_message p-2 d-inline-block">
                            <p class="message">${input}</p>
                            <span id="message_status_${curr_time}" class="time pt-1 d-small">${time} <i class="far fa-clock ml-1"></i></span>
                        </div>
                    </div>
                    `
                    chat_content.insertAdjacentHTML("beforeend", message)
                    const message_status = document.querySelector(`#message_status_${curr_time}`)

                    user_input.value = ""

                    chat_content.scrollTop = chat_content.scrollHeight

                    sendMessage(input, sender_id, receiver_id, time, message_status)
                }
            })
        })
    }
})