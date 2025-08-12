// Kalaburagi Gold Price Tracker Application
let currentPrice = 65000; // Initial price in INR per 10gm
let isLoggedIn = false;

// Admin credentials
const ADMIN_USERNAME = "admin";
let adminPassword = "admin123"; // This can change
const MASTER_PASSWORD = "gold123"; // This never changes
const MIN_PASSWORD_LENGTH = 6;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app');
    initializeApp();
});

function initializeApp() {
    console.log('Starting app initialization');
    
    // Update initial timestamp and price
    updateTimestamp();
    updatePriceDisplay();
    
    // Set up event listeners
    setupEventListeners();
    
    // Ensure login form is shown initially
    showLoginForm();
    
    console.log('App initialized successfully');
}

function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Login form submission
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(e);
        });
        console.log('Login form listener attached');
    } else {
        console.error('Login form not found');
    }
    
    // Change password form submission
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePasswordChange(e);
        });
        console.log('Change password form listener attached');
    } else {
        console.error('Change password form not found');
    }
    
    // Price update form submission
    const priceForm = document.getElementById('priceUpdateForm');
    if (priceForm) {
        priceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePriceUpdate(e);
        });
        console.log('Price update form listener attached');
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout(e);
        });
        console.log('Logout button listener attached');
    }
}

