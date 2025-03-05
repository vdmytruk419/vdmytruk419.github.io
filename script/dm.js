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

    function displayNotApprovedTargets() {
        const targetsList = document.getElementById('targets-list');
        targetsList.innerHTML = '';

        const targets = JSON.parse(localStorage.getItem('targets')) || [];

        targets.forEach(target => {
            if (target.status === 'NotApproved') {
                const targetDiv = document.createElement('div');
                targetDiv.classList.add('dm-target');
                targetDiv.innerHTML = `
                    <div>${target.username}</div>
                    <div>${target.targetType}</div>
                    <div>${target.squares}</div>
                    <button class="approve-button" data-id="${target.id}">Підтвердити</button>
                    <button class="cancel-button" data-id="${target.id}">Скасувати</button>
                `;
                targetsList.appendChild(targetDiv);
            }
        });

        // Додаємо обробник подій для кнопок підтвердження
        const approveButtons = document.querySelectorAll('.approve-button');
        approveButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = parseInt(this.dataset.id);
                approveTarget(targetId);
            });
        });

        const cancelButtons = document.querySelectorAll('.cancel-button');
        cancelButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = parseInt(this.dataset.id);
                cancelTarget(targetId);
            });
        });
    }

    function approveTarget(targetId) {
        let targets = JSON.parse(localStorage.getItem('targets')) || [];
        const targetIndex = targets.findIndex(t => t.id === targetId);

        if (targetIndex !== -1) {
            targets[targetIndex].status = 'Approved';
            localStorage.setItem('targets', JSON.stringify(targets));
            displayNotApprovedTargets(); // Оновлюємо список
        }
    }

    function cancelTarget(targetId) {
        let targets = JSON.parse(localStorage.getItem('targets')) || [];
        const targetIndex = targets.findIndex(t => t.id === targetId);

        if (targetIndex !== -1) {
            targets.splice(targetIndex, 1); // Видаляємо об'єкт з масиву
            localStorage.setItem('targets', JSON.stringify(targets));
            displayNotApprovedTargets();
        }
    }

    displayNotApprovedTargets();

    let previousTargets = JSON.parse(localStorage.getItem('targets')) || [];

    function monitorTargets() {
        const currentTargets = JSON.parse(localStorage.getItem('targets')) || [];
        const newTargets = currentTargets.filter(target => {
            return target.status === 'NotApproved' && !previousTargets.some(prevTarget => prevTarget.id === target.id);
        });

        if (newTargets.length > 0) {
            showNotification('З\'явилися нові цілі, що потребують підтвердження!');
            displayNotApprovedTargets();
        }

        previousTargets = currentTargets;
    }

    function showNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification(message);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(message);
                }
            });
        }
    }

    setInterval(monitorTargets, 5000);
});
