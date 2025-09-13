
//----------------Add User------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const addUserForm = document.getElementById("addUserForm");
  if (!addUserForm) return;

  addUserForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(addUserForm);

    try {
      const res = await fetch("/users/add", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log(`data :${data}`);
      if (res.ok && data.success) {
        console.log("✅ Redirecting to /users/list ...");
        window.location.href = "/users/";   // ✅ redirect after success
      } else {
        document.getElementById("alert-box").innerHTML =
          `<div class="alert alert-danger">${data.message || "Something went wrong"}</div>`;
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      document.getElementById("alert-box").innerHTML =
        `<div class="alert alert-danger">Server error</div>`;
    }
  });
});

//--------------------Edit User Form---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const editForm = document.getElementById("editUserForm");
  const alertBox = document.getElementById("alert-box");

  if (!editForm) return;

  editForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(editForm);
    const userId = formData.get("id");

    try {
      const res = await fetch(`/users/${userId}`, {
        method: "PUT",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alertBox.innerHTML = `<div class="alert alert-success">✅ ${data.message}</div>`;
        window.location.href = "/users";

      } else {
        alertBox.innerHTML = `<div class="alert alert-danger">❌ ${data.message}</div>`;
      }
    } catch (err) {
      console.error("Update error:", err);
      alertBox.innerHTML = `<div class="alert alert-danger">❌ Something went wrong</div>`;
    }
  });
});

//-------------Delete User------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", async (event) => {
      event.preventDefault();

      const userId = btn.dataset.id;

      if (!confirm("Are you sure you want to delete this user?")) return;

      try {
        const res = await fetch(`/users/${userId}`, {
          method: "DELETE"
        });
        const data = await res.json();

        if (res.ok) {
          // Remove row from table
          const row = document.getElementById(`user-${userId}`);
          if (row) row.remove();

          alert(data.message);

          // Optional: redirect to list page after deletion (if all rows deleted)
           window.location.href = "/users/";  

        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
        alert("❌ Error deleting user");
      }
    });
  });
});


