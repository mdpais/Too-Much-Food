const signinFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (email && password) {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      const resJson = await response.json();
      alert(`${response.statusText}\r${resJson.message}`);
    }
  }
};

document.getElementById("signinButton").addEventListener("click", signinFormHandler);
