document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username-display').textContent = username;
    } else {
        window.location.href = '../index.html';
    }

    document.getElementById('logout-button').addEventListener('click', function() {
        localStorage.removeItem('username');
        window.location.href = '../index.html';
    });

    document.getElementById('forward-button').addEventListener('click', function() {
        // Тут буде логіка для переходу до наступного контейнера
        alert('Кнопка "Вперед" натиснута'); // Замініть на ваш код
    });
});
