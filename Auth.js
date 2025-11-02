// Toggle password visibility
function togglePassword(id) {
    const passInput = document.getElementById(id);
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
}

// ---- LOGIN FUNCTIONALITY ----
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
        document.getElementById('logUsername').value = remembered;
        document.getElementById('rememberMe').checked = true;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('logUsername').value.trim();
        const password = document.getElementById('logPassword').value.trim();
        const remember = document.getElementById('rememberMe').checked;

        if (!username || !password) {
            alert('Please fill all fields!');
            return;
        }

        // Save username in localStorage if Remember Me is checked
        if (remember) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        alert(`Logged in as ${username}`);
        loginForm.reset();
    });
}

// ---- SIGN UP FUNCTIONALITY ----
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('signUsername').value.trim();
        const email = document.getElementById('signEmail').value.trim();
        const password = document.getElementById('signPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        if (!username || !email || !password || !confirmPassword) {
            alert('Please fill all fields!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters!');
            return;
        }

        alert(`Account created for ${username}`);
        signupForm.reset();
    });
}
