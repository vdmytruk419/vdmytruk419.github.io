document.addEventListener('DOMContentLoaded', function() {
    const usernameDisplay = document.getElementById('username-display');
    const logoutButton = document.getElementById('logout-button');

    // Відображення імені користувача
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username-display').textContent = username;
    } else {
        window.location.href = '../index.html';
    }

    // Обробник кнопки виходу
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('username');
        window.location.href = '../index.html';
    });

    function displayApprovedTargets() {
        const approvedTargetsList = document.getElementById('approved-targets-list');
        approvedTargetsList.innerHTML = '';

        const targets = JSON.parse(localStorage.getItem('targets')) || [];

        targets.forEach(target => {
            if (target.status === 'Approved') {
                const targetDiv = document.createElement('div');
                targetDiv.innerHTML = `
                    <strong>Квадрати:</strong> ${target.squares}<br>
                    <strong>Тип цілі:</strong> ${target.targetType}<br>
                    <strong>Опис цілі:</strong> ${target.targetDescription}<br>
                    <strong>Створено:</strong> ${target.username}
                `;
                approvedTargetsList.appendChild(targetDiv);
            }
        });
    }

    displayApprovedTargets();
});
