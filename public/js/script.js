console.log("✅ script.js loaded successfully");

const API_URL = "http://localhost:5000/api/auth";





//-----------Login----------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg"); // make sure this exists in HTML
  const API_URL = "http://localhost:5000/api/auth";

  if (loginForm) {
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

        let result;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          result = await res.json();
        } else {
          const text = await res.text();
          throw new Error(text);
        }

        if (res.ok) {
          localStorage.setItem("token", result.token);
          loginMsg && (loginMsg.innerHTML = `<p class="text-success">✅ Login successful</p>`);
          setTimeout(() => {
            window.location.href = "/api/auth/users/list";
          }, 1000);
        } else {
          loginMsg && (loginMsg.innerHTML = `<p class="text-danger">❌ ${result.error}</p>`);
        }
      } catch (err) {
        console.error("Login error:", err);
        loginMsg && (loginMsg.innerHTML = `<p class="text-danger">⚠️ Something went wrong</p>`);
      }
    });
  }
});

//--------------------Logout-----------------------------------------------

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

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    const loginLink = document.querySelector('a[href="/api/auth/login"]');
    const registerLink = document.querySelector('a[href="/api/auth/register"]');
    const logoutBtn = document.getElementById("logoutBtn");

    if (token) {
        // User logged in → hide login/register
        if (loginLink) loginLink.style.display = "none";
        if (registerLink) registerLink.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        // User not logged in → hide logout
        if (logoutBtn) logoutBtn.style.display = "none";
    }
});


// ---------- REGISTER -------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const registerMsg = document.getElementById("registerMsg");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(registerForm);
      const payload = Object.fromEntries(formData.entries());
      console.log("Register payload:", payload);

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok) {
          registerMsg.innerHTML = `<p class="text-success">✅ ${result.message}</p>`;
          setTimeout(() => window.location.href = "/api/auth/login", 1000);
        } else {
          registerMsg.innerHTML = `<p class="text-danger">❌ ${result.error}</p>`;
        }

      } catch (err) {
        console.error("Register error:", err);
        registerMsg.innerHTML = `<p class="text-danger">⚠️ Something went wrong</p>`;
      }
    });
  }
});


//-------------------Add User Form--------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const addUserForm = document.getElementById("addUserForm");
  const addUserMsg = document.getElementById("addUserMsg");

  if (addUserForm) {
    addUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(addUserForm);
      const payload = Object.fromEntries(formData.entries());
      console.log("Add Form payload:", payload);

      try {
        const res = await fetch(`${API_URL}/users/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok) {
          addUserMsg.innerHTML = `<p class="text-success">✅ ${result.message}</p>`;
          setTimeout(() => window.location.href = "/api/auth/users/list", 1000);
        } else {
          addUserMsg.innerHTML = `<p class="text-danger">❌ ${result.error}</p>`;
        }

      } catch (err) {
        console.error("Register error:", err);
        addUserMsg.innerHTML = `<p class="text-danger">⚠️ Something went wrong</p>`;
      }
    });
  }
});


//-------------------------Edit Form------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const editUserForm = document.getElementById("editUserForm");
  const editUserMsg = document.getElementById("editUserMsg");
  
  if (editUserForm) {
    editUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(editUserForm);
      const payload = Object.fromEntries(formData.entries());
      console.log("Edit Form payload:", payload);

      try {
        const res = await fetch(`${API_URL}/users/edit/${payload.id}`, {
          method: "PUT", // 👈 use PUT for update
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        console.log(`res:${result}`)
        console.log(`res.ok:${res.ok}`) 
        if (res.ok) {
          editUserMsg.innerHTML = `<p class="text-success">✅ ${result.message}</p>`;
          window.location.href = "/api/auth/users/list";
        //  setTimeout(() => window.location.href = "/api/auth/users/list", 1000);

          // Example: Update row in table dynamically without refresh
        //   const row = document.querySelector(`#user-row-${payload.id}`);
        //   if (row) {
        //     row.querySelector(".user-name").textContent = payload.name;
        //     row.querySelector(".user-email").textContent = payload.email;
        //     row.querySelector(".user-phone").textContent = payload.phone;
        //   }

          // Optional: Close modal after update
          setTimeout(() => {
            if (window.editModal) editModal.hide();
          }, 1000);

        } else {
          editUserMsg.innerHTML = `<p class="text-danger">❌ ${result.error}</p>`;
        }
      } catch (err) {
        console.error("Edit error:", err);
        editUserMsg.innerHTML = `<p class="text-danger">⚠️ Something went wrong</p>`;
      }
    });
  }
});


//----------------------Delete--------------------------------------------------
// document.addEventListener("DOMContentLoaded", () => {
//   // DELETE user
//   document.querySelectorAll(".btn btn-danger").forEach((btn) => {
//     btn.addEventListener("click", async (e) => {
//       e.preventDefault();

//       const id = btn.dataset.id;
//       if (!confirm("Are you sure you want to delete this user?")) return;

//       try {
//         const res = await fetch(`${API_URL}/users/delete/${id}`, {
//           method: "DELETE",
//         });

//         const result = await res.json();
//         console.log("Delete result:", result);

//         if (res.ok) {
//          console.log('Item deleted')
//         //   alert("✅ " + result.message);
//           setTimeout(() => {
//             window.location.href = "/api/auth/users/list";
//           }, 1000);
//         } else {
//           alert("❌ " + result.error);
//         }
//       } catch (err) {
//         console.error("Delete error:", err);
//         alert("⚠️ Something went wrong");
//       }
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn.btn-danger").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      const id = btn.dataset.id; // dynamic ID here
      console.log(`id in js:${id}`)
      // if (!confirm("Are you sure you want to delete this user?")) return;

      try {
        const res = await fetch(`/api/auth/users/delete/${id}`, {
          method: "DELETE",
        });
        console.log(`res:${res}`);
        if (res.ok) {
          console.log("Item deleted");
          // Remove row instantly
        //   document.querySelector(`#user-row-${id}`)?.remove();
          // Or redirect after short delay
          // setTimeout(() => {
            window.location.href = "/api/auth/users/list";
          // }, 500);
        } else {
          const result = await res.json();
          alert("❌ " + (result.error || "Failed to delete"));
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("⚠️ Something went wrong");
      }
    });
  });
});
