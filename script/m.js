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

    document.getElementById('fly-button').addEventListener('click', function() {
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('fly-content').style.display = 'flex';
    });

    document.getElementById('target-button').addEventListener('click', function() {
        document.getElementById('fly-content').style.display = 'none';
        document.getElementById('target-form').style.display = 'flex';
    });

    document.getElementById('target-data-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const targetId = document.getElementById('target-form-id').value; // Отримуємо ID з форми
        const squares = document.getElementById('squares').value;
        const targetType = document.getElementById('target-type').value;
        const targetDescription = document.getElementById('target-description').value;
        const username = localStorage.getItem('username');
    
        const target = {
            id: targetId ? parseInt(targetId) : Date.now(), // Використовуємо ID з форми або генеруємо новий
            squares: squares,
            targetType: targetType,
            targetDescription: targetDescription,
            username: username,
            status: 'NotApproved'
        };
    
        let targets = JSON.parse(localStorage.getItem('targets')) || [];
        if (targetId) { // Якщо ID є, редагуємо існуючий об'єкт
            const index = targets.findIndex(t => t.id === parseInt(targetId));
            if (index !== -1) {
                targets[index] = target;
            }
        } else { // Інакше додаємо новий об'єкт
            targets.push(target);
        }
        localStorage.setItem('targets', JSON.stringify(targets));
    
        document.getElementById('target-form').style.display = 'none';
        document.getElementById('target-info').style.display = 'flex';
    
        document.getElementById('target-data').innerHTML = `
            <input type="hidden" id="target-id" value="${target.id}">
            <strong>Квадрати:</strong> ${squares}<br>
            <strong>Тип цілі:</strong> ${targetType}<br>
            <strong>Опис цілі:</strong> ${targetDescription}<br>
            <strong>Створено:</strong> ${username}<br>
            <strong>Статус:</strong> NotApproved
        `;
    });

    document.getElementById('edit-target-button').addEventListener('click', function() {
        const targetId = document.getElementById('target-id').value;
        const targets = JSON.parse(localStorage.getItem('targets')) || [];
        const target = targets.find(t => t.id === parseInt(targetId));
    
        if (target) {
            document.getElementById('target-form-id').value = target.id; // Заповнюємо ID в формі
            document.getElementById('squares').value = target.squares;
            document.getElementById('target-type').value = target.targetType;
            document.getElementById('target-description').value = target.targetDescription;
    
            document.getElementById('target-info').style.display = 'none';
            document.getElementById('target-form').style.display = 'flex';
        }
    });

    document.getElementById('return-button').addEventListener('click', function() {
        document.getElementById('fly-content').style.display = 'none';
        document.getElementById('return-form').style.display = 'flex';
    });

    document.getElementById('return-fly-button').addEventListener('click', function() {
        document.getElementById('target-info').style.display = 'none';
        document.getElementById('return-form').style.display = 'flex';
    });

    document.getElementById('tech-button').addEventListener('click', function() {
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('tech-form').style.display = 'flex';
    });

    document.getElementById('cancel-target-button').addEventListener('click', function() {
        const targetFormId = document.getElementById('target-form-id').value;
    
        if (targetFormId === '') {
            document.getElementById('target-form').style.display = 'none';
            document.getElementById('fly-content').style.display = 'flex';
        } else {
            document.getElementById('target-form').style.display = 'none';
            document.getElementById('target-info').style.display = 'flex';
        }
    });
});
