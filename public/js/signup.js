const signupFormHandler = async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (name && email && password) {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      const myJson = await response.json();
      alert(`${response.statusText}\n${myJson.errors[0].message}`);
    }
  }
};

document.getElementById("signupButton").addEventListener("click", signupFormHandler);
