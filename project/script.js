// Authentication Page Functions
function showForm(form) {
  // Remove active class from all form sections and tab buttons
  document.querySelectorAll('.form-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  // Show the selected form and activate corresponding tab
  if (form === 'login') {
    document.getElementById('login-form').classList.add('active');
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
  } else {
    document.getElementById('register-form').classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
  }
}

// Match Page Functions
function initializeMatchFiltering() {
  const select = document.getElementById("domain-select");
  const cards = document.querySelectorAll(".match-card");

  if (select && cards.length > 0) {
    select.addEventListener("change", () => {
      const selected = select.value;

      cards.forEach(card => {
        const domain = card.getAttribute("data-domain");

        if (selected === "all" || domain === selected) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
}

// Goals Page Functions
function initializeGoalsForm() {
  const form = document.querySelector('.goal-container form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Custom validation for goals
      const shortGoal = document.getElementById('short-goal');
      const longGoal = document.getElementById('long-goal');
      const sessionTime = document.getElementById('session-time');
      
      let isValid = true;
      
      // Validate short-term goal
      if (!shortGoal.value.trim()) {
        showError(shortGoal, 'Please enter your short-term goal');
        isValid = false;
      } else if (shortGoal.value.trim().length < 10) {
        showError(shortGoal, 'Please provide more details (at least 10 characters)');
        isValid = false;
      } else {
        showSuccess(shortGoal);
      }
      
      // Validate long-term goal
      if (!longGoal.value.trim()) {
        showError(longGoal, 'Please enter your long-term goal');
        isValid = false;
      } else if (longGoal.value.trim().length < 15) {
        showError(longGoal, 'Please provide more details (at least 15 characters)');
        isValid = false;
      } else {
        showSuccess(longGoal);
      }
      
      // Validate session time
      if (sessionTime.value) {
        const selectedDate = new Date(sessionTime.value);
        const now = new Date();
        if (selectedDate < now) {
          showError(sessionTime, 'Please select a future date and time');
          isValid = false;
        } else {
          showSuccess(sessionTime);
        }
      }
      
      if (isValid) {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Saving Goals...';
        submitBtn.disabled = true;
        
        // Simulate saving
        setTimeout(() => {
          alert('Goals saved successfully!');
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          
          // Optional: Clear form or redirect
          // window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        // Scroll to first error
        const firstError = this.querySelector('.error-message');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
    
    // Real-time validation for textareas
    const textareas = form.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      textarea.addEventListener('blur', () => {
        if (textarea.value.trim()) {
          if (textarea.id === 'short-goal' && textarea.value.trim().length < 10) {
            showError(textarea, 'Please provide more details (at least 10 characters)');
          } else if (textarea.id === 'long-goal' && textarea.value.trim().length < 15) {
            showError(textarea, 'Please provide more details (at least 15 characters)');
          } else {
            showSuccess(textarea);
          }
        }
      });
      
      textarea.addEventListener('focus', () => {
        clearValidation(textarea);
      });
    });
  }
}

// Connect Button Functions
function initializeConnectButtons() {
  const connectButtons = document.querySelectorAll('.connect-btn');
  
  connectButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get mentor name from the card
      const card = this.closest('.match-card');
      const mentorName = card.querySelector('h3').textContent;
      
      // Simulate connection request
      alert(`Connection request sent to ${mentorName}!`);
      
      // Change button text and disable it
      this.textContent = 'Request Sent';
      this.style.backgroundColor = '#10b981';
      this.disabled = true;
    });
  });
}

// Initialize functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Setup real-time validation for all forms
  setupRealTimeValidation();
  
  // Initialize authentication forms if on index page
  if (document.getElementById('login-form') || document.getElementById('register-form')) {
    initializeAuthForms();
  }
  
  // Initialize match page filtering if on match page
  if (document.getElementById('domain-select')) {
    initializeMatchFiltering();
  }
  
  // Initialize goals form if on goals page
  if (document.querySelector('.goal-container form')) {
    initializeGoalsForm();
  }
  
  // Initialize connect buttons if they exist
  if (document.querySelectorAll('.connect-btn').length > 0) {
    initializeConnectButtons();
  }
});

// Utility Functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  // At least 6 characters, must contain at least one letter and one number
  return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function validateName(name) {
  // At least 2 characters, only letters and spaces
  return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
}

// Enhanced Form Validation
function showError(input, message) {
  // Remove existing error message
  const existingError = input.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Style input as invalid
  input.style.borderColor = '#ef4444';
  input.style.backgroundColor = '#fee2e2';
  
  // Create and show error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.color = '#ef4444';
  errorDiv.style.fontSize = '0.875rem';
  errorDiv.style.marginTop = '4px';
  errorDiv.style.fontWeight = '500';
  
  input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

function showSuccess(input) {
  // Remove error message
  const existingError = input.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Style input as valid
  input.style.borderColor = '#10b981';
  input.style.backgroundColor = '#ecfdf5';
}

function clearValidation(input) {
  // Remove error message
  const existingError = input.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Reset input styling
  input.style.borderColor = '#ccc';
  input.style.backgroundColor = 'white';
}

function validateField(input) {
  const value = input.value.trim();
  const type = input.type;
  const isRequired = input.hasAttribute('required');
  
  // Clear previous validation
  clearValidation(input);
  
  // Check if required field is empty
  if (isRequired && !value) {
    showError(input, 'This field is required');
    return false;
  }
  
  // Skip validation if field is empty and not required
  if (!value && !isRequired) {
    return true;
  }
  
  // Type-specific validation
  switch (type) {
    case 'email':
      if (!validateEmail(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
      }
      break;
      
    case 'password':
      if (!validatePassword(value)) {
        showError(input, 'Password must be at least 6 characters long');
        return false;
      }
      break;
      
    case 'text':
      // Full name validation
      if (input.previousElementSibling && input.previousElementSibling.textContent.includes('Full Name')) {
        if (value.length < 2) {
          showError(input, 'Name must be at least 2 characters long');
          return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          showError(input, 'Name can only contain letters and spaces');
          return false;
        }
      }
      break;
      
    case 'datetime-local':
      if (value) {
        const selectedDate = new Date(value);
        const now = new Date();
        if (selectedDate < now) {
          showError(input, 'Please select a future date and time');
          return false;
        }
      }
      break;
  }
  
  showSuccess(input);
  return true;
}

function validateForm(formElement) {
  const inputs = formElement.querySelectorAll('input, textarea, select');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

// Real-time validation setup
function setupRealTimeValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      // Validate on blur (when user leaves the field)
      input.addEventListener('blur', () => {
        if (input.value.trim()) {
          validateField(input);
        }
      });
      
      // Clear error on focus (when user clicks back into field)
      input.addEventListener('focus', () => {
        if (input.parentNode.querySelector('.error-message')) {
          clearValidation(input);
        }
      });
      
      // Real-time validation for certain fields
      if (input.type === 'email' || input.type === 'password') {
        input.addEventListener('input', () => {
          // Only validate if user has started typing and field has content
          if (input.value.length > 0) {
            setTimeout(() => validateField(input), 500); // Debounce validation
          }
        });
      }
    });
  });
}

// Enhanced form submission handlers
function initializeAuthForms() {
  const loginForm = document.querySelector('#login-form form');
  const registerForm = document.querySelector('#register-form form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm(this)) {
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        // Simulate login process
        setTimeout(() => {
          // In a real app, this would make an API call
          window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        // Scroll to first error
        const firstError = this.querySelector('.error-message');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm(this)) {
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        // Simulate registration process
        setTimeout(() => {
          alert('Account created successfully!');
          window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        // Scroll to first error
        const firstError = this.querySelector('.error-message');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }
}