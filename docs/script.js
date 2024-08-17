const questionContainer = document.getElementById('question-container');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const verifyButton = document.getElementById('verify-button');
const feedbackMessage = document.getElementById('feedback-message');
const correctCountElement = document.getElementById('correct-count');
const incorrectCountElement = document.getElementById('incorrect-count');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');

let questions = [];
let currentQuestionIndex = 0;
let feedbackText = '';
let isAnswerChecked = false;
let correctCount = 0;
let incorrectCount = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            shuffleArray(questions); // Mezclar las preguntas
            questions.forEach(question => shuffleArray(question.answers)); // Mezclar respuestas para cada pregunta
            totalQuestionsElement.textContent = questions.length;
            showQuestion(questions[currentQuestionIndex]);
        });
}

function showQuestion(question) {
    questionContainer.innerHTML = question.situation;
    answerButtons.innerHTML = '';

    if (question.multipleCorrect) {
        question.answers.forEach((answer, index) => {
            const container = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `answer-${index}`;
            checkbox.dataset.correct = answer.isCorrect;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.innerText = answer.text;

            container.appendChild(checkbox);
            container.appendChild(label);
            answerButtons.appendChild(container);
        });
    } else {
        question.answers.forEach((answer, index) => {
            const container = document.createElement('div');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'answer';
            radio.id = `answer-${index}`;
            radio.dataset.correct = answer.isCorrect;

            const label = document.createElement('label');
            label.htmlFor = radio.id;
            label.innerText = answer.text;

            container.appendChild(radio);
            container.appendChild(label);
            answerButtons.appendChild(container);
        });
    }

    nextButton.style.display = 'none';
    verifyButton.style.display = 'block';
    feedbackMessage.style.display = 'none';
    isAnswerChecked = false;
    currentQuestionElement.textContent = currentQuestionIndex + 1;
}

function checkAnswers() {
    const question = questions[currentQuestionIndex];
    const selectedInputs = Array.from(answerButtons.querySelectorAll('input:checked'));
    const selectedAnswers = selectedInputs.map(input => input.dataset.correct);
    const correctInputs = Array.from(answerButtons.querySelectorAll('input')).filter(input => input.dataset.correct === 'true');
    const correctAnswers = correctInputs.map(input => input.dataset.correct);

    let allSelectedCorrectly = false;

    if (question.multipleCorrect) {
        allSelectedCorrectly = correctAnswers.length === selectedAnswers.length && correctAnswers.every(answer => selectedAnswers.includes(answer));

        // Determine feedback message
        feedbackText = allSelectedCorrectly ? '¡Correcto!' : 'Incorrecto. Intenta de nuevo.';

        // Update feedback for multiple choice
        Array.from(answerButtons.querySelectorAll('input')).forEach(input => {
            if (input.dataset.correct === 'true' && input.checked) {
                input.parentElement.classList.add(allSelectedCorrectly ? 'correct' : 'incorrect');
            } else if (input.dataset.correct === 'false' && input.checked) {
                input.parentElement.classList.add('incorrect');
            } else if (input.dataset.correct === 'true' && !input.checked) {
                input.parentElement.classList.add('incorrect');
            } else if (input.dataset.correct === 'false' && !input.checked) {
                input.parentElement.classList.add('correct');
            }
        });
    } else {
        const selectedInput = answerButtons.querySelector('input:checked');
        if (selectedInput) {
            allSelectedCorrectly = selectedInput.dataset.correct === 'true';
        }

        // Determine feedback message
        feedbackText = allSelectedCorrectly ? '¡Correcto!' : 'Incorrecto. Intenta de nuevo.';

        // Update feedback for single choice
        Array.from(answerButtons.querySelectorAll('input')).forEach(input => {
            if (input.dataset.correct === 'true' && input.checked) {
                input.parentElement.classList.add(allSelectedCorrectly ? 'correct' : 'incorrect');
            } else if (input.dataset.correct === 'false' && input.checked) {
                input.parentElement.classList.add('incorrect');
            } else if (input.dataset.correct === 'true' && !input.checked) {
                input.parentElement.classList.add('incorrect');
            } else if (input.dataset.correct === 'false' && !input.checked) {
                input.parentElement.classList.add('correct');
            }
        });
    }

    isAnswerChecked = true;
    verifyButton.style.display = 'none';
    nextButton.style.display = 'block';
    feedbackMessage.textContent = feedbackText;
    feedbackMessage.style.display = 'block';

    if (allSelectedCorrectly) {
        correctCount++;
    } else {
        incorrectCount++;
    }

    correctCountElement.textContent = correctCount;
    incorrectCountElement.textContent = incorrectCount;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        questionContainer.innerHTML = '¡Has terminado el juego!';
        answerButtons.innerHTML = '';
        nextButton.style.display = 'none';
    }
}

verifyButton.addEventListener('click', () => {
    checkAnswers();
});

nextButton.addEventListener('click', () => {
    if (isAnswerChecked) {
        nextQuestion();
    } else {
        feedbackMessage.textContent = 'Por favor, verifica tu respuesta antes de continuar.';
        feedbackMessage.style.display = 'block';
    }
});

startGame();
