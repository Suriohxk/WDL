// Registration Form Validation JavaScript
// This script provides comprehensive validation for all registration form fields

document.addEventListener('DOMContentLoaded', function() {
    initializeRegistrationValidation();
});

function initializeRegistrationValidation() {
    const form = document.querySelector('form');
    if (!form) return;

    // Add real-time validation listeners
    setupFieldValidation();
    
    // Override form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateRegistrationForm()) {
            handleSuccessfulRegistration();
        }
    });
}

function setupFieldValidation() {
    // Get all form fields
    const firstNameField = getFieldByName('firstName') || getFieldByPlaceholder('first name') || document.querySelector('input[type="text"]:first-of-type');
    const lastNameField = getFieldByName('lastName') || getFieldByPlaceholder('last name') || document.querySelector('input[type="text"]:nth-of-type(2)');
    const emailField = document.querySelector('input[type="email"]');
    const passwordField = document.querySelector('input[type="password"]');
    const mobileField = getFieldByName('mobile') || getFieldByPlaceholder('mobile') || getFieldByPlaceholder('phone');
    const addressField = getFieldByName('address') || document.querySelector('textarea') || getFieldByPlaceholder('address');

    // Add validation listeners for each field
    if (firstNameField) {
        addFieldValidation(firstNameField, 'firstName');
        firstNameField.setAttribute('placeholder', 'Enter your first name (min 6 characters)');
    }

    if (lastNameField) {
        addFieldValidation(lastNameField, 'lastName');
        lastNameField.setAttribute('placeholder', 'Enter your last name');
    }

    if (emailField) {
        addFieldValidation(emailField, 'email');
        emailField.setAttribute('placeholder', 'Enter email (name@domain.com)');
    }

    if (passwordField) {
        addFieldValidation(passwordField, 'password');
        passwordField.setAttribute('placeholder', 'Enter password (min 6 characters)');
    }

    if (mobileField) {
        addFieldValidation(mobileField, 'mobile');
        mobileField.setAttribute('placeholder', 'Enter 10-digit mobile number');
        mobileField.setAttribute('type', 'tel');
        mobileField.setAttribute('maxlength', '10');
    }

    if (addressField) {
        addFieldValidation(addressField, 'address');
        addressField.setAttribute('placeholder', 'Enter your complete address');
    }
}

function getFieldByName(name) {
    return document.querySelector(`input[name="${name}"]`) || 
           document.querySelector(`textarea[name="${name}"]`);
}

function getFieldByPlaceholder(placeholder) {
    return document.querySelector(`input[placeholder*="${placeholder}"]`) || 
           document.querySelector(`textarea[placeholder*="${placeholder}"]`);
}

function addFieldValidation(field, type) {
    // Real-time validation on input
    field.addEventListener('input', function() {
        clearFieldError(this);
        validateSingleField(this, type);
    });

    // Validation on blur
    field.addEventListener('blur', function() {
        validateSingleField(this, type);
    });

    // Add CSS classes for styling
    field.classList.add('form-field', `field-${type}`);
}

function validateSingleField(field, type) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch(type) {
        case 'firstName':
            const result = validateFirstName(value);
            isValid = result.isValid;
            errorMessage = result.message;
            break;

        case 'lastName':
            const lastNameResult = validateLastName(value);
            isValid = lastNameResult.isValid;
            errorMessage = lastNameResult.message;
            break;

        case 'email':
            const emailResult = validateEmail(value);
            isValid = emailResult.isValid;
            errorMessage = emailResult.message;
            break;

        case 'password':
            const passwordResult = validatePassword(value);
            isValid = passwordResult.isValid;
            errorMessage = passwordResult.message;
            break;

        case 'mobile':
            const mobileResult = validateMobile(value);
            isValid = mobileResult.isValid;
            errorMessage = mobileResult.message;
            break;

        case 'address':
            const addressResult = validateAddress(value);
            isValid = addressResult.isValid;
            errorMessage = addressResult.message;
            break;
    }

    if (isValid) {
        showFieldSuccess(field);
    } else {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

// Individual validation functions

function validateFirstName(firstName) {
    if (!firstName) {
        return { isValid: false, message: 'First name is required' };
    }

    if (firstName.length < 6) {
        return { isValid: false, message: 'First name must be at least 6 characters long' };
    }

    // Check if contains only alphabets and spaces
    const alphabetRegex = /^[A-Za-z\s]+$/;
    if (!alphabetRegex.test(firstName)) {
        return { isValid: false, message: 'First name should contain only alphabets and spaces' };
    }

    return { isValid: true, message: 'Valid first name' };
}

function validateLastName(lastName) {
    if (!lastName || lastName.trim() === '') {
        return { isValid: false, message: 'Last name is required and cannot be empty' };
    }

    // Check if contains only alphabets and spaces
    const alphabetRegex = /^[A-Za-z\s]+$/;
    if (!alphabetRegex.test(lastName)) {
        return { isValid: false, message: 'Last name should contain only alphabets and spaces' };
    }

    return { isValid: true, message: 'Valid last name' };
}

function validateEmail(email) {
    if (!email) {
        return { isValid: false, message: 'Email is required' };
    }

    // Standard email pattern: name@domain.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Please enter a valid email address (name@domain.com)' };
    }

    // Additional checks
    if (email.indexOf('@') === 0 || email.indexOf('@') === email.length - 1) {
        return { isValid: false, message: 'Invalid email format' };
    }

    const parts = email.split('@');
    if (parts.length !== 2) {
        return { isValid: false, message: 'Email must contain exactly one @ symbol' };
    }

    const domainParts = parts[1].split('.');
    if (domainParts.length < 2 || domainParts.some(part => part.length === 0)) {
        return { isValid: false, message: 'Invalid domain format' };
    }

    return { isValid: true, message: 'Valid email address' };
}

