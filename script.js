document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    localStorage.setItem('username', username);
    if (username.toLowerCase().startsWith('mavic')) {
        window.location.href = 'page/m.html';
    } else if (username.toLowerCase().startsWith('fpv')) {
        window.location.href = 'page/f.html';
    } else {
        window.location.href = '404.html';
    }
});