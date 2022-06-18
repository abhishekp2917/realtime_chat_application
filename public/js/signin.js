$(document).ready(() => {

    const signinFormError = document.querySelector("#signin_form_error")
    signinFormError.style.display = "none"

    $("#signin_form").on("submit", e => {

        e.preventDefault()

        const signinBtn = $("#signin_btn")

        const username = $("#signin_name").val()
        const password = $("#signin_password").val()

        $.ajax({
            url : $(this).attr("action"),
            type : "POST",
            data : JSON.stringify({
                username : username,
                password : password,
                process : "signin"
            }),
            contentType : "application/json",
            cache: false,
            processData : false,
            beforeSend : ()=> {
                signinBtn.prop("disabled", "disabled")
            },
            success : (response) => {
                if(response.error==0){
                    location.assign("/chat")
                }
                else{
                    signinFormError.style.display = "inline-block"
                    signinFormError.innerHTML = response.errorMessage
                    signinBtn.prop("disabled", "")
                }
            },
            error : (error, errorType, message) => {
                console.log(error)
            }
        })
    })
})