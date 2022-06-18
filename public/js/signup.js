$(document).ready(() => {

    const signupFormError = document.querySelector("#signup_form_error")
    signupFormError.style.display = "none"

    $("#signup_form").on("submit", e => {

        e.preventDefault()

        const signupBtn = $("#signup_btn")

        const username = $("#signup_name").val()
        const email = $("#signup_email").val()
        const password = $("#signup_password").val()
        const confirmPassword = $("#signup_confirm_password").val()

        isValid = true
        errorMessage = ""

        if(password.length<8){
            isValid = false
            errorMessage = "Password too short"
        }
        else if(password!=confirmPassword){
            isValid = false
            errorMessage = "Password and Confirm Password doesn't match"
        }
        
        if(isValid){
            $.ajax({
                url : $(this).attr("action"),
                type : "POST",
                data : JSON.stringify({
                    username : username,
                    email : email,
                    password : password,
                    process : "signup"
                }),
                contentType : "application/json",
                cache: false,
                processData : false,
                beforeSend : () => {
                    signupBtn.prop("disabled", "disabled")
                },
                success : (response) => {
                    if(response.error>0){
                        signupBtn.prop("disabled", "")
                        signupFormError.style.display = "inline-block"
                        signupFormError.innerHTML = response.errorMessage
                    }
                    else{
                        signupFormError.style.display = "none"
                        $("#signup_name").val("")
                        $("#signup_email").val("")
                        $("#signup_password").val("")
                        $("#signup_confirm_password").val("")
                        location.assign("/chat")
                    }
                },
                error : (error, errorType, message) => {
                    console.log(error)
                }
            })
        }
        else{
            signupFormError.style.display = "inline-block"
            signupFormError.innerHTML = errorMessage
        }
    })
})