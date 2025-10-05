document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginFormElement");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const userType = document.querySelector('input[name="userType"]:checked')?.value || "farmer";

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    try {
      // ⚠️ Use full backend URL and include credentials for cookies
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
       headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ crucial
      body: JSON.stringify({ email, password, userType }),
      });

      const data = await res.json();

      if (!data.success) {
        document.getElementById("loginPassword").value = "";
        throw new Error(data.message || "Login failed");
      }

      // Optional: store JWT in localStorage if you want (not required for cookie auth)
      localStorage.setItem("authToken", data.token);

      // ✅ Redirect using backend-provided URL or fallback
      window.location.href = data.redirectUrl || "/dashboard";

    } catch (err) {
      console.error("Login error:", err);
      alert(err.message);
    }
  });
});
