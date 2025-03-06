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
        approvedTargetsList.className = 'flex flex-wrap items-start'; // Додаємо items-start

        const targets = JSON.parse(localStorage.getItem('targets')) || [];

        targets.forEach(target => {
            if (target.status === 'Approved') {
                const card = document.createElement('div');
                card.className = 'border border-gray-300 rounded m-1 w-64';

                const cardTitle = document.createElement('h3');
                cardTitle.className = 'bg-gray-200 p-1 font-semibold mb-1';
                cardTitle.textContent = `${target.squares}`;
                card.appendChild(cardTitle);

                const cardDetails = document.createElement('div');
                cardDetails.className = 'p-2';
                let detailsHTML = `${target.targetType}<br>`;
                if (target.targetDescription) {
                    detailsHTML += `${target.targetDescription}<br>`;
                }
                detailsHTML += `<strong>Світить:</strong> ${target.username}`;
                cardDetails.innerHTML = detailsHTML;
                card.appendChild(cardDetails);

                const takeButton = document.createElement('button');
                takeButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2 mx-auto block mb-2';
                takeButton.textContent = 'Взяти';
                takeButton.addEventListener('click', function() {
                    takeTarget(target);
                });
                card.appendChild(takeButton);

                approvedTargetsList.appendChild(card);
            }
        });
    }

    function takeTarget(target) {
        let targets = JSON.parse(localStorage.getItem('targets')) || [];
        const index = targets.findIndex(t => t.id === target.id); // Використовуємо target.id

        if (index !== -1) {
            targets[index].status = 'InProgress';
            localStorage.setItem('targets', JSON.stringify(targets));

            // Додаємо запис в fpv
            const username = localStorage.getItem('username');
            let fpv = JSON.parse(localStorage.getItem('fpv')) || {};
            if (!fpv[username]) {
                fpv[username] = {};
            }
            fpv[username].target = target.id; // Записуємо target.id

            localStorage.setItem('fpv', JSON.stringify(fpv));

            displayInProgressTargets();
            displayApprovedTargets();

            window.location.href = 'f3.html'; // Додаємо перехід на f3.html
        }
    }

    function displayInProgressTargets() {
        const inProgressTargetsList = document.getElementById('in-progress-targets-list');
        inProgressTargetsList.innerHTML = '';

        const targets = JSON.parse(localStorage.getItem('targets')) || [];

        targets.forEach(target => {
            if (target.status === 'InProgress') {
                const card = document.createElement('div');
                card.className = 'border border-gray-300 rounded m-1 w-64 cursor-pointer'; // Додаємо cursor-pointer
                card.addEventListener('click', function() {
                    handleInProgressCardClick(target); // Додаємо обробник кліку
                });

                const cardTitle = document.createElement('h3');
                cardTitle.className = 'bg-gray-200 p-1 font-semibold mb-1';
                cardTitle.textContent = `${target.squares}`;
                card.appendChild(cardTitle);

                const cardDetails = document.createElement('div');
                cardDetails.className = 'p-2';
                let detailsHTML = `${target.targetType}<br>`;
                if (target.targetDescription) {
                    detailsHTML += `${target.targetDescription}<br>`;
                }
                detailsHTML += `<strong>Світить:</strong> ${target.username}`;
                cardDetails.innerHTML = detailsHTML;
                card.appendChild(cardDetails);

                inProgressTargetsList.appendChild(card);
            }
        });
    }

    function handleInProgressCardClick(target) {
        window.location.href = 'f3.html'; // Перехід на f3.html
    }

    function displayUserPosition() {
        const positionInfo = document.getElementById('position-info');
        const username = localStorage.getItem('username');
        const fpv = JSON.parse(localStorage.getItem('fpv')) || {};

        if (fpv[username]) {
            positionInfo.innerHTML = `
                <strong>Позиція:</strong> ${fpv[username].position}<br>
                <strong>Засіб:</strong> ${fpv[username].device}<br>
                <strong>Кількість:</strong> ${fpv[username].quantity}
            `;
        } else {
            positionInfo.textContent = 'Позиція не знайдена.';
        }
    }

    displayUserPosition();
    displayInProgressTargets();
    displayApprovedTargets();
});
