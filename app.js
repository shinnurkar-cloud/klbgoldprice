// Kalaburagi Gold Price Application
// All functionality in a single JavaScript file

// Application state variables
let currentGoldPrice = 65000; // Initial price in rupees
let isLoggedIn = false;
const adminUsername = 'admin';
let currentPassword = 'admin123';
const masterPassword = 'gold123'; // Never changes
const minPasswordLength = 6;

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kalaburagi Gold Price App initialized');
    console.log('Admin credentials: username =', adminUsername, ', password =', currentPassword);
    
    // Render initial price
    renderPrice();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set initial UI state
    updateUIState();
});

function setupEventListeners() {
    // Login button
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            console.log('Login button clicked');
            handleLogin();
        });
    }
    
    // Change password button
    const changePasswordButton = document.getElementById('changePasswordButton');
    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', function() {
            console.log('Change password button clicked');
            handleChangePassword();
        });
    }
    
    // Price update button
    const updatePriceButton = document.getElementById('updatePriceButton');
    if (updatePriceButton) {
        updatePriceButton.addEventListener('click', function() {
            console.log('Update price button clicked');
            handlePriceUpdate();
        });
    }
    
    // Logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            console.log('Logout button clicked');
            handleLogout();
        });
    }
    
    // Enter key support for login fields
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    if (usernameField && passwordField) {
        [usernameField, passwordField].forEach(field => {
            field.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleLogin();
                }
            });
        });
    }
    
    console.log('Event listeners set up');
}

function renderPrice() {
    // Format price with thousands separator
    const formattedPrice = '₹' + currentGoldPrice.toLocaleString('en-IN');
    const currentPriceElement = document.getElementById('currentPrice');
    if (currentPriceElement) {
        currentPriceElement.innerText = formattedPrice;
    }
    
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
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        lastUpdatedElement.innerText = `Last updated: ${timestamp}`;
    }
    
    console.log('Price rendered:', formattedPrice, 'at', timestamp);
}

function updateUIState() {
    const loginSection = document.getElementById('loginSection');
    const changePasswordSection = document.getElementById('changePasswordSection');
    const adminPanel = document.getElementById('adminPanel');
    
    if (isLoggedIn) {
        // Hide login and change password sections
        if (loginSection) loginSection.classList.add('hidden');
        if (changePasswordSection) changePasswordSection.classList.add('hidden');
        // Show admin panel
        if (adminPanel) adminPanel.classList.remove('hidden');
        console.log('UI updated: Admin view active');
    } else {
        // Show login and change password sections
        if (loginSection) loginSection.classList.remove('hidden');
        if (changePasswordSection) changePasswordSection.classList.remove('hidden');
        // Hide admin panel
        if (adminPanel) adminPanel.classList.add('hidden');
        console.log('UI updated: Public view active');
    }
}

function handleLogin() {
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    
    if (!usernameField || !passwordField) {
        console.error('Login fields not found');
        return;
    }
    
    const username = usernameField.value.trim();
    const password = passwordField.value;
    
    console.log('Login attempt - Entered username:', `"${username}"`);
    console.log('Login attempt - Entered password:', `"${password}"`);
    console.log('Expected username:', `"${adminUsername}"`);
    console.log('Expected password:', `"${currentPassword}"`);
    
    // Hide previous error
    if (loginError) {
        loginError.classList.add('hidden');
    }
    
    // Check credentials
    if (username === adminUsername && password === currentPassword) {
        isLoggedIn = true;
        
        // Clear login fields
        usernameField.value = '';
        passwordField.value = '';
        
        // Update UI to show admin panel
        updateUIState();
        
        console.log('✅ Login successful for user:', username);
    } else {
        // Show error message
        if (loginError) {
            loginError.innerText = 'Invalid username or password';
            loginError.classList.remove('hidden');
        }
        console.log('❌ Login failed');
        console.log('Username match:', username === adminUsername);
        console.log('Password match:', password === currentPassword);
    }
}

function handleLogout() {
    isLoggedIn = false;
    
    // Clear all form fields
    const fields = ['username', 'password', 'newPrice', 'oldPassword', 'newPassword'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
    
    // Hide all messages
    hideAllMessages();
    
    // Update UI to show public view
    updateUIState();
    
    console.log('✅ User logged out successfully');
}

function handleChangePassword() {
    const oldPasswordField = document.getElementById('oldPassword');
    const newPasswordField = document.getElementById('newPassword');
    const changePasswordError = document.getElementById('changePasswordError');
    const changePasswordSuccess = document.getElementById('changePasswordSuccess');
    
    if (!oldPasswordField || !newPasswordField) {
        console.error('Password change fields not found');
        return;
    }
    
    const oldPassword = oldPasswordField.value;
    const newPassword = newPasswordField.value;
    
    // Hide previous messages
    if (changePasswordError) changePasswordError.classList.add('hidden');
    if (changePasswordSuccess) changePasswordSuccess.classList.add('hidden');
    
    // Validate old password (must match current password OR master password)
    if (oldPassword !== currentPassword && oldPassword !== masterPassword) {
        if (changePasswordError) {
            changePasswordError.innerText = 'Invalid current password';
            changePasswordError.classList.remove('hidden');
        }
        console.log('❌ Password change failed: Invalid current password');
        return;
    }
    
    // Validate new password length
    if (newPassword.length < minPasswordLength) {
        if (changePasswordError) {
            changePasswordError.innerText = `New password must be at least ${minPasswordLength} characters long`;
            changePasswordError.classList.remove('hidden');
        }
        console.log('❌ Password change failed: Password too short');
        return;
    }
    
    // Update password
    currentPassword = newPassword;
    if (changePasswordSuccess) {
        changePasswordSuccess.innerText = 'Password changed successfully';
        changePasswordSuccess.classList.remove('hidden');
    }
    
    // Clear form fields
    oldPasswordField.value = '';
    newPasswordField.value = '';
    
    console.log('✅ Password changed successfully');
}

function handlePriceUpdate() {
    const newPriceInput = document.getElementById('newPrice');
    const priceUpdateError = document.getElementById('priceUpdateError');
    const priceUpdateSuccess = document.getElementById('priceUpdateSuccess');
    
    if (!newPriceInput) {
        console.error('New price input not found');
        return;
    }
    
    const newPriceValue = parseFloat(newPriceInput.value);
    
    // Hide previous messages
    if (priceUpdateError) priceUpdateError.classList.add('hidden');
    if (priceUpdateSuccess) priceUpdateSuccess.classList.add('hidden');
    
    // Validate new price
    if (isNaN(newPriceValue) || newPriceValue <= 0) {
        if (priceUpdateError) {
            priceUpdateError.innerText = 'Please enter a valid price greater than 0';
            priceUpdateError.classList.remove('hidden');
        }
        console.log('❌ Price update failed: Invalid price value');
        return;
    }
    
    // Update price
    const oldPrice = currentGoldPrice;
    currentGoldPrice = newPriceValue;
    
    // Render updated price immediately
    renderPrice();
    
    // Show success message
    if (priceUpdateSuccess) {
        priceUpdateSuccess.innerText = 'Price updated successfully';
        priceUpdateSuccess.classList.remove('hidden');
    }
    
    // Clear form
    newPriceInput.value = '';
    
    console.log('✅ Price updated successfully from ₹' + oldPrice.toLocaleString('en-IN') + ' to ₹' + currentGoldPrice.toLocaleString('en-IN'));
}

function hideAllMessages() {
    const messageIds = ['loginError', 'changePasswordError', 'changePasswordSuccess', 'priceUpdateError', 'priceUpdateSuccess'];
    messageIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
    });
}