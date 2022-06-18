$(document).ready(() => {

    const acceptFriendRequest = (accept_btn, sender_id, receiver_id) => {
        $.ajax({
            url : "/chat",
            type : "POST",
            data : JSON.stringify({
                queryType : "accept friend request",
                sender_id : sender_id,
                receiver_id : receiver_id
            }),
            contentType : "application/json",
            cache: false,
            processData : false,
            beforeSend : () => {
               
            },
            success : (response) => {
                if(response.error==0){
  
                    const parent = accept_btn.parentElement.parentElement.parentElement

                    parent.innerHTML = response.data1

                    location.assign("/chat")
                }
            },
            error : (error, errorType, message) => {
                console.log(error)
            }
        })
    }

    const rejectFriendRequest = (reject_btn, sender_id, receiver_id) => {
        $.ajax({
            url : "/chat",
            type : "POST",
            data : JSON.stringify({
                queryType : "reject friend request",
                sender_id : sender_id,
                receiver_id : receiver_id
            }),
            contentType : "application/json",
            cache: false,
            processData : false,
            beforeSend : () => {
               
            },
            success : (response) => {
                if(response.error==0){
                    const parent = reject_btn.parentElement.parentElement.parentElement
                    parent.innerHTML = ""
                }
            },
            error : (error, errorType, message) => {
                console.log(error)
            }
        })
    }

    const getNotification = (user_id) => {
        $.ajax({
            url : "/chat",
            type : "POST",
            data : JSON.stringify({
                queryType : "new notification",
                user_id : user_id,
            }),
            contentType : "application/json",
            cache: false,
            processData : false,
            beforeSend : () => {
               
            },
            success : (response) => {
                if(response.error==0){
                    $("#notification_count").addClass("d-none")
                }
            },
            error : (error, errorType, message) => {
                console.log(error)
            }
        })
    }

    notification_btn.addEventListener("click", e => {
        notification_section.style.left = "0"
        const user_id = document.querySelector("#user_profile_photo").getAttribute("data-user_id")
        getNotification(user_id)
    })
    
    notification_to_friend_btn.addEventListener("click", e => {
        notification_section.style.left = "-100%"
        const unseen_notifications = $(".new_notification")

        if(unseen_notifications.length>0){
            unseen_notifications.each((idx, notification) => {
                notification.classList.remove("new_notification")
            })
        }
    })

    accept_request_btn.forEach(btn => {
        const user_id = document.querySelector("#user_profile_photo").getAttribute("data-user_id")
        const receiver_id = btn.getAttribute("data-user_id")

        btn.addEventListener("click", e => {
            acceptFriendRequest(e.target, user_id, receiver_id)
        })
    })

    reject_request_btn.forEach(btn => {
        const user_id = document.querySelector("#user_profile_photo").getAttribute("data-user_id")
        const receiver_id = btn.getAttribute("data-user_id")
        btn.addEventListener("click", e => {
            rejectFriendRequest(e.target, user_id, receiver_id)
        })
    })
})