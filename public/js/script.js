// show/hide password
const showPwdBtn = document.getElementById("passwordButton");
showPwdBtn.addEventListener("click", function() {
    const passwordInput = document.getElementById("account_password");
    const type = passwordInput.getAttribute("type");
    if (type === "password") {
        passwordInput.setAttribute("type", "text");
        showPwdBtn.innerHTML = "Hide Password";
    } else {
        passwordInput.setAttribute("type", "password");
        showPwdBtn.innerHTML = "Show Password";
    }
});