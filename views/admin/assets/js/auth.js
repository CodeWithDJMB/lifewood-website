document.addEventListener("DOMContentLoaded", function () {
	initializeInputFocusHandlers();
	initializeFormValidation();
	initializePasswordToggle();
	initializeLogoutButton();
});

// Adds event listeners to input fields for focus and blur effects.
function initializeInputFocusHandlers() {
	const inputs = document.querySelectorAll(".input");

	if (inputs.length > 0) {
		function addFocus() {
			let parent = this.parentNode.parentNode;
			parent.classList.add("focus");
		}

		function removeFocus() {
			let parent = this.parentNode.parentNode;
			if (this.value === "") {
				parent.classList.remove("focus");
			}
		}

		inputs.forEach(input => {
			input.addEventListener("focus", addFocus);
			input.addEventListener("blur", removeFocus);
		});
	}
}

// Handles form submission and validation.
function initializeFormValidation() {
	const form = document.getElementById("loginForm");
	const toastElement = document.getElementById("validationToast");

	if (form && toastElement) {
		const toast = new bootstrap.Toast(toastElement);

		form.addEventListener("submit", async function (event) {
			event.preventDefault();
			const email = document.getElementById("email")?.value;
			const password = document.getElementById("password")?.value;

			// Show error message if email or password is empty
			if (!email || !password) {
				showToast("Please enter the needed credentials.", "danger");
				return;
			}

			try {
				const response = await fetch("http://localhost:3002/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				});

				const result = await response.json().catch(() => null);

				if (response.status === 200 && result) {
					showToast(result.message, "success");
					window.location.href = 'applications.html';
				} else {
					showToast(result ? result.message : 'An error occurred', "danger");
				}
			} catch (error) {
				showToast("An error occurred", "danger");
			}
		});
	}
}

// Displays a Bootstrap toast with a custom message and style.
function showToast(message, type) {
	const toastElement = document.getElementById("validationToast");
	if (toastElement) {
		toastElement.classList.remove("text-bg-success", "text-bg-danger");
		toastElement.classList.add(`text-bg-${type}`);
		document.getElementById("toastMessage").innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
		const toast = new bootstrap.Toast(toastElement);
		toast.show();
	}
}

// Toggles password visibility and hides the toggle button when the field is empty.
function initializePasswordToggle() {
	const passwordInput = document.getElementById("password");
	const togglePassword = document.querySelector(".toggle-password");

	if (passwordInput && togglePassword) {
		togglePassword.addEventListener("click", function () {
			passwordInput.type = passwordInput.type === "password" ? "text" : "password";
			this.querySelector("i").classList.toggle("fa-eye");
			this.querySelector("i").classList.toggle("fa-eye-slash");
		});

		passwordInput.addEventListener("input", function () {
			togglePassword.style.display = this.value ? "block" : "none";
		});

		if (passwordInput.value === "") {
			togglePassword.style.display = "none";
		}
	}
}

// Handles logout confirmation and sends a logout request to the server.
function initializeLogoutButton() {
	const logoutButton = document.querySelector('[data-target="#logoutModal"]');

	if (logoutButton) {
		logoutButton.addEventListener('click', function (event) {
			event.preventDefault();

			Swal.fire({
				title: 'Logout?',
				text: "Are you sure you want to logout?",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Logout',
				cancelButtonText: 'Cancel'
			}).then((result) => {
				if (result.isConfirmed) {
					fetch("http://localhost:3002/auth/logout", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
					}).then(response => {
						if (response.status === 200) {
							Swal.fire('Logged Out!', 'You have been logged out successfully.', 'success')
								.then(() => window.location.href = 'admin-login.html');
						} else {
							Swal.fire('Error!', 'An error occurred while logging out.', 'error');
						}
					}).catch(() => {
						Swal.fire('Error!', 'An error occurred while logging out.', 'error');
					});
				}
			});
		});
	}
}
