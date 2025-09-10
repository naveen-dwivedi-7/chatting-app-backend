const API_URL = "http://localhost:7000/api/auth";


//-------------Login----------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const payload = Object.fromEntries(formData.entries());
    console.log("Login payload:", payload);


    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save token to localStorage
        localStorage.setItem("token", data.token);
        alert("Login successful!");

        // Redirect to profile page
        window.location.href = "/users/list";
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  });
});

//---------------------Logout--------------------------------


document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token"); // clear token
            alert("You have been logged out ✅");
            window.location.href = "/api/auth/login"; // redirect to login
        });
    }
});

//-----------------------list----------------------------------------------

 // ✅ Fetch users when page loads
    // document.addEventListener("DOMContentLoaded", async () => {
    //   const token = localStorage.getItem("token");
    //   if (!token) {
    //     // If no token, redirect back to login
    //     window.location.href = "/api/auth/login";
    //     return;
    //   }

    //   try {
    //     const res = await fetch("/users/list", {
    //       headers: {
    //         "Authorization": "Bearer " + token
    //       }
    //     });

    //     if (!res.ok) {
    //       throw new Error("Unauthorized or token expired");
    //     }

    //     const data = await res.json();

    //     // Fill username
    //     document.getElementById("username").textContent = data.currentUser?.name || "";

    //     // Populate table
    //     const tbody = document.querySelector("#usersTable tbody");
    //     tbody.innerHTML = "";
    //     data.users.forEach(user => {
    //       tbody.innerHTML += `
    //         <tr>
    //           <td>${user.id}</td>
    //           <td>${user.name}</td>
    //           <td>${user.email}</td>
    //           <td>${user.phone}</td>
    //           <td>${user.profile_image ? `<img src="/uploads/${user.profile_image}" width="50">` : "N/A"}</td>
    //         </tr>
    //       `;
    //     });

    //   } catch (err) {
    //     console.error(err);
    //     alert("Session expired, please login again.");
    //     localStorage.removeItem("token");
    //     window.location.href = "/api/auth/login";
    //   }
    // });