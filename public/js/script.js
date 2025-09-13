const API_URL = "http://localhost:7000/api/auth";
console.log("✅ script.js loaded");

//------------------Login--------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.error("❌ loginForm not found in DOM");
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const payload = Object.fromEntries(formData.entries());
    console.log("📤 Sending payload:", payload);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // mode:'same-origin',
        redirect: 'follow',
        credentials: "include", // ✅ must include cookies
        body: JSON.stringify(payload),
      });

      console.log("📩 Raw response:", res);
      const text = await res.text();
      console.log("📩 Response text:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("❌ Failed to parse JSON:", e);
        return alert("Invalid server response");
      }

      if (res.ok) {
        console.log(res.ok)
        localStorage.setItem("token", data.token);
        // alert("✅ Login successful");
        console.log("✅ Login successful");
        window.location.href = "/users";
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
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
// }
//-----------------------------Add User--------------------------

