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
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form listener attached');
    } else {
        console.error('Login form not found');
    }
    
    // Change password form submission
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
        console.log('Change password form listener attached');
    } else {
        console.error('Change password form not found');
    }
    
    // Price update form submission
    const priceForm = document.getElementById('priceUpdateForm');
    if (priceForm) {
        priceForm.addEventListener('submit', handlePriceUpdate);
        console.log('Price update form listener attached');
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        console.log('Logout button listener attached');
    }
}

function handleLogin(e) {
    e.preventDefault();
    console.log('=== LOGIN ATTEMPT ===');
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    
    if (!usernameInput || !passwordInput || !loginError) {
        console.error('Required login elements not found');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log('Username:', username);
    console.log('Password length:', password.length);
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
    } else {
        console.log('LOGIN FAILED - Invalid credentials');
        loginError.textContent = 'Invalid username or password. Please try again.';
        loginError.className = 'error-message';
        loginError.classList.remove('hidden');
    }
}

function handlePasswordChange(e) {
    e.preventDefault();
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
    
    console.log('Old password entered:', oldPassword.length > 0 ? '[PASSWORD ENTERED]' : '[NO PASSWORD]');
    console.log('New password length:', newPassword.length);
    console.log('Current admin password:', adminPassword);
    console.log('Master password:', MASTER_PASSWORD);
    
    // Clear previous messages
    passwordChangeMessage.classList.add('hidden');
    passwordChangeMessage.textContent = '';
    
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
        console.log('New admin password set to:', adminPassword);
        
        // Show success message
        passwordChangeMessage.textContent = 'Password successfully changed! You can now login with your new password.';
        passwordChangeMessage.className = 'success-message';
        passwordChangeMessage.classList.remove('hidden');
        
        // Clear the form
        oldPasswordInput.value = '';
        newPasswordInput.value = '';
        
        // If currently logged in, log them out
        if (isLoggedIn) {
            setTimeout(handleLogout, 2000);
        }
        
    } else {
        console.log('PASSWORD CHANGE FAILED - Invalid old password');
        passwordChangeMessage.textContent = 'Invalid old password. Use your current password or "gold123" if forgotten.';
        passwordChangeMessage.className = 'error-message';
        passwordChangeMessage.classList.remove('hidden');
    }
}

function handlePriceUpdate(e) {
    e.preventDefault();
    console.log('=== PRICE UPDATE ATTEMPT ===');
    
    const newPriceInput = document.getElementById('newPrice');
    const updateMessage = document.getElementById('updateMessage');
    
    if (!newPriceInput || !updateMessage) {
        console.error('Required price update elements not found');
        return;
    }
    
    const newPriceValue = newPriceInput.value.trim();
    const newPrice = parseInt(newPriceValue);
    
    console.log('New price input:', newPriceValue);
    console.log('Parsed price:', newPrice);
    
    // Clear previous messages
    updateMessage.classList.add('hidden');
    updateMessage.textContent = '';
    
    // Validate price
    if (isNaN(newPrice) || newPrice <= 0) {
        console.log('Invalid price entered');
        updateMessage.textContent = 'Please enter a valid positive price in INR.';
        updateMessage.className = 'error-message';
        updateMessage.classList.remove('hidden');
        return;
    }
    
    // Update price
    currentPrice = newPrice;
    updatePriceDisplay();
    updateTimestamp();
    
    console.log('Price updated successfully to:', newPrice);
    
    // Show success message
    updateMessage.textContent = `Gold price successfully updated to ₹${newPrice.toLocaleString('en-IN')} per 10gm`;
    updateMessage.className = 'success-message';
    updateMessage.classList.remove('hidden');
    
    // Clear input
    newPriceInput.value = '';
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
    }
    
    console.log('Admin panel cleared');
}

function updatePriceDisplay() {
    const priceElement = document.getElementById('currentPrice');
    if (priceElement) {
        priceElement.textContent = `₹${currentPrice.toLocaleString('en-IN')}`;
        console.log('Price display updated to:', priceElement.textContent);
    } else {
        console.error('Price element not found');
    }
}

function updateTimestamp() {
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
    } else {
        console.error('Timestamp element not found');
    }
}