const icons = document.querySelectorAll(".nav-link");
function currentIcon(event) {
  console.log("ok");
  icons.forEach((icon) => icon.classList.remove("active"));
  event.target.classList.add("active");
}

icons.forEach((icon) => {
  icon.addEventListener("click", currentIcon);
});

if (window.location.href.split("/")[3] != "homes") {
  document.getElementById("dropdawn-filter").classList.add("disabled");
  document.getElementById("serch-container").classList.add("disabled");
} else {
  document.getElementById("dropdawn-filter").classList.remove("disabled");
  document.getElementById("serch-container").classList.remove("disabled");
}

const loader = document.getElementById("loader-container");
window.addEventListener("load", function (e) {
  setTimeout(function () {
    loader.style.display = "none";
  }, 1000);
});


var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/66ead71183ab531891e89aff/1i82lg7a2';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
