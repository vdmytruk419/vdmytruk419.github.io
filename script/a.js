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

    document.getElementById('create-position-button').addEventListener('click', function() {
        document.getElementById('create-position-form').style.display = 'none';
        document.getElementById('prefix-squares-form').style.display = 'flex';
    });

    document.getElementById('next-button').addEventListener('click', function() {
        const prefix = document.getElementById('prefix').value;
        const squaresCount = parseInt(document.getElementById('squares-count').value);
        const checkboxesDiv = document.getElementById('checkboxes');
        checkboxesDiv.innerHTML = '';

        for (let i = 1; i <= squaresCount; i++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = prefix + ' ' + i;
            checkbox.name = 'squares';
            checkbox.value = prefix + ' ' + i;
            checkbox.checked = true;

            const label = document.createElement('label');
            label.htmlFor = prefix + ' ' + i;
            label.textContent = prefix + ' ' + i;

            const div = document.createElement('div'); // Обгортаємо в div
            div.style.marginTop = '10px'; // Додаємо марджин

            div.appendChild(checkbox);
            div.appendChild(label);

            checkboxesDiv.appendChild(div); // Додаємо div до checkboxesDiv
        }

        document.getElementById('prefix-squares-form').style.display = 'none';
        document.getElementById('checkbox-list').style.display = 'flex';
    });

    function displayPositions() {
        const positionsList = document.getElementById('positions-list');
        positionsList.innerHTML = '';

        const positions = JSON.parse(localStorage.getItem('positions')) || [];

        positions.forEach(position => {
            const positionDiv = document.createElement('div');
            positionDiv.innerHTML = `<strong>${position.name}:</strong> ${position.squares[0]} ... ${position.squares[position.squares.length - 1]}`;
            positionsList.appendChild(positionDiv);
        });
    }

    displayPositions();

    document.getElementById('submit-checkboxes').addEventListener('click', function() {
        const positionName = document.getElementById('position-name').value;
        const selectedSquares = [];
        const checkboxes = document.querySelectorAll('#checkboxes input[type="checkbox"]:checked');

        checkboxes.forEach(checkbox => {
            selectedSquares.push(checkbox.value);
        });

        const positionData = {
            name: positionName,
            squares: selectedSquares
        };

        let positions = JSON.parse(localStorage.getItem('positions')) || [];
        positions.push(positionData);
        localStorage.setItem('positions', JSON.stringify(positions));

        displayPositions(); // Оновлюємо список позицій
        document.getElementById('checkbox-list').style.display = 'none';
        document.getElementById('create-position-form').style.display = 'flex';
    });
});