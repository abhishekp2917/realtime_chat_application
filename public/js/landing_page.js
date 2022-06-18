const signin_switch = document.querySelector("#signin_switch")
const signup_switch = document.querySelector("#signup_switch")

const signin_container = document.querySelector("#signin_container")
const signup_container = document.querySelector("#signup_container")




signin_switch.addEventListener("click", e => {
    signin_container.style.display = "block"
    signup_container.style.display = "none"
    
    if(!signin_switch.classList.contains("active")){
        signin_switch.classList.add("active")
        signup_switch.classList.remove("active")
    }
    
})

signup_switch.addEventListener("click", e => {
    signup_container.style.display = "block"
    signin_container.style.display = "none"
    if(!signup_switch.classList.contains("active")){
        signup_switch.classList.add("active")
        signin_switch.classList.remove("active")
    }
})