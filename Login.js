// Toggle password visibility for any input
function togglePassword(id) {
    const passInput = document.getElementById(id);
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
}

// Form validation
document.getElementById('signupForm').addEventListener('submit', function(e) {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!username || !email || !password || !confirmPassword) {
        alert('All fields are required.');
        e.preventDefault();
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        e.preventDefault();
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        e.preventDefault();
        return;
    }

    // Optional: Save username/email to localStorage if "Remember Me" is added later
});
