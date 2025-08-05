// MentorConnect - Main JavaScript File

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    setupAnimations();
    setupFormValidation();
    setupNotifications();
    setupButtonInteractions();
    setupTableInteractions();
    setupSearchFunctionality();
    setupGoalTracking();
    setupSessionManagement();
    wrapContentInContainer();
}

// Wrap all page content in a container for consistent styling
function wrapContentInContainer() {
    const body = document.body;
    const container = document.createElement('div');
    container.className = 'container fade-in';
    
    // Move all body content into the container
    while (body.firstChild) {
        container.appendChild(body.firstChild);
    }
    
    body.appendChild(container);
}

// Add fade-in animations to page elements
function setupAnimations() {
    const elements = document.querySelectorAll('h1, h2, h3, form, table, ul');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
}

// Enhanced form validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Please fill in all required fields correctly', 'error');
            } else {
                handleFormSubmission(this, e);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        showFieldError(field, 'This field is required');
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            showFieldError(field, 'Please enter a valid email address');
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 6) {
            isValid = false;
            showFieldError(field, 'Password must be at least 6 characters long');
        }
    }
    
    if (isValid) {
        clearFieldError(field);
    }
    
    return isValid;
}

// Validate entire form
function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#e53e3e';
    
    const error = document.createElement('span');
    error.className = 'field-error';
    error.style.color = '#e53e3e';
    error.style.fontSize = '14px';
    error.style.marginTop = '5px';
    error.style.display = 'block';
    error.textContent = message;
    
    field.parentNode.insertBefore(error, field.nextSibling);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
}

// Handle form submissions with loading states
function handleFormSubmission(form, event) {
    const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.innerHTML += '<span class="spinner"></span>';
        
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            const spinner = submitBtn.querySelector('.spinner');
            if (spinner) spinner.remove();
        }, 1000);
    }
}

// Notification system
function setupNotifications() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '1000';
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Enhanced button interactions
function setupButtonInteractions() {
    // Accept/Reject buttons
    const acceptButtons = document.querySelectorAll('button[onclick*="accept"], button:contains("Accept")');
    const rejectButtons = document.querySelectorAll('button[onclick*="reject"], button:contains("Reject")');
    const deleteButtons = document.querySelectorAll('button:contains("Delete")');
    const blockButtons = document.querySelectorAll('button:contains("Block")');
    
    // Apply custom classes
    acceptButtons.forEach(btn => btn.classList.add('btn-accept'));
    rejectButtons.forEach(btn => btn.classList.add('btn-reject'));
    deleteButtons.forEach(btn => btn.classList.add('btn-delete'));
    blockButtons.forEach(btn => btn.classList.add('btn-block'));
    
    // Add click handlers
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.tagName === 'BUTTON') {
            const text = target.textContent.toLowerCase();
            
            if (text.includes('accept')) {
                handleAccept(target);
            } else if (text.includes('reject')) {
                handleReject(target);
            } else if (text.includes('delete')) {
                handleDelete(target);
            } else if (text.includes('block')) {
                handleBlock(target);
            } else if (text.includes('request')) {
                handleRequest(target);
            } else if (text.includes('join')) {
                handleJoinSession(target);
            } else if (text.includes('complete')) {
                handleMarkComplete(target);
            }
        }
    });
}

// Button action handlers
function handleAccept(button) {
    if (confirm('Are you sure you want to accept this request?')) {
        button.textContent = 'Accepted';
        button.disabled = true;
        button.style.opacity = '0.6';
        showNotification('Request accepted successfully!', 'success');
    }
}

function handleReject(button) {
    if (confirm('Are you sure you want to reject this request?')) {
        const listItem = button.closest('li');
        if (listItem) {
            listItem.style.opacity = '0.5';
            listItem.innerHTML += '<span style="color: #e53e3e; font-weight: bold; margin-left: 10px;">REJECTED</span>';
        }
        button.disabled = true;
        showNotification('Request rejected', 'info');
    }
}

function handleDelete(button) {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        const row = button.closest('tr') || button.closest('li');
        if (row) {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateX(-100%)';
            setTimeout(() => row.remove(), 300);
        }
        showNotification('Item deleted successfully', 'success');
    }
}

function handleBlock(button) {
    if (confirm('Are you sure you want to block this user?')) {
        button.textContent = 'Blocked';
        button.classList.remove('btn-block');
        button.style.background = '#718096';
        button.disabled = true;
        showNotification('User blocked successfully', 'success');
    }
}

