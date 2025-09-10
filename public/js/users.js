document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/api/auth/login"; // force login
    return;
  }

  fetch("/users/list", {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/api/auth/login";
      }
      return res.json();
    })
    .then(data => {
      const listContainer = document.getElementById("userList");
      listContainer.innerHTML = data.users
        .map(user => `<li>${user.name} - ${user.email}</li>`)
        .join("");
    })
    .catch(err => console.error("Error fetching users:", err));
});
