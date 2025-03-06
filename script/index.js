document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    localStorage.setItem('username', username);
    if (username.toLowerCase().startsWith('mavic')) {
        window.location.href = 'page/m.html';
    } else if (username.toLowerCase().startsWith('fpv')) {
        window.location.href = 'page/f.html';
    } else if(username.toLowerCase().startsWith('superadmin')) {
        window.location.href = 'page/a.html';
    } else if(username.toLowerCase().startsWith('dutymavic')) {
        window.location.href = 'page/dm.html';
    } else if(username.toLowerCase().startsWith('admin17')) {
        window.location.href = 'page/board.html';
    } else {
        window.location.href = '404.html';
    }
});

function checkNotificationsPermission() {
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Дозвіл на сповіщення отримано!');
            } else {
                console.log('Дозвіл на сповіщення відхилено!');
            }
        });
    } else if (Notification.permission === 'granted') {
        console.log('Сповіщення вже дозволені!');
    } else {
        console.log('Сповіщення заборонені!');
    }
}

checkNotificationsPermission(); // Перевіряємо дозвіл при завантаженні сторінки

