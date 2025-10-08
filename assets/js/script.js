// --- Global Initialization ---

document.addEventListener('DOMContentLoaded', function() {
    // Set the current year in the footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // --- Form Submission Handler (CRITICAL for data collection) ---
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');

    if (form) {
        form.addEventListener('submit', function(event) {
            // Prevent default HTML form submission
            event.preventDefault(); 
            
            // Perform Bootstrap built-in validation
            if (!form.checkValidity()) {
                event.stopPropagation();
            }
            form.classList.add('was-validated');

            if (form.checkValidity()) {
                statusMessage.textContent = 'Sending message...';
                statusMessage.className = 'mt-3 text-center small text-info';
                
                // Use fetch API to send form data asynchronously
                fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        statusMessage.textContent = 'Thank you! Your message has been sent successfully.';
                        statusMessage.className = 'mt-3 text-center small text-success';
                        form.reset(); // Clear the form fields
                        form.classList.remove('was-validated');
                    } else {
                        // Handle errors from the form endpoint service
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                statusMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                            } else {
                                statusMessage.textContent = 'Oops! There was a problem submitting your form.';
                            }
                            statusMessage.className = 'mt-3 text-center small text-danger';
                        })
                    }
                })
                .catch(error => {
                    statusMessage.textContent = 'Connection error. Please try again later.';
                    statusMessage.className = 'mt-3 text-center small text-danger';
                    console.error('Submission Error:', error);
                });
            }
        });
    }
});