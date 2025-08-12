// Kalaburagi Gold Price Application
// All functionality in a single JavaScript file

// Application state variables
let currentGoldPrice = 65000; // Initial price in rupees
let isLoggedIn = false;
let adminUsername = 'admin';
let currentPassword = 'admin123';
const masterPassword = 'gold123'; // Never changes
const minPasswordLength = 6;

// DOM elements - all present from start
let currentPriceElement;
let lastUpdatedElement;
let loginSection;
let changePasswordSection;
let adminPanel;
let loginForm;
let changePasswordForm;
let priceUpdateForm;
let loginError;
let changePasswordError;
let changePasswordSuccess;
let priceUpdateError;
let priceUpdateSuccess;
let logoutButton;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kalaburagi Gold Price App initialized');
    
    // Get all DOM elements
    initializeElements();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial price
    renderPrice();
    
    // Set initial UI state
    updateUIState();
});

function initializeElements() {
    currentPriceElement = document.getElementById('currentPrice');
    lastUpdatedElement = document.getElementById('lastUpdated');
    loginSection = document.getElementById('loginSection');
    changePasswordSection = document.getElementById('changePasswordSection');
    adminPanel = document.getElementById('adminPanel');
    loginForm = document.getElementById('loginForm');
    changePasswordForm = document.getElementById('changePasswordForm');
    priceUpdateForm = document.getElementById('priceUpdateForm');
    loginError = document.getElementById('loginError');
    changePasswordError = document.getElementById('changePasswordError');
    changePasswordSuccess = document.getElementById('changePasswordSuccess');
    priceUpdateError = document.getElementById('priceUpdateError');
    priceUpdateSuccess = document.getElementById('priceUpdateSuccess');
    logoutButton = document.getElementById('logoutButton');
    
    console.log('All DOM elements initialized');
}

function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Change password form
    changePasswordForm.addEventListener('submit', handleChangePassword);
    
    // Price update form
    priceUpdateForm.addEventListener('submit', handlePriceUpdate);
    
    // Logout button
    logoutButton.addEventListener('click', handleLogout);
    
    console.log('Event listeners set up');
}

function renderPrice() {
    // Format price with thousands separator
    const formattedPrice = '₹' + currentGoldPrice.toLocaleString('en-IN');
    currentPriceElement.innerText = formattedPrice;
    
    // Update timestamp
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    lastUpdatedElement.innerText = `Last updated: ${timestamp}`;
    
    console.log('Price rendered:', formattedPrice, 'at', timestamp);
}

function updateUIState() {
    if (isLoggedIn) {
        // Hide login and change password sections
        loginSection.classList.add('hidden');
        changePasswordSection.classList.add('hidden');
        // Show admin panel
        adminPanel.classList.remove('hidden');
        console.log('UI updated: Admin view');
    } else {
        // Show login and change password sections
        loginSection.classList.remove('hidden');
        changePasswordSection.classList.remove('hidden');
        // Hide admin panel
        adminPanel.classList.add('hidden');
        console.log('UI updated: Public view');
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    hideMessage(loginError);
    
    if (username === adminUsername && password === currentPassword) {
        isLoggedIn = true;
        updateUIState();
        
        // Clear login form
        loginForm.reset();
        
        console.log('Login successful for user:', username);
    } else {
        showMessage(loginError, 'Invalid username or password');
        console.log('Login failed for user:', username);
    }
}

function handleLogout() {
    isLoggedIn = false;
    updateUIState();
    
    // Clear all forms and messages
    loginForm.reset();
    priceUpdateForm.reset();
    hideAllMessages();
    
    console.log('User logged out');
}

function handleChangePassword(event) {
    event.preventDefault();
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    
    hideMessage(changePasswordError);
    hideMessage(changePasswordSuccess);
    
    // Validate old password (must match current password OR master password)
    if (oldPassword !== currentPassword && oldPassword !== masterPassword) {
        showMessage(changePasswordError, 'Invalid current password');
        console.log('Password change failed: Invalid current password');
        return;
    }
    
    // Validate new password length
    if (newPassword.length < minPasswordLength) {
        showMessage(changePasswordError, `New password must be at least ${minPasswordLength} characters long`);
        console.log('Password change failed: Password too short');
        return;
    }
    
    // Update password
    currentPassword = newPassword;
    showMessage(changePasswordSuccess, 'Password changed successfully');
    
    // Clear form
    changePasswordForm.reset();
    
    console.log('Password changed successfully');
}

function handlePriceUpdate(event) {
    event.preventDefault();
    
    const newPriceInput = document.getElementById('newPrice');
    const newPriceValue = parseFloat(newPriceInput.value);
    
    hideMessage(priceUpdateError);
    hideMessage(priceUpdateSuccess);
    
    // Validate new price
    if (isNaN(newPriceValue) || newPriceValue <= 0) {
        showMessage(priceUpdateError, 'Please enter a valid price greater than 0');
        console.log('Price update failed: Invalid price value');
        return;
    }
    
    // Update price
    currentGoldPrice = newPriceValue;
    
    // Render updated price immediately
    renderPrice();
    
    // Show success message
    showMessage(priceUpdateSuccess, 'Price updated successfully');
    
    // Clear form
    newPriceInput.value = '';
    
    console.log('Price updated successfully to:', currentGoldPrice);
}

function showMessage(element, message) {
    element.innerText = message;
    element.classList.remove('hidden');
}

function hideMessage(element) {
    element.classList.add('hidden');
}

function hideAllMessages() {
    hideMessage(loginError);
    hideMessage(changePasswordError);
    hideMessage(changePasswordSuccess);
    hideMessage(priceUpdateError);
    hideMessage(priceUpdateSuccess);
}