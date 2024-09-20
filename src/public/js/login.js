const toggleForm = () => {
  const container = document.querySelector(".container");
  container.classList.toggle("active");
};

// login

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      phone: document.querySelector('input[name="phone"]').value,
      password: document.querySelector('input[name="password"]').value,
    };
    fetch("http://127.0.0.1:8080/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === "banned") {
          Swal.fire({
            icon: "info",
            title: "BAN",
            text: "You have been blocked by our admins because you have not followed the rules of the system",
            footer: '<a href="http://127.0.0.1:8080/support">Complaint</a>',
          });
        } else if (data.token) {
          const loginTime = new Date().getTime();
          localStorage.setItem("jwtToken", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("userRole", data.role);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("loginTime", loginTime);
          getUserAgent(data.userId)
          switch (data.role) {
            case "user":
              window.location.href = "http://127.0.0.1:8080/homes";
              break;
            case "owner":
              window.location.href = "http://127.0.0.1:8080/owner";
              c;
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "User is not defined",
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  });

// register

document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = {
    phone: document.querySelector('input[name="phone_register"]').value,
    password: document.querySelector('input[name="password_register"]').value,
    name: document.querySelector('input[name="name"]').value,
    surname: document.querySelector('input[name="surname"]').value,
    email: document.querySelector('input[name="email"]').value,
    password_repeat: document.querySelector('input[name="password_repeat"]')
      .value,
  };

  fetch("http://127.0.0.1:8080/api/v1/users/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "created") {
        Swal.fire({
          icon: "success",
          title: "Succesfully",
          text: `Created user`,
        }).then(() => {
          window.location.href = "http://127.0.0.1:8080/login";
        });
      } else if (data.name == "Validation error") {
        Swal.fire({
          icon: "error",
          title: "Validation error",
          text: `${data.message}`,
        });
      } else if (data.name == "Database Validation error") {
        Swal.fire({
          title: "Database error",
          text: `${data.message}`,
          icon: "error",
        });
      }
    });
});

const resetPassFunc = async () => {
  try {
    const { value: email } = await Swal.fire({
      title: "Input email address",
      input: "email",
      inputLabel: "Your email address",
      inputPlaceholder: "Enter your email address",
    });

    if (email) {
      const response = await fetch(
        `http://127.0.0.1:8080/api/v1/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Check email",
          text: `Your password reset link has been sent to ${email}`,
        });
      } else if (data.name === "Not Found") {
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "User not found. Please try again.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Internal server error. Please try again later.",
        });
      }
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Internal server error. Please try again later.",
    });
  }
};

const signWithOtp = async () => {
  try {
    const { value: email } = await Swal.fire({
      title: "Input email address",
      input: "email",
      inputLabel: "Your email address",
      inputPlaceholder: "Enter your email address",
    });

    if (email) {
      const response = await fetch(
        `http://127.0.0.1:8080/api/v1/auth/generate-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Check email",
          text: `Your One Time Password sended to:  ${email}`,
        }).then(() => {
          localStorage.setItem("userOneTimeId", data.userId);
          window.location.href = "http://127.0.0.1:8080/login-otp";
        });
      } else if (data.name === "Not Found") {
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "User not found. Please try again.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Internal server error. Please try again later.",
        });
      }
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Internal server error. Please try again later.",
    });
  }
};

const getUserAgent = (userId) => {
  const user = window.navigator.userAgent;
  fetch("http://127.0.0.1:8080/api/v1/activity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({user,userId}),
  }).then(response =>{
    if(!response.ok){
      Swal.fire({
        icon: "error",
        title: "There was an error retrieving your device information",
      });
    }
  })
};