function validatePassword(password) {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }

    // Additional security checks (optional but recommended)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    let strengthMessage = '';
    if (hasUpperCase && hasLowerCase && hasNumbers) {
        strengthMessage = 'Strong password';
    } else if ((hasUpperCase || hasLowerCase) && hasNumbers) {
        strengthMessage = 'Good password';
    } else {
        strengthMessage = 'Consider adding uppercase, lowercase, and numbers for better security';
    }

    return { isValid: true, message: strengthMessage };
}

function validateMobile(mobile) {
    if (!mobile) {
        return { isValid: false, message: 'Mobile number is required' };
    }

    // Remove any spaces, hyphens, or other non-digit characters for validation
    const cleanMobile = mobile.replace(/\D/g, '');

    if (cleanMobile.length !== 10) {
        return { isValid: false, message: 'Mobile number must contain exactly 10 digits' };
    }

    // Check if it contains only digits
    const digitRegex = /^\d{10}$/;
    if (!digitRegex.test(cleanMobile)) {
        return { isValid: false, message: 'Mobile number should contain only digits' };
    }

    // Check for valid Indian mobile number patterns (optional)
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(cleanMobile)) {
        return { isValid: false, message: 'Please enter a valid mobile number (should start with 6-9)' };
    }

    return { isValid: true, message: 'Valid mobile number' };
}

function validateAddress(address) {
    if (!address || address.trim() === '') {
        return { isValid: false, message: 'Address is required and cannot be empty' };
    }

    if (address.trim().length < 10) {
        return { isValid: false, message: 'Please enter a complete address (minimum 10 characters)' };
    }

    return { isValid: true, message: 'Valid address' };
}

// Visual feedback functions

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e53e3e';
    field.style.backgroundColor = '#fed7d7';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #e53e3e;
        font-size: 14px;
        margin-top: 5px;
        padding: 5px;
        border-radius: 4px;
        background-color: #fed7d7;
        border: 1px solid #e53e3e;
        animation: slideDown 0.3s ease;
    `;
    errorDiv.innerHTML = `<span style="margin-right: 5px;">⚠️</span>${message}`;
    
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
    
    // Add shake animation
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

function showFieldSuccess(field) {
    clearFieldError(field);
    
    field.style.borderColor = '#38a169';
    field.style.backgroundColor = '#f0fff4';
    
    const successDiv = document.createElement('div');
    successDiv.className = 'field-success';
    successDiv.style.cssText = `
        color: #38a169;
        font-size: 14px;
        margin-top: 5px;
        padding: 5px;
        border-radius: 4px;
        background-color: #f0fff4;
        border: 1px solid #38a169;
        animation: slideDown 0.3s ease;
    `;
    successDiv.innerHTML = `<span style="margin-right: 5px;">✅</span>Valid`;
    
    field.parentNode.insertBefore(successDiv, field.nextSibling);
}

function clearFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    field.style.backgroundColor = 'white';
    
    const error = field.parentNode.querySelector('.field-error');
    const success = field.parentNode.querySelector('.field-success');
    
    if (error) error.remove();
    if (success) success.remove();
}

// Complete form validation

function validateRegistrationForm() {
    let isFormValid = true;
    const validationResults = [];

    // Get all fields
    const fields = {
        firstName: getFieldByName('firstName') || getFieldByPlaceholder('first name') || document.querySelector('input[type="text"]:first-of-type'),
        lastName: getFieldByName('lastName') || getFieldByPlaceholder('last name') || document.querySelector('input[type="text"]:nth-of-type(2)'),
        email: document.querySelector('input[type="email"]'),
        password: document.querySelector('input[type="password"]'),
        mobile: getFieldByName('mobile') || getFieldByPlaceholder('mobile') || getFieldByPlaceholder('phone'),
        address: getFieldByName('address') || document.querySelector('textarea') || getFieldByPlaceholder('address')
    };

    // Validate each field
    const fieldTypes = ['firstName', 'lastName', 'email', 'password', 'mobile', 'address'];
    
    fieldTypes.forEach(type => {
        if (fields[type]) {
            const isValid = validateSingleField(fields[type], type);
            if (!isValid) {
                isFormValid = false;
            }
            validationResults.push({ field: type, isValid });
        }
    });

    // Show overall result
    if (isFormValid) {
        showNotification('All fields are valid! Proceeding with registration...', 'success');
    } else {
        showNotification('Please correct the errors in the form before submitting', 'error');
        
        // Focus on first invalid field
        const firstInvalidField = validationResults.find(result => !result.isValid);
        if (firstInvalidField && fields[firstInvalidField.field]) {
            fields[firstInvalidField.field].focus();
        }
    }

    return isFormValid;
}

function handleSuccessfulRegistration() {
    // Show success message
    showNotification('Registration successful! Redirecting...', 'success', 2000);
    
    // Add loading state to submit button
    const submitBtn = document.querySelector('input[type="submit"], button[type="submit"]');
    if (submitBtn) {
        submitBtn.value = 'Registering...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
    }
    
    // Simulate registration process
    setTimeout(() => {
        // Get the role for redirection
        const role = document.getElementById('role')?.value;
        
        if (role === 'mentor') {
            window.location.href = 'mentor.html';
        } else if (role === 'mentee') {
            window.location.href = 'mentee.html';
        } else if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }, 1500);
}

// Notification function (if not already included from main script)
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        `;
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.style.cssText = `
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    // Set color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)';
    }

    notification.textContent = message;
    container.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .form-field {
        transition: all 0.3s ease;
    }
    
    .form-field:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);