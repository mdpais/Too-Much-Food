const logout = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    const resJson = await response.json();
    alert(`${response.statusText} ${resJson.errors[0].message}`);
  }
};

document.getElementById("logout").addEventListener("click", logout);
