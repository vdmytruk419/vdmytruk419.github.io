document.addEventListener('DOMContentLoaded', function() {
    const usernameDisplay = document.getElementById('username-display');
    const logoutButton = document.getElementById('logout-button');

    // Відображення імені користувача
    const username = localStorage.getItem('username');
    if (username) {
        usernameDisplay.textContent = username;
    } else {
        window.location.href = '../index.html';
    }

    // Обробник кнопки виходу
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('username');
        window.location.href = '../index.html';
    });

    const takeoffButton = document.getElementById('takeoff-button');
    takeoffButton.addEventListener('click', function() {
        const modelInput = document.getElementById('model');
        const bkInput = document.getElementById('bk');

        if (!modelInput.reportValidity() || !bkInput.reportValidity()) {
            return;
        }

        const username = localStorage.getItem('username');
        const fpv = JSON.parse(localStorage.getItem('fpv')) || {};
        const targetId = fpv[username] && fpv[username].target;

        if (!targetId) {
            alert('Ціль не знайдена.');
            return;
        }

        const takeoffId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5); // Генеруємо унікальне ID

        const takeoff = {
            id: takeoffId, // Додаємо ID до об'єкта takeoff
            crew: username,
            target: targetId,
            model: modelInput.value,
            bk: bkInput.value
        };

        let takeoffs = JSON.parse(localStorage.getItem('takeoffs')) || [];
        takeoffs.push(takeoff);

        localStorage.setItem('takeoffs', JSON.stringify(takeoffs));

        window.location.href = `f4.html?id=${takeoffId}`; // Передаємо ID як параметр
    });
});
