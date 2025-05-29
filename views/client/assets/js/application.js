document.addEventListener("DOMContentLoaded", function () {
    'use strict';
    const form = document.getElementById('applyNowForm');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            event.stopPropagation();

            const phoneInput = form.querySelector('#phone');
            const phonePattern = /^\d{10}$/;

            // Custom validation
            if (!phonePattern.test(phoneInput.value)) {
                phoneInput.setCustomValidity('Please enter a valid 10-digit phone number.');
                phoneInput.classList.add('is-invalid');
            } else {
                phoneInput.setCustomValidity('');
                phoneInput.classList.remove('is-invalid');
            }

            // Check form validity
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            const formData = new FormData(form);

            try {
                const response = await fetch('http://localhost:3002/client/application/apply', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    await Swal.fire({
                        title: 'Success!',
                        text: result.message,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });

                    // Prevent page reload after alert
                    form.reset();
                    form.classList.remove('was-validated');
                    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
                    document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

                    // Optional: Hide modal after success
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('applyNowModal'));
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                } else {
                    await Swal.fire({
                        title: 'Error!',
                        text: result.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                let errorMessage = 'An error occurred while submitting your application.';
                if (error.message.includes('email')) {
                    errorMessage = 'The email address already exists.';
                } else if (error.message.includes('phone')) {
                    errorMessage = 'The phone number already exists.';
                }
                await Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }

            form.classList.add('was-validated');
        });
    }

    // Reset form on modal close
    const applyNowModal = document.getElementById('applyNowModal');
    if (applyNowModal) {
        applyNowModal.addEventListener('hidden.bs.modal', function () {
            if (form) {
                form.reset();
                form.classList.remove('was-validated');
            }
        });
    }
});
