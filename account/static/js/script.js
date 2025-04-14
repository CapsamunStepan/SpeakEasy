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
            saveProgress(task.id).then(r => {

            });
            container.appendChild(createNextButton());
        } else {
            result.textContent = `Неправильно ❌.`;
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
            saveProgress(task.id).then(r => {

            });
            container.appendChild(createNextButton());
        } else {
            resultText.textContent = `Неправильно ❌.`;
            resultText.style.color = "red";
        }
    });

    function renderUserOrder() {
        userOrderContainer.innerHTML = "";  // Очищаем контейнер

        userOrder.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.textContent = item;
            userOrderContainer.appendChild(itemElement);
        });
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderPronunciationTask(task) {
    console.log(task);
    const container = document.getElementById("task-container");
    container.innerHTML = ""; // очистка

    const wordElem = document.createElement("h3");
    wordElem.textContent = task.word || "Произнесите слово";

    const audio = new Audio(task.audio_url); // правильное произношение

    const playBtn = document.createElement("button");
    playBtn.textContent = "🔊 Слушать";
    playBtn.onclick = () => audio.play();

    const recordBtn = document.createElement("button");
    recordBtn.textContent = "🎤 Записать";

    const status = document.createElement("p");
    status.textContent = "Нажмите 'Записать', чтобы начать.";

    let mediaRecorder;
    let chunks = [];
    let isRecording = false;

    recordBtn.onclick = async () => {
        if (isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            status.textContent = "Завершается запись...";
            recordBtn.textContent = "🎤 Записать";
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Ваш браузер не поддерживает запись звука.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            chunks = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const recordedAudio = new Audio(URL.createObjectURL(blob));
                recordedAudio.controls = true;
                container.appendChild(recordedAudio);

                status.textContent = "Запись завершена.";
                console.log("Запись завершена, длина чанков:", chunks.length);
            };

            mediaRecorder.start();
            isRecording = true;
            status.textContent = "Идёт запись... нажмите снова для остановки.";
            recordBtn.textContent = "⏹️ Остановить";
            console.log("Началась запись");
        } catch (err) {
            console.error("Ошибка при доступе к микрофону:", err);
            alert("Ошибка при записи звука. См. консоль.");
        }
    };

    container.appendChild(wordElem);
    container.appendChild(playBtn);
    container.appendChild(recordBtn);
    container.appendChild(status);
}

function renderAuditionTask(task) {
    console.log(task);
    const container = document.getElementById("task-container");
    container.innerHTML = ""; // очистка

    const instruction = document.createElement("h3");
    instruction.textContent = "Прослушайте аудио и напишите, что вы услышали:";

    const audio = new Audio(task.audio_url);

    const playBtn = document.createElement("button");
    playBtn.textContent = "🔊 Слушать";
    playBtn.onclick = () => audio.play();

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Введите услышанное слово/фразу";

    const checkBtn = document.createElement("button");
    checkBtn.textContent = "Проверить";

    const result = document.createElement("p");

    checkBtn.onclick = () => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = task.word.trim().toLowerCase();
        if (userAnswer === correctAnswer) {
            result.textContent = "✅ Правильно!";
            result.style.color = "green";
        } else {
            result.textContent = `❌ Неправильно. Правильный ответ: ${task.word}`;
            result.style.color = "red";
        }
    };

    container.appendChild(instruction);
    container.appendChild(playBtn);
    container.appendChild(input);
    container.appendChild(checkBtn);
    container.appendChild(result);
}


function createNextButton() {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "➡️ Далее";
    nextBtn.classList.add("next-btn");
    nextBtn.onclick = () => {
        if (window.nextTaskUrl) {
            window.location.href = window.nextTaskUrl;
        } else if (window.nextTopicUrl) {
            window.location.href = window.nextTopicUrl;
        } else {
            window.location.href = window.courses;
        }
    };
    return nextBtn;
}


async function saveProgress(taskId, score = 100) {
    try {
        const response = await fetch("/courses/save_task_progress/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                task_id: taskId,
                score: score,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Ошибка сохранения прогресса:", data);
        } else {
            console.log("Прогресс сохранен:", data);
        }
    } catch (err) {
        console.error("Ошибка при сохранении прогресса:", err);
    }
}

function getCSRFToken() {
    const cookie = document.cookie.split(";").find(c => c.trim().startsWith("csrftoken="));
    return cookie ? cookie.split("=")[1] : "";
}
