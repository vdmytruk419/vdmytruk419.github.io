document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username-display').textContent = username;
    } else {
        window.location.href = 'index.html';
    }

    document.getElementById('logout-button').addEventListener('click', function() {
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });

    document.getElementById('fly-button').addEventListener('click', function() {
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('fly-content').style.display = 'flex';
    });

    document.getElementById('target-button').addEventListener('click', function() {
        document.getElementById('fly-content').style.display = 'none';
        document.getElementById('target-form').style.display = 'flex';
    });

    function displayTargetInfo() {
        const target = JSON.parse(localStorage.getItem('target'));
        if (target) {
            let targetData = `
                <p>Квадрати: ${target.squares}</p>
                <p>Тип цілі: ${target.targetType}</p>
            `;
            if (target.targetDescription) {
                targetData += `<p>Опис цілі: ${target.targetDescription}</p>`;
            }
            document.getElementById('target-data').innerHTML = targetData;
        }
    }

    document.getElementById('target-data-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const squares = document.getElementById('squares').value;
        const targetType = document.getElementById('target-type').value;
        const targetDescription = document.getElementById('target-description').value;

        const target = {
            squares: squares,
            targetType: targetType,
            targetDescription: targetDescription
        };

        localStorage.setItem('target', JSON.stringify(target));

        document.getElementById('target-form').style.display = 'none';
        document.getElementById('target-info').style.display = 'flex';

        displayTargetInfo();
    });

    document.getElementById('edit-target-button').addEventListener('click', function() {
        document.getElementById('target-info').style.display = 'none';
        document.getElementById('target-form').style.display = 'flex';

        const target = JSON.parse(localStorage.getItem('target'));
        if (target) {
            document.getElementById('squares').value = target.squares;
            document.getElementById('target-type').value = target.targetType;
            document.getElementById('target-description').value = target.targetDescription;
        }
    });

    document.getElementById('return-button').addEventListener('click', function() {
        document.getElementById('fly-content').style.display = 'none';
        document.getElementById('return-form').style.display = 'flex';
    });

    document.getElementById('tech-button').addEventListener('click', function() {
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('tech-form').style.display = 'flex';
    });
});