function handleLogin(e) {
    console.log('=== LOGIN ATTEMPT ===');
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    
    if (!usernameInput || !passwordInput || !loginError) {
        console.error('Required login elements not found');
        return false;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log('Username:', username);
    console.log('Password provided:', password ? 'Yes' : 'No');
    console.log('Expected username:', ADMIN_USERNAME);
    console.log('Current admin password:', adminPassword);
    
    // Clear previous error messages
    loginError.classList.add('hidden');
    loginError.textContent = '';
    
    // Check credentials
    if (username === ADMIN_USERNAME && password === adminPassword) {
        console.log('LOGIN SUCCESS!');
        isLoggedIn = true;
        showAdminPanel();
        clearLoginForm();
        return true;
    } else {
        console.log('LOGIN FAILED - Invalid credentials');
        loginError.textContent = 'Invalid username or password. Please try again.';
        loginError.className = 'error-message';
        loginError.classList.remove('hidden');
        return false;
    }
}

function handlePasswordChange(e) {
    console.log('=== PASSWORD CHANGE ATTEMPT ===');
    
    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const passwordChangeMessage = document.getElementById('passwordChangeMessage');
    
    if (!oldPasswordInput || !newPasswordInput || !passwordChangeMessage) {
        console.error('Required password change elements not found');
        return;
    }
    
    const oldPassword = oldPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    
    console.log('Old password entered:', oldPassword ? 'Yes' : 'No');
    console.log('New password length:', newPassword.length);
    console.log('Current admin password:', adminPassword);
    console.log('Master password:', MASTER_PASSWORD);
    
    // Clear previous messages
    passwordChangeMessage.classList.add('hidden');
    passwordChangeMessage.textContent = '';
    passwordChangeMessage.className = '';
    
    // Validate new password length
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
        console.log('New password too short');
        passwordChangeMessage.textContent = `New password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
        passwordChangeMessage.className = 'error-message';
        passwordChangeMessage.classList.remove('hidden');
        return;
    }
    
    // Check if old password matches current password OR master password
    if (oldPassword === adminPassword || oldPassword === MASTER_PASSWORD) {
        console.log('PASSWORD CHANGE AUTHORIZED');
        
        // Update the admin password
        adminPassword = newPassword;
        console.log('New admin password set');
        
        // Show success message
        passwordChangeMessage.textContent = 'Password successfully changed! You can now login with your new password.';
        passwordChangeMessage.className = 'success-message';
        passwordChangeMessage.classList.remove('hidden');
        
        // Clear the form
        oldPasswordInput.value = '';
        newPasswordInput.value = '';
        
        // If currently logged in, log them out after a delay
        if (isLoggedIn) {
            setTimeout(() => {
                handleLogout();
            }, 2000);
        }
        
    } else {
        console.log('PASSWORD CHANGE FAILED - Invalid old password');
        passwordChangeMessage.textContent = 'Invalid old password. Use your current password or "gold123" if forgotten.';
        passwordChangeMessage.className = 'error-message';
        passwordChangeMessage.classList.remove('hidden');
    }
}

function handlePriceUpdate(e) {
    console.log('=== PRICE UPDATE ATTEMPT ===');
    
    const newPriceInput = document.getElementById('newPrice');
    const updateMessage = document.getElementById('updateMessage');
    
    if (!newPriceInput || !updateMessage) {
        console.error('Required price update elements not found');
        return;
    }
    
    const newPriceValue = newPriceInput.value.trim();
    const newPrice = parseFloat(newPriceValue);
    
    console.log('New price input:', newPriceValue);
    console.log('Parsed price:', newPrice);
    
    // Clear previous messages
    updateMessage.classList.add('hidden');
    updateMessage.textContent = '';
    updateMessage.className = '';
    
    // Validate price
    if (isNaN(newPrice) || newPrice <= 0) {
        console.log('Invalid price entered');
        updateMessage.textContent = 'Please enter a valid positive price in INR.';
        updateMessage.className = 'error-message';
        updateMessage.classList.remove('hidden');
        return;
    }
    
    // CRITICAL: Update the current price
    console.log('Previous price:', currentPrice);
    currentPrice = Math.round(newPrice); // Round to nearest rupee
    console.log('New price set to:', currentPrice);
    
    // CRITICAL: Update the main price display immediately
    updatePriceDisplay();
    
    // CRITICAL: Update timestamp immediately  
    updateTimestamp();
    
    console.log('Price and timestamp updated successfully');
    
    // Show success message
    updateMessage.textContent = `Gold price successfully updated to ₹${currentPrice.toLocaleString('en-IN')} per 10gm`;
    updateMessage.className = 'success-message';
    updateMessage.classList.remove('hidden');
    
    // Clear input
    newPriceInput.value = '';
    
    console.log('=== PRICE UPDATE COMPLETE ===');
}

function handleLogout(e) {
    if (e) e.preventDefault();
    console.log('=== LOGOUT ===');
    isLoggedIn = false;
    showLoginForm();
    clearAdminPanel();
}

function showAdminPanel() {
    console.log('Showing admin panel');
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginForm && adminPanel) {
        loginForm.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        console.log('Admin panel shown, login form hidden');
    } else {
        console.error('Could not find loginForm or adminPanel elements');
        console.log('loginForm exists:', !!loginForm);
        console.log('adminPanel exists:', !!adminPanel);
    }
}

function showLoginForm() {
    console.log('Showing login form');
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginForm && adminPanel) {
        adminPanel.classList.add('hidden');
        loginForm.classList.remove('hidden');
        console.log('Login form shown, admin panel hidden');
    } else {
        console.error('Could not find loginForm or adminPanel elements');
        console.log('loginForm exists:', !!loginForm);
        console.log('adminPanel exists:', !!adminPanel);
    }
}

function clearLoginForm() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (loginError) {
        loginError.classList.add('hidden');
        loginError.textContent = '';
    }
    
    console.log('Login form cleared');
}

function clearAdminPanel() {
    const newPriceInput = document.getElementById('newPrice');
    const updateMessage = document.getElementById('updateMessage');
    
    if (newPriceInput) newPriceInput.value = '';
    if (updateMessage) {
        updateMessage.classList.add('hidden');
        updateMessage.textContent = '';
        updateMessage.className = '';
    }
    
    console.log('Admin panel cleared');
}

function updatePriceDisplay() {
    console.log('=== UPDATING PRICE DISPLAY ===');
    const priceElement = document.getElementById('currentPrice');
    if (priceElement) {
        const formattedPrice = `₹${currentPrice.toLocaleString('en-IN')}`;
        priceElement.textContent = formattedPrice;
        console.log('Price display updated to:', formattedPrice);
        console.log('Price element content is now:', priceElement.textContent);
    } else {
        console.error('Price element with ID "currentPrice" not found!');
    }
    console.log('=== PRICE DISPLAY UPDATE COMPLETE ===');
}

function updateTimestamp() {
    console.log('=== UPDATING TIMESTAMP ===');
    const timestampElement = document.getElementById('lastUpdated');
    if (timestampElement) {
        const now = new Date();
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata'
        };
        
        const formattedTime = now.toLocaleDateString('en-IN', options) + ' IST';
        timestampElement.textContent = formattedTime;
        console.log('Timestamp updated to:', formattedTime);
        console.log('Timestamp element content is now:', timestampElement.textContent);
    } else {
        console.error('Timestamp element with ID "lastUpdated" not found!');
    }
    console.log('=== TIMESTAMP UPDATE COMPLETE ===');
}