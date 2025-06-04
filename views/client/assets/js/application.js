document.addEventListener("DOMContentLoaded", function () {
    'use strict';
    const form = document.getElementById('applyNowForm');
    const submitButton = document.getElementById('submitApplyNowButton');
    const applyNowModalEl = document.getElementById('applyNowModal');

    if (!form || !submitButton || !applyNowModalEl) {
        console.error('Critical form elements (form, submit button, or modal) not found.');
        return;
    }

    let isProcessing = false;
    const originalButtonText = submitButton.innerHTML;
    const PREVIOUS_SUBMISSION_STATUS_KEY = 'previousApplicationStatus';

    function displayPreviousSubmissionStatus() {
        const storedStatusData = localStorage.getItem(PREVIOUS_SUBMISSION_STATUS_KEY);
        if (storedStatusData) {
            try {
                const statusData = JSON.parse(storedStatusData);
                let title, text, icon;

                switch (statusData.status) {
                    case 'success':
                        icon = 'success';
                        title = 'Application Sent';
                        text = 'Your application was sent successfully!';
                        break;
                    case 'failure':
                        icon = 'error';
                        title = 'Submission Failed';
                        text = `Your application failed to send. ${statusData.originalMessage || ''}`;
                        break;
                    case 'network_error':
                        icon = 'error';
                        title = 'Connection Issue';
                        text = `There was a network problem with your application attempt. ${statusData.originalMessage || ''}`;
                        break;
                    default:
                        icon = 'info';
                        title = 'Action';
                        text = statusData.originalMessage || 'Status of action.';
                }

                Swal.fire({
                    icon: icon,
                    title: title,
                    text: text,
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false
                });
                localStorage.removeItem(PREVIOUS_SUBMISSION_STATUS_KEY);
            } catch (e) {
                console.error("Error parsing stored submission status:", e);
                localStorage.removeItem(PREVIOUS_SUBMISSION_STATUS_KEY);
            }
        }
    }

    displayPreviousSubmissionStatus(); // Check and display on page load

    if (applyNowModalEl) {
        applyNowModalEl.addEventListener('hidden.bs.modal', function () {
            form.reset();
            form.classList.remove('was-validated');
            const phoneInput = form.querySelector('#phone');
            if (phoneInput) phoneInput.setCustomValidity('');
            if (isProcessing) isProcessing = false;
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    }

    async function handleFormSubmission() {
        if (isProcessing) return;
        isProcessing = true;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Submitting...';

        const phoneInput = form.querySelector('#phone');
        if (phoneInput) {
            const phonePattern = /^\d{10}$/;
            phoneInput.setCustomValidity(phonePattern.test(phoneInput.value) ? '' : 'Please enter a valid 10-digit phone number.');
        }

        form.classList.remove('was-validated');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            isProcessing = false;
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            const firstInvalid = form.querySelector(':invalid, .is-invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        form.classList.add('was-validated');

        const formData = new FormData(form);
        let submissionStatus = 'failure'; // Default
        let originalMessage = 'An unexpected error occurred.';

        try {
            const response = await fetch('http://localhost:3002/client/application/apply', {
                method: 'POST',
                body: formData
            });
            let result;
            try {
                result = await response.json();
                originalMessage = result.message || (response.ok ? 'Application processed.' : 'Server indicated an issue.');
            } catch (parseError) {
                originalMessage = response.statusText || "Invalid server response format.";
            }
            submissionStatus = response.ok ? 'success' : 'failure';
        } catch (networkError) {
            originalMessage = 'Could not connect to the server.';
            submissionStatus = 'network_error';
        }

        // Store result FOR THE NEXT PAGE LOAD (no immediate SweetAlert here)
        localStorage.setItem(PREVIOUS_SUBMISSION_STATUS_KEY, JSON.stringify({
            status: submissionStatus,
            originalMessage: originalMessage
        }));

        if (submissionStatus === 'success' && applyNowModalEl) {
            const modalInstance = bootstrap.Modal.getInstance(applyNowModalEl);
            if (modalInstance) modalInstance.hide(); // This will trigger 'hidden.bs.modal'
        } else {
            // If not success, or modal not available, still reset processing state
            isProcessing = false;
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    }

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        handleFormSubmission();
    });
});