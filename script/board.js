document.addEventListener('DOMContentLoaded', function() {
    // Відображення імені користувача в шапці
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = localStorage.getItem('username');

    // Обробник кнопки "Вийти"
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = '../index.html';
    });

    const createTargetButton = document.getElementById('create-target-button');
    const targetPopup = document.getElementById('target-popup');
    const cancelButton = document.getElementById('cancel-button');
    const saveTargetButton = document.getElementById('save-target-button');
    const sendTargetPopup = document.getElementById('send-target-popup');
    const sendCancelButton = document.getElementById('send-cancel-button');
    const sendConfirmButton = document.getElementById('send-confirm-button');
    const resultPopup = document.getElementById('result-popup');
    const resultCancelButton = document.getElementById('result-cancel-button');
    const resultConfirmButton = document.getElementById('result-confirm-button');
    const statisticsButton = document.getElementById('statistics-button');
    const statisticsTableContainer = document.getElementById('statistics-table-container');
    const statisticsTableBody = document.getElementById('statistics-table-body');

    createTargetButton.addEventListener('click', function() {
        targetPopup.classList.remove('hidden');
    });

    cancelButton.addEventListener('click', function() {
        targetPopup.classList.add('hidden');
    });

    function displayTargets() {
        const targetsList = document.getElementById('targets-list-cards');
        targetsList.innerHTML = ''; // Очищення списку

        let targets = JSON.parse(localStorage.getItem('targets')) || [];
        const takeoffs = JSON.parse(localStorage.getItem('takeoffs')) || []; // Отримання takeoffs з localStorage

        // показуємо лише цілі, що мають ID
        targets = targets.filter(target => target.id);
        // Сортування цілей за часом створення (від найновішої до найстарішої)
        targets.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));

        targets.filter(target => target.status !== 'Closed').forEach(target => {
            let cardClass = 'bg-white rounded-lg shadow p-4';
            let buttons = `
                <div class="flex justify-between mt-4">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded send-button" data-target-id="${target.id}">Відправити</button>
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded close-button" data-target-id="${target.id}">Закрити</button>
                </div>
            `;

            if (target.status === 'Approved' || target.status === 'Closed') {
                if (target.status === 'Closed') {
                    cardClass += ' opacity-50 hover:opacity-100 transition-opacity duration-300 pointer-events-none';
                    buttons = '';
                }

                const card = document.createElement('div');
                card.className = cardClass;
                card.dataset.targetId = target.id; // Додавання targetId до data-атрибута картки

                let title = `${target.squares} /`;
                if (target.stream) {
                    title += ` ${target.stream}`;
                }

                title += `<button class="edit-stream-button ml-2" data-target-id="${target.id}">
                                <img src="../edit-icon.svg" alt="Редагувати" class="w-5 h-5">
                            </button>`;

                let takeoffInfo = '';
                const relatedTakeoffs = takeoffs.filter(takeoff => takeoff.target === target.id);
                if (relatedTakeoffs.length > 0) {
                    takeoffInfo = `<ul class="space-y-2">${relatedTakeoffs.map(takeoff => {
                        let takeoffItem = `<li class="flex justify-between items-center">${takeoff.crew}`;
                        if (takeoff.status === 'Created') {
                            // takeoffItem += `<button class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded takeoff-button" data-takeoff-id="${takeoff.id}"${target.status == 'Closed' ? ' disabled' : ''}>Виліт</button>`;
                            takeoffItem += `
                                <div class="flex gap-2">
                                    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded takeoff-button" data-takeoff-id="${takeoff.id}"${target.status == 'Closed' ? ' disabled' : ''}>Виліт</button>
                                    <button class="bg-gray-300 hover:bg-grey-400 text-gray-800 py-1 px-2 rounded delete-takeoff-button" data-takeoff-id="${takeoff.id}" title="Скасувати відправлення">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            `;
                        } else if (takeoff.status === 'InFlight') {
                            takeoffItem += `<span>${new Date(takeoff.takeoffTime).toLocaleTimeString()}</span><button class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded result-button" data-takeoff-id="${takeoff.id}"${target.status == 'Closed' ? ' disabled' : ''}>Результат</button>`;
                        } else if (takeoff.status === 'Completed') {
                            takeoffItem += `<span>${new Date(takeoff.takeoffTime).toLocaleTimeString()}</span><span>${takeoff.result}</span><span>${new Date(takeoff.completionTime).toLocaleTimeString()}</span>`; // Додавання часу завершення
                        }
                        takeoffItem += `</li>`;
                        return takeoffItem;
                    }).join('')}</ul>`;
                }

                card.innerHTML = `
                    <h3 class="text-lg font-semibold mb-2 flex">${title}</h3>
                    ${takeoffInfo}
                    ${buttons}
                `;
                targetsList.appendChild(card);
            }
        });

        const closeButtons = document.querySelectorAll('.close-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = button.dataset.targetId;
                const target = JSON.parse(localStorage.getItem('targets')).find(t => t.id === targetId);

                if (target) {
                    if (confirm(`Ви впевнені, що хочете закрити ціль "${target.squares} / ${target.stream}"?`)) {
                        const targets = JSON.parse(localStorage.getItem('targets')) || [];
                        const targetIndex = targets.findIndex(t => t.id === targetId);

                        if (targetIndex !== -1) {
                            const now = new Date();
                            targets[targetIndex].status = 'Closed';
                            targets[targetIndex].closingTime = now.toISOString();
                            localStorage.setItem('targets', JSON.stringify(targets));
                            console.log('Ціль:', targetId, 'статус змінено на Closed, час закриття:', targets[targetIndex].closingTime);
                            displayTargets(); // Оновлення списку цілей після зміни статусу цілі
                        } else {
                            console.error('Ціль не знайдена:', targetId);
                        }
                    }
                } else {
                    console.error('Ціль не знайдена:', targetId);
                }
            });
        });

        const sendButtons = document.querySelectorAll('.send-button');
        sendButtons.forEach(button => {
            button.addEventListener('click', function() {
                sendTargetPopup.classList.remove('hidden');
                // Зберігаємо ID цілі в data-атрибуті кнопки "Підтвердити"
                sendConfirmButton.dataset.targetId = button.dataset.targetId;
            });
        });

        const takeoffButtons = document.querySelectorAll('.takeoff-button');
        takeoffButtons.forEach(button => {
            button.addEventListener('click', function() {
                const takeoffId = button.dataset.takeoffId;
                const takeoffs = JSON.parse(localStorage.getItem('takeoffs')) || [];
                const takeoffIndex = takeoffs.findIndex(t => t.id === takeoffId);

                if (takeoffIndex !== -1) {
                    const now = new Date();
                    takeoffs[takeoffIndex].status = 'InFlight';
                    takeoffs[takeoffIndex].takeoffTime = now.toISOString(); // Додавання часу вильоту

                    localStorage.setItem('takeoffs', JSON.stringify(takeoffs));
                    console.log('Виліт:', takeoffId, 'статус змінено на InFlight, час:', takeoffs[takeoffIndex].takeoffTime);
                    displayTargets(); // Оновлення списку цілей після зміни статусу вильоту
                } else {
                    console.error('Виліт не знайдено:', takeoffId);
                }
            });
        });

        const resultButtons = document.querySelectorAll('.result-button');
        resultButtons.forEach(button => {
            button.addEventListener('click', function() {
                resultPopup.classList.remove('hidden');
                // Зберігаємо ID вильоту в data-атрибуті кнопки "Підтвердити"
                resultConfirmButton.dataset.takeoffId = button.dataset.takeoffId;
            });
        });

        const editStreamButtons = document.querySelectorAll('.edit-stream-button');
        editStreamButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = button.dataset.targetId;
                const target = targets.find(t => t.id === targetId);

                if (target) {
                    const newStream = prompt('Введіть новий стрім:', target.stream);
                    if (newStream !== null) {
                        target.stream = newStream;
                        localStorage.setItem('targets', JSON.stringify(targets));
                        displayTargets();
                    }
                }
            });
        });

        const deleteTakeoffButtons = document.querySelectorAll('.delete-takeoff-button');
        deleteTakeoffButtons.forEach(button => {
            button.addEventListener('click', function() {
                const takeoffId = button.dataset.takeoffId;
                const confirmDelete = confirm('Ви впевнені, що хочете видалити виліт?');
                if (confirmDelete) {
                    let takeoffs = JSON.parse(localStorage.getItem('takeoffs')) || [];
                    takeoffs = takeoffs.filter(takeoff => takeoff.id !== takeoffId);
                    localStorage.setItem('takeoffs', JSON.stringify(takeoffs));
                    displayTargets(); // Оновлення відображення цілей
                }
            });
        });
    }

    displayTargets(); // Виклик функції для відображення цілей при завантаженні сторінки

    saveTargetButton.addEventListener('click', function() {
        const squares = document.getElementById('squares').value;
        const stream = document.getElementById('stream').value;

        // Генерація унікального ID
        const targetId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

        // Отримання поточної дати та часу
        const now = new Date();
        const creationTime = now.toISOString(); // Збереження дати та часу у форматі ISO

        // Створення об'єкта цілі
        const target = {
            id: targetId,
            squares: squares,
            stream: stream,
            creationTime: creationTime, // Додавання дати та часу створення
            status: 'Approved' // Додавання статусу
        };

        // Отримання масиву цілей з localStorage або створення порожнього масиву
        let targets = JSON.parse(localStorage.getItem('targets')) || [];

        // Додавання нової цілі до масиву
        targets.push(target);

        // Збереження оновленого масиву в localStorage
        localStorage.setItem('targets', JSON.stringify(targets));

        console.log('Ціль збережено:', target);

        displayTargets(); // Оновлення списку цілей після збереження
        targetPopup.classList.add('hidden');
    });

    sendCancelButton.addEventListener('click', function() {
        sendTargetPopup.classList.add('hidden');
    });

    sendConfirmButton.addEventListener('click', function() {
        const crew = document.getElementById('send-crew').value;
        const targetId = sendConfirmButton.dataset.targetId; // Отримуємо ID цілі з data-атрибута

        // Створення об'єкта takeoff
        const takeoff = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5), // Генерація ID для takeoff
            target: targetId,
            crew: crew,
            status: 'Created'
        };

        // Отримання масиву takeoffs з localStorage або створення порожнього масиву
        let takeoffs = JSON.parse(localStorage.getItem('takeoffs')) || [];

        // Додавання нового takeoff до масиву
        takeoffs.push(takeoff);

        // Збереження оновленого масиву takeoffs в localStorage
        localStorage.setItem('takeoffs', JSON.stringify(takeoffs));

        console.log('Takeoff створено:', takeoff);

        displayTargets(); // Оновлення списку цілей після створення takeoff
        sendTargetPopup.classList.add('hidden');
    });

    resultCancelButton.addEventListener('click', function() {
        resultPopup.classList.add('hidden');
    });

    resultConfirmButton.addEventListener('click', function() {
        const result = document.getElementById('result-status').value;
        const takeoffId = resultConfirmButton.dataset.takeoffId;
        const takeoffs = JSON.parse(localStorage.getItem('takeoffs')) || [];
        const takeoffIndex = takeoffs.findIndex(t => t.id === takeoffId);

        if (takeoffIndex !== -1) {
            const now = new Date();
            takeoffs[takeoffIndex].status = 'Completed';
            takeoffs[takeoffIndex].result = result; // Додавання результату вильоту
            takeoffs[takeoffIndex].completionTime = now.toISOString(); // Додавання completionTime
            localStorage.setItem('takeoffs', JSON.stringify(takeoffs));
            console.log('Результат:', takeoffId, 'статус змінено на Completed, результат:', result);
            displayTargets(); // Оновлення списку цілей після зміни статусу вильоту
        } else {
            console.error('Виліт не знайдено:', takeoffId);
        }

        resultPopup.classList.add('hidden');
    });

    const sendCrewSelect = document.getElementById('send-crew');

    function populateCrewSelect() {
        sendCrewSelect.innerHTML = ''; // Очищення випадаючого списку

        let crews = JSON.parse(localStorage.getItem('crews')) || ["Альянс", "Дача", "Оливка", "Вежа", "Легенда"];
        crews.forEach(crew => {
            const option = document.createElement('option');
            option.value = crew;
            option.textContent = crew;
            sendCrewSelect.appendChild(option);
        });
    }

    populateCrewSelect(); // Заповнення випадаючого списку при завантаженні сторінки

    function displayStatistics() {
        statisticsTableBody.innerHTML = ''; // Очищення таблиці

        const takeoffs = JSON.parse(localStorage.getItem('takeoffs')) || [];
        const targets = JSON.parse(localStorage.getItem('targets')) || [];

        takeoffs.forEach(takeoff => {
            if (takeoff.status === 'Completed') {
                const target = targets.find(t => t.id === takeoff.target);
                if (target) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="border px-4 py-2">${takeoff.crew}</td>
                        <td class="border px-4 py-2">${target.squares}</td>
                        <td class="border px-4 py-2">${new Date(takeoff.takeoffTime).toLocaleString()}</td>
                        <td class="border px-4 py-2">${new Date(takeoff.completionTime).toLocaleString()}</td>
                        <td class="border px-4 py-2">${takeoff.result}</td>
                        <td class="border px-4 py-2">${target.stream || '-'}</td>
                    `;
                    statisticsTableBody.appendChild(row);
                }
            }
        });
    }

    statisticsButton.addEventListener('click', function() {
        statisticsTableContainer.classList.remove('hidden');
        displayStatistics();
    });
});
