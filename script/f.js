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

    function populatePositions() {
        const positionSelect = document.getElementById('position-select');
        positionSelect.innerHTML = '';

        const positions = JSON.parse(localStorage.getItem('positions')) || [];

        positions.forEach(position => {
            const option = document.createElement('option');
            option.value = position.name;
            option.textContent = position.name;
            positionSelect.appendChild(option);
        });
    }

    populatePositions(); // Заповнюємо список при завантаженні сторінки

    document.getElementById('forward-button').addEventListener('click', function() {
        document.getElementById('position-container').classList.add('hidden');
        document.getElementById('device-quantity-form').classList.remove('hidden');
    });

    document.getElementById('next-button').addEventListener('click', function() {
        const username = localStorage.getItem('username');
        const position = document.getElementById('position-select').value;
        const device = document.getElementById('device').value;
        const quantity = document.getElementById('quantity').value;

        let fpv = JSON.parse(localStorage.getItem('fpv')) || {};
        fpv[username] = {
            position: position,
            device: device,
            quantity: quantity
        };
        localStorage.setItem('fpv', JSON.stringify(fpv));
        
        window.location.href = 'f2.html';
    });
});
