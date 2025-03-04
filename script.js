document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    localStorage.setItem('username', username); // Зберігаємо ім'я в localStorage
    if (username.toLowerCase().startsWith('mavic')) {
        window.location.href = 'page-m.html';
    } else {
        window.location.href = '404.html';
    }
});
