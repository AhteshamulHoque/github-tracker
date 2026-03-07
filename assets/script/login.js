document.getElementById("signin-btn").addEventListener("click", function() {


    const inputName = document.getElementById("input-name");
    const userName = inputName.value;
    console.log(userName);
    

    const passInput = document.getElementById("input-pass");
    const userPass = passInput.value;
    console.log(userPass);
    

    if(userName === "admin" && userPass === "admin123"){
        alert("Login Successful ");
       window.location.assign("home.html");
    }
    else{
        alert("Invalid Username or Password ");
    }

});