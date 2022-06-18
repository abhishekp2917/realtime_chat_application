$(document).ready(() => {

    people_btn.addEventListener("click", e => [
        search_people_section.style.left = "0"
    ])
    
    people_to_friend_btn.addEventListener("click", e => {
        search_people_section.style.left = "-100%"
    })
})
