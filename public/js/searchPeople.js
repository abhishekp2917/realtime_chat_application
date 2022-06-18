$(document).ready(() => {
    
    const sendFriendRequest = (add_friend_btn, sender_id, receiver_id) => {
        $.ajax({
            url : "/chat",
            type : "POST",
            data : JSON.stringify({
                queryType : "send friend request",
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
                    const parent = add_friend_btn.parentElement
                    parent.innerHTML = 
                    `<button class="cancel_friend_request_btn w-100 d-small p-2 mt-1 text-white" data-user_id="${receiver_id}">              
                        <i class="fa fa-ban mr-2" aria-hidden="true"></i>Cancel Request
                    </button>`

                    parent.firstChild.addEventListener("click", e => {
                        cancelFriendRequest(e.target, sender_id, receiver_id)
                    })
                }
            },
            error : (error, errorType, message) => {
                console.log(error)
            }
        })
    }

    const cancelFriendRequest = (cancel_btn, sender_id, receiver_id) => {
        $.ajax({
            url : "/chat",
            type : "POST",
            data : JSON.stringify({
                queryType : "cancel friend request",
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
                    const parent = cancel_btn.parentElement
                    parent.innerHTML = 
                    `<button class="add_friend_btn w-100 d-small p-2 mt-1 text-white" data-user_id="${receiver_id}">
                        <i class='fas fa-user-plus mr-2'></i>Add Friend
                    </button>`

                    parent.firstChild.addEventListener("click", e => {
                        sendFriendRequest(e.target, sender_id, receiver_id)
                    })
                }
            },
            error : (error, errorType, message) => {
                console.log(error)
            }
        })
    }

    const unfriendRequest = (unfriend_btn, sender_id, receiver_id) => {
        $.ajax({
            url : "/chat",
            type : "POST",
            data : JSON.stringify({
                queryType : "unfriend request",
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
                    const parent = unfriend_btn.parentElement
                    const friend_overview = document.querySelector(`#friend_overview_${receiver_id}`)

                    parent.innerHTML = 
                    `<button class="add_friend_btn w-100 d-small p-2 mt-1 text-white" data-user_id="${receiver_id}">
                        <i class='fas fa-user-plus mr-2'></i>Add Friend
                    </button>`

                    parent.firstChild.addEventListener("click", e => {
                        sendFriendRequest(e.target, sender_id, receiver_id)
                    })

                    friend_overview.remove()
                }
            },
            error : (error, errorType, message) => {
                console.log(error)
            }
        })
    }

    $("#search_people_btn").on("click", e => {

        const input_query = $("#search_people").val()
        const searched_people = $("#searched_people")
        const user_id = document.querySelector("#user_profile_photo").getAttribute("data-user_id")

        if(input_query!=""){

            $.ajax({
                url : "/chat",
                type : "POST",
                data : JSON.stringify({
                    queryType : "search people",
                    query : input_query,
                    user_id : user_id
                }),
                contentType : "application/json",
                cache: false,
                processData : false,
                beforeSend : () => {
                    $("#search_people_btn").prop("disabled", "disabled")
                },
                success : (response) => {
                    searched_people.html(response.data)
                    $("#search_people_btn").prop("disabled", "")
                    $("#search_people").val("")

                    const add_friend_btn = document.querySelectorAll(".add_friend_btn")
                    const remove_friend_btn = document.querySelectorAll(".remove_friend_btn")
                    const cancel_friend_request_btn = document.querySelectorAll(".cancel_friend_request_btn")

                    if(add_friend_btn){
                        add_friend_btn.forEach(btn => {
                            btn.addEventListener("click", e => {
                                const friend_id = btn.getAttribute("data-user_id")
                                sendFriendRequest(e.target, user_id, friend_id)
                            })
                        })
                    }

                    if(remove_friend_btn){
                        remove_friend_btn.forEach(btn => {
                            btn.addEventListener("click", e => {
                                const friend_id = btn.getAttribute("data-user_id")
                                unfriendRequest(e.target, user_id, friend_id)
                            })
                        })
                    }
                    
                    if(cancel_friend_request_btn){
                        cancel_friend_request_btn.forEach(btn => {
                            btn.addEventListener("click", e => {
                                const friend_id = btn.getAttribute("data-user_id")
                                cancelFriendRequest(e.target, user_id, friend_id)
                            })
                        })
                    }
                },
                error : (error, errorType, message) => {
                    console.log(error)
                }
            })
        }
    })
})