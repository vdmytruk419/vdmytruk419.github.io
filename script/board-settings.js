document.addEventListener('DOMContentLoaded', function() {
    // Отримання імені користувача з localStorage
    const username = localStorage.getItem('username');

    // Відображення імені користувача
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = username;
    }

    // Обробник події для кнопки виходу
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Очищення localStorage тільки для імені користувача
            localStorage.removeItem('username');

            // Перенаправлення на сторінку входу
            window.location.href = '../index.html';
        });
    }

    // Відображення списку екіпажів
    const crewsListTextarea = document.getElementById('crews-list');
    if (crewsListTextarea) {
        let crews = JSON.parse(localStorage.getItem('crews')) || ["Альянс", "Дача", "Оливка", "Легенда", "Вежа"];
        crewsListTextarea.value = crews.join('\n');
    }

    // Обробник події для кнопки "Зберегти"
    const saveSettingsButton = document.getElementById('save-settings-button');
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', function() {
            const crewsList = crewsListTextarea.value.split('\n');
            localStorage.setItem('crews', JSON.stringify(crewsList));
            alert('Налаштування збережено');
        });
    }
});
