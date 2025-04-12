document.addEventListener("DOMContentLoaded", function () {
    const task = window.task;  // получили из шаблона

    if (!task) {
        console.error("Задание не передано в шаблон");
        return;
    }

    console.log(task); // проверим еще раз

    switch (task.type) {
        case "1":
            renderMissedWordTask(task);
            break;
        case "2":
            renderOrderingTask(task);
            break;
        case "3":
            renderPronunciationTask(task);
            break;
        case "4":
            renderAuditionTask(task);
            break;
        default:
            console.error("Неизвестный тип задания:", task.type);
    }
});

function renderMissedWordTask(task) {
    const container = document.querySelector(".task-list");
    container.innerHTML = ""; // Очищаем

    const question = document.createElement("p");
    question.textContent = task.question;
    container.appendChild(question);

    const sentence = document.createElement("p");
    sentence.innerHTML = task.sentence_without_a_word.replace("___", "<strong>___</strong>");
    container.appendChild(sentence);

    const form = document.createElement("form");
    form.classList.add("variants-form");

    task.variants.forEach((variant, index) => {
        const label = document.createElement("label");
        label.classList.add("variant-label");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "missed_word";
        input.value = variant;

        const span = document.createElement("span");
        span.textContent = variant;

        label.appendChild(input);
        label.appendChild(span);
        form.appendChild(label);
    });

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Проверить";
    submit.classList.add("check-btn");
    form.appendChild(submit);

    const result = document.createElement("p");
    result.classList.add("result-text");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const selected = form.querySelector("input[name='missed_word']:checked");
        if (!selected) {
            result.textContent = "Пожалуйста, выбери вариант!";
            result.style.color = "orange";
            return;
        }

        if (selected.value.trim().toLowerCase() === task.missed_word.trim().toLowerCase()) {
            result.textContent = "Правильно ✅";
            result.style.color = "green";
        } else {
            result.textContent = `Неправильно ❌. Правильный ответ: ${task.missed_word}`;
            result.style.color = "red";
        }
    });

    container.appendChild(form);
    container.appendChild(result);
}

function renderOrderingTask(task) {
    const container = document.querySelector(".task-list");
    container.innerHTML = ""; // Очистить контейнер

    const question = document.createElement("p");
    question.textContent = task.question;
    container.appendChild(question);

    const sentenceContainer = document.createElement("div");
    sentenceContainer.classList.add("ordering-container");

    const items = task.sentence_for_ordering.split(" ");  // Разделить строку на слова
    const originalOrder = [...items];  // Сохраняем оригинальный порядок слов
    let userOrder = [];  // Это будет массив для порядка, который выбрал пользователь

    // Отображаем плитки
    shuffleArray(items).forEach((item, index) => {
        const itemElement = document.createElement("button");
        itemElement.classList.add("ordering-item");
        itemElement.textContent = item; // Показать элемент

        // Добавляем обработчик нажатия
        itemElement.addEventListener("click", function() {
            if (userOrder.length < items.length) { // Проверим, не слишком ли много слов
                userOrder.push(item);  // Добавляем в массив выбранных
                itemElement.disabled = true;  // Отключаем кнопку
                renderUserOrder();  // Отображаем текущий порядок пользователя
            }
        });

        sentenceContainer.appendChild(itemElement);
    });

    container.appendChild(sentenceContainer);

    const userOrderContainer = document.createElement("div");
    userOrderContainer.classList.add("user-order-container");
    container.appendChild(userOrderContainer);

    const checkButton = document.createElement("button");
    checkButton.textContent = "Проверить";
    checkButton.classList.add("check-btn");
    container.appendChild(checkButton);

    const resultText = document.createElement("p");
    resultText.classList.add("result-text");
    container.appendChild(resultText);

    // Обработчик нажатия на кнопку "Проверить"
    checkButton.addEventListener("click", function() {
        if (userOrder.length !== items.length) {
            resultText.textContent = "Пожалуйста, выбери все элементы!";
            resultText.style.color = "orange";
            return;
        }

        if (JSON.stringify(userOrder) === JSON.stringify(originalOrder)) {
            resultText.textContent = "Правильно ✅";
            resultText.style.color = "green";
        } else {
            resultText.textContent = `Неправильно ❌. Правильный порядок: ${originalOrder.join(", ")}`;
            resultText.style.color = "red";
        }
    });

    // Функция для отображения текущего порядка пользователя
    function renderUserOrder() {
        userOrderContainer.innerHTML = "";  // Очищаем контейнер

        userOrder.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.textContent = item;
            userOrderContainer.appendChild(itemElement);
        });
    }
}


// Функция для перемешивания массива (не используется, т.к. мы только меняем порядок)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Переставить элементы
    }
    return array;
}