function handleRequest(button) {
    button.textContent = 'Requested';
    button.disabled = true;
    button.style.opacity = '0.6';
    showNotification('Session request sent!', 'success');
}

function handleJoinSession(button) {
    showNotification('Joining session...', 'info');
    setTimeout(() => {
        showNotification('Session joined successfully!', 'success');
    }, 1500);
}

function handleMarkComplete(button) {
    if (confirm('Mark this goal as complete?')) {
        const statusElement = button.closest('tr') ? 
            button.closest('tr').querySelector('td:nth-child(3)') :
            button.closest('li').querySelector('strong');
        
        if (statusElement) {
            statusElement.innerHTML = '<span class="status-complete">Completed</span>';
        }
        
        button.textContent = 'Completed';
        button.disabled = true;
        button.style.opacity = '0.6';
        showNotification('Goal marked as complete!', 'success');
    }
}

// Enhanced table interactions
function setupTableInteractions() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
        
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'all 0.2s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    });
}

// Search functionality
function setupSearchFunctionality() {
    const searchForms = document.querySelectorAll('form');
    
    searchForms.forEach(form => {
        const searchInput = form.querySelector('input[type="text"][placeholder*="search"], input[type="text"][placeholder*="Search"]');
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                performSearch(query);
            });
        }
    });
}

function performSearch(query) {
    // Simple search implementation for mentor lists
    const mentorItems = document.querySelectorAll('ul li');
    
    mentorItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query) || query === '') {
            item.style.display = 'block';
            item.classList.add('slide-in');
        } else {
            item.style.display = 'none';
        }
    });
    
    if (query) {
        showNotification(`Searching for: ${query}`, 'info', 1500);
    }
}

// Goal tracking functionality
function setupGoalTracking() {
    const goalForms = document.querySelectorAll('form');
    
    goalForms.forEach(form => {
        const goalInput = form.querySelector('input[placeholder*="goal"], input[placeholder*="Goal"]');
        
        if (goalInput) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                addNewGoal(goalInput.value);
                goalInput.value = '';
            });
        }
    });
}

function addNewGoal(goalText) {
    if (!goalText.trim()) return;
    
    const goalList = document.querySelector('h3:contains("Goal") + ul, ul');
    if (goalList) {
        const newGoal = document.createElement('li');
        newGoal.innerHTML = `
            ${goalText} – <span class="status-progress">In Progress</span>
            <button onclick="handleMarkComplete(this)" style="margin-left: 10px;">Mark as Complete</button>
        `;
        newGoal.classList.add('fade-in');
        goalList.appendChild(newGoal);
        showNotification('New goal added!', 'success');
    }
}

// Session management
function setupSessionManagement() {
    // Auto-refresh session lists every 30 seconds
    if (window.location.href.includes('schedule') || window.location.href.includes('requests')) {
        setInterval(() => {
            showNotification('Checking for updates...', 'info', 1000);
        }, 30000);
    }
}

// Utility function to check if element contains text
function elementContainsText(element, text) {
    return element.textContent.toLowerCase().includes(text.toLowerCase());
}

// Custom selector for text content
document.querySelectorAll = (function(original) {
    return function(selector) {
        if (selector.includes(':contains(')) {
            const match = selector.match(/:contains\(['"](.+?)['"]\)/);
            if (match) {
                const text = match[1];
                const baseSelector = selector.replace(/:contains\(['"].+?['"]\)/, '');
                const elements = original.call(this, baseSelector || '*');
                return Array.from(elements).filter(el => elementContainsText(el, text));
            }
        }
        return original.call(this, selector);
    };
})(document.querySelectorAll.bind(document));

// Add smooth scrolling to anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && 
        e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading states for page navigation
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && 
        e.target.getAttribute('href').endsWith('.html')) {
        const link = e.target;
        link.style.opacity = '0.6';
        link.innerHTML += ' <span class="spinner"></span>';
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.classList.remove('show');
        });
    }
    
    // Enter key on buttons
    if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        e.target.click();
    }
});

// Performance optimization: lazy load images (if any are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    lazyLoadImages();
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('Something went wrong. Please try again.', 'error');
});

// Export functions for use in HTML onclick attributes
window.MentorConnect = {
    showNotification,
    handleAccept,
    handleReject,
    handleDelete,
    handleBlock,
    handleRequest,
    handleJoinSession,
    handleMarkComplete
};