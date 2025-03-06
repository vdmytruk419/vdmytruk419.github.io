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

    const targetCard = document.getElementById('target-card');
    const resultButton = document.getElementById('result-button');
    const resultDropdown = document.getElementById('result-dropdown');
    const saveButton = document.getElementById('save-button');

    // Отримання takeoffId з параметрів URL
    const urlParams = new URLSearchParams(window.location.search);
    const takeoffId = urlParams.get('id');

    if (!takeoffId) {
        targetCard.textContent = 'Помилка: ID не знайдено.';
        return;
    }

    // Пошук takeoff в localStorage
    const takeoffs = JSON.parse(localStorage.getItem('takeoffs')) || [];
    const takeoff = takeoffs.find(t => t.id === takeoffId);

    if (!takeoff) {
        targetCard.textContent = 'Помилка: Виліт не знайдено.';
        return;
    }

    // Пошук target в localStorage
    const targets = JSON.parse(localStorage.getItem('targets')) || [];
    const target = targets.find(t => t.id === takeoff.target);

    if (!target) {
        targetCard.textContent = 'Помилка: Ціль не знайдена.';
        return;
    }

    // Відображення даних target
    targetCard.innerHTML = `
        <h3 class="bg-green-200 p-2 font-semibold mb-2 text-xl text-center">${target.squares}</h3>
        <div class="p-4 pt-0">
            <p>${target.targetType}</p>
            <p>${target.targetDescription || ''}</p>
            <p>Світить: ${target.username}</p>
        </div>
    `;

    resultButton.addEventListener('click', function() {
        resultButton.classList.add('hidden');
        resultDropdown.classList.remove('hidden');
        saveButton.classList.remove('hidden');
    });

    saveButton.addEventListener('click', function() {
        const result = document.getElementById('result-select').value;

        // Оновлення takeoff в localStorage
        const updatedTakeoffs = takeoffs.map(t => {
            if (t.id === takeoffId) {
                return { ...t, result: result };
            }
            return t;
        });

        localStorage.setItem('takeoffs', JSON.stringify(updatedTakeoffs));

        console.log('Результат збережено:', result);
        alert('Результат збережено.');

        // Перехід на сторінку f2.html
        window.location.href = 'f2.html';
    });
});
