$(document).ready(() => {

    // open chat section of specific friend
    const openChat = (clicked_elem, user_id, friend_id) => {
        // socket connection
        const socket = io("ws://localhost:5000")

        socket.emit("chat_open", {
            user_id : user_id,
            friend_id: friend_id
        })
        
        $.ajax({
            url : "/chat",
            type : "POST",
            data : JSON.stringify({
                queryType : "open chat",
                user_id : user_id,
                friend_id : friend_id,
            }),
            contentType : "application/json",
            cache: false,
            processData : false,
            beforeSend : () => {
               
            },
            success : (response) => {
                if(response.error==0){
                    // hide new message notification
                    const new_msg_count = document.querySelector(`#new_msg_count_${friend_id}`)
                    if(!new_msg_count.classList.contains("d-none")){
                        new_msg_count.classList.add("d-none")
                    }

                    // make clicked list active
                    const friend_overview = document.querySelectorAll(".friend_overview.active")
                    if(friend_overview.length>0){
                        friend_overview.forEach((elem) => {
                            elem.classList.remove("active")
                        })
                    }
                    clicked_elem.classList.add("active")

                    // show friend chat section
                    const friend_chat_section = document.querySelector(`#chat_section_${friend_id}`)
                    const other_chat_section = document.querySelectorAll(".chat_section.d-flex")
                    if(other_chat_section.length>0){
                        other_chat_section.forEach((elem) => {
                            elem.classList.replace("d-flex", "d-none")
                        })
                    }
                    friend_chat_section.classList.replace("d-none", "d-flex")
                }
            },
            error : (error, errorType, message) => {
                console.log(error)
            }
        })
    }

    friend_overview.forEach( elem => {
        elem.addEventListener("click", e => {
            const user_id = document.querySelector("#user_profile_photo").getAttribute("data-user_id")
            const friend_id = elem.getAttribute("data-user_id")
            openChat(elem, user_id, friend_id)
            // hide friend list section
            friend_section.style.zIndex = "1"
            const chat_content = document.querySelector(`#chat_content_${friend_id}`)
            chat_content.style.overflow = "scroll"
            console.log(chat_content.scrollHeight, chat_content)
        })
    })

    // search friend in friend list
    search_chat_input.addEventListener("keyup", () => {

        const query = search_chat_input.value.toLowerCase()

        const chatList = document.querySelectorAll(".friend_overview .friend_name")

        // hide unmatched query element
        if(chatList.length>0){
            chatList.forEach(chat => {
                if(chat.parentElement.parentElement.parentElement.classList.contains("d-none")){
                    chat.parentElement.parentElement.parentElement.classList.replace("d-none","d-flex")
                }
                if(chat.innerHTML.toLowerCase().indexOf(query)<0){
                    chat.parentElement.parentElement.parentElement.classList.replace("d-flex","d-none")
                }
            })
        }
    })
    
})
