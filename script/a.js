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
            div.className = 'mt-2 flex items-center gap-2';

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
            positionDiv.className = 'mb-2 border border-gray-300 rounded p-4';
    
            const nameDiv = document.createElement('div');
            nameDiv.className = 'flex items-center justify-between font-bold bg-gray-200 p-2 mb-2';
    
            const nameText = document.createElement('span');
            nameText.textContent = position.name;
            nameDiv.appendChild(nameText);
    
            const deletePositionButton = document.createElement('button');
            deletePositionButton.className = 'bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded text-sm cursor-pointer';
            deletePositionButton.textContent = '-';
            deletePositionButton.addEventListener('click', function() {
                deletePosition(position.name);
            });
            nameDiv.appendChild(deletePositionButton);
    
            positionDiv.appendChild(nameDiv);
    
            const squaresDiv = document.createElement('div');
            squaresDiv.className = 'flex items-center m-1';
            if (position.squares.length > 0) {
                squaresDiv.textContent = `${position.squares[0]} ... ${position.squares[position.squares.length - 1]}`;
                const deleteButton = document.createElement('button');
                deleteButton.className = 'ml-auto bg-gray-300 text-gray-700 py-1 px-2 rounded text-sm cursor-pointer';
                deleteButton.textContent = '-';
                deleteButton.addEventListener('click', function() {
                    deleteSquares(position.name);
                });
                squaresDiv.appendChild(deleteButton);
            }
    
            positionDiv.appendChild(squaresDiv);
    
            const addButton = document.createElement('button');
            addButton.className = 'm-1 bg-gray-300 text-gray-700 py-1 px-2 rounded text-sm cursor-pointer';
            addButton.textContent = '+ додати квадрати';
            positionDiv.appendChild(addButton);
    
            positionsList.appendChild(positionDiv);
        });
    }
    
    function deletePosition(positionName) {
        let positions = JSON.parse(localStorage.getItem('positions')) || [];
        positions = positions.filter(position => position.name !== positionName);
        localStorage.setItem('positions', JSON.stringify(positions));
        displayPositions();
    }
    
    function deleteSquares(positionName) {
        let positions = JSON.parse(localStorage.getItem('positions')) || [];
        const positionIndex = positions.findIndex(p => p.name === positionName);
    
        if (positionIndex !== -1) {
            positions[positionIndex].squares = [];
            localStorage.setItem('positions', JSON.stringify(positions));
            displayPositions(); // Оновлюємо список
        }
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