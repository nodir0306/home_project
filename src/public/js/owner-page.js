const icons = document.querySelectorAll(".nav-link");
function currentIcon(event) {
    console.log("ok")
    icons.forEach(icon => icon.classList.remove('active'));
    event.target.classList.add('active');
}

icons.forEach(icon => {
    icon.addEventListener('click', currentIcon);
});


const loader = document.getElementById("loader-container");
window.addEventListener("load", function(e) {
    setTimeout(function() {
        loader.style.display = "none";
    }, 1000);
});
