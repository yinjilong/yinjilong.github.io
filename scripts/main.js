let logo_img = document.querySelector("#logo-img")
// logo_img.textContent="STOPPAGE LOGGER"
log_child = logo_img.children
// logo_img.textContent="STOPPAGE LOGGER"

let show_pass_elem = document.querySelector("#show-pass")
let pass_input_elem = document.querySelector("#pass-input")

show_pass_elem.onclick = function () {
    let input_type = pass_input_elem.getAttribute("type")
    if (input_type == "password") {
        pass_input_elem.setAttribute("type", "text")
        show_pass_elem.setAttribute("src", "images/eye-open.png")
    }
    else {
        pass_input_elem.setAttribute("type", "password")
        show_pass_elem.setAttribute("src", "images/eye-slash.png")
    }
}

let username_login_btn = document.querySelector("#username-login")
let anonymous_login_btn = document.querySelector("#anonymous-login")
username_login_btn.onclick = function () {
    let myName = document.querySelector("#username-input").value
    setUserName(myName)
}
anonymous_login_btn.onclick = function () {
    let myName = "anonymous"
    setUserName(myName)
}

function setUserName(myName) {
    if (!myName) {
        document.querySelector("#welcome-msg").textContent = 'Please input username/password or choose anonymouse to login '
    } else {
        localStorage.setItem('username', myName);
        document.querySelector("#welcome-msg").textContent = 'Welcome ' + myName
    }
}