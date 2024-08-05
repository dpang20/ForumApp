document.addEventListener('DOMContentLoaded', () => {
    const reportForms = document.querySelectorAll('.report-form');
  
    reportForms.forEach(form => {
      form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from submitting immediately
        const isConfirmed = confirm('Are you sure you want to report this post?');
        if (isConfirmed) {
          form.submit(); // Submit the form if the user confirms
        }
      });
    });
  });
  