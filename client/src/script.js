const header = document.querySelector("header");

window.addEventListener ("scroll", function(){
    header.classList.toggle ("sticky", this.window.scrollY > 0);
})

const checkAuth = async () => {
    try {
        const response = await fetch('/checkAuth');
        const data = await response.json();
        var myDropdown = document.querySelector('.dropdown-menu')
        if (data.authenticated) {
            console.log('User is authenticated');
            window.location.href = "/acc"
        } else {
            console.log('User is not authenticated');
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
}

document.querySelector(".bx-user").addEventListener('click', checkAuth);


document.getElementById('exampleDropdownFormEmail1').addEventListener('input', function() {
    var email = this.value;
    var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    var loginButton = document.getElementById('loginButton');
    var regButton = document.getElementById('registrationButton');

    if (isValid) {
    this.classList.remove('is-invalid');
    loginButton.removeAttribute('disabled');
    regButton.removeAttribute('disabled');
} else {
    this.classList.add('is-invalid');
    loginButton.setAttribute('disabled', 'disabled');
    regButton.setAttribute('disabled', 'disabled');
}
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    var buttonClicked = event.submitter;
    if (buttonClicked.id === 'registrationButton') {
        submitForm.call(this, event, '/registration');
    }
    if (buttonClicked.id === 'loginButton') {
        submitForm.call(this, event, '/login');
    }

});

function submitForm(event, endpoint) {

    var formData = new FormData(this);
    var jsonData = {};

    formData.forEach(function(value, key) {
        jsonData[key] = value;
    });

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if(!response.ok){
                showErrorPopper("Invalid password or login");
            }
          return  response.json()
        })
        .then(data => {
            if(endpoint === "/registration") {
                localStorage.setItem("userID", data.id)
                window.location.href = "/acc"
            }else {
                localStorage.setItem('userID' , data.user.id);
                window.location.href = "/acc"
            }
        })


}
function showErrorPopper(message) {
    const errorPopper = document.getElementById("errorPopper");
    const errorText = document.getElementById("errorText");

    errorText.innerText = message;
    errorPopper.style.display = "block";

    setTimeout(function() {
        errorPopper.style.display = "none";
    }, 3000); // Hide the popper after 3 seconds (adjust as needed)
}