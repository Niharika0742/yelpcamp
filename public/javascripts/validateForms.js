// import bsCustomFileInput from 'bs-custom-file-input'
// const bsCustomFileInput = require('bs-custom-file-input');


// public/javascripts/validateForms.js

(() => {
    'use strict'
    // Initialize bs-custom-file-input
    bsCustomFileInput.init()
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()

  