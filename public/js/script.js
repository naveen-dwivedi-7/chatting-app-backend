const API_URL = "http://localhost:7000/api/auth";
console.log("✅ script.js loaded");

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
        window.location.href = "/user/dashboard";
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("Something went wrong");
    }
  });
});



// document.addEventListener("DOMContentLoaded", () => {
//   const loginForm = document.getElementById("loginForm");
//   const debugEl = document.getElementById("debugOutput");

//   if (!loginForm) {
//     console.error("loginForm not found. Check the form id in your HTML.");
//     if (debugEl) debugEl.textContent = "loginForm not found. Check the form id.";
//     return;
//   }

//   loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     // Build payload from FormData
//     const formData = new FormData(loginForm);
//     const payload = Object.fromEntries(formData.entries());

//     // Show payload clearly
//     console.log("Login payload:", payload);
//     console.table(payload);
//     if (debugEl) debugEl.textContent = "Payload:\n" + JSON.stringify(payload, null, 2);

//     try {
//       const res = await fetch(`${API_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       // Read response safely (handle non-JSON responses)
//       const contentType = res.headers.get("content-type") || "";
//       let data;
//       if (contentType.includes("application/json")) {
//         data = await res.json();
//       } else {
//         // fallback: try text -> parse JSON if possible
//         const text = await res.text();
//         try { data = JSON.parse(text); }
//         catch (err) { data = { text }; }
//       }

//       // Debug info
//       console.log("Response status:", res.status, res.statusText);
//       console.log("Response headers:", Object.fromEntries(res.headers.entries()));
//       console.log("Response body:", data);
//       if (debugEl) {
//         debugEl.textContent += "\n\nResponse:\n" + JSON.stringify({ status: res.status, body: data }, null, 2);
//       }

//       // Handle response
//       if (res.ok) {
//         // ✅ Save token to localStorage
//         if (data && data.token) {
//           localStorage.setItem("token", data.token);
//         }

//         alert("Login successful!");

//         // ✅ Redirect to dashboard
//         window.location.href = "/dashboard";
//       } else {
//         alert(data.error || "Login failed");
//       }


//     } catch (err) {
//       // Network/CORS errors end up here (e.g. "TypeError: Failed to fetch")
//       console.error("Fetch failed:", err);
//       if (debugEl) debugEl.textContent += "\n\nFetch error:\n" + String(err);
//       alert("Network/CORS error — check console and Network tab for details");
//     }
//   });
// });
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