document.addEventListener('DOMContentLoaded', () => {

    // Initialisation
    const game = new QuizGame(DEPARTMENTS_DATA);

    // Éléments du DOM
    const screens = {
        home: document.getElementById('home-screen'),
        game: document.getElementById('game-screen'),
        feedback: document.getElementById('feedback-screen'),
        end: document.getElementById('end-screen')
    };

    const inputs = {
        mode: document.getElementById('mode-select'),
        questionsCount: document.getElementById('questions-count'),
        isTextMode: document.getElementById('text-input-mode'),
        choicesCount: document.getElementById('choices-count'),
        choicesContainer: document.getElementById('choices-count-container'),
        userAnswer: document.getElementById('user-input')
    };

    const ui = {
        questionText: document.getElementById('question-text'),
        choicesWrapper: document.getElementById('choices-container'),
        textInputWrapper: document.getElementById('text-input-container'),
        scoreDisplay: document.getElementById('score-display'),
        feedbackTitle: document.getElementById('feedback-title'),
        feedbackMessage: document.getElementById('feedback-message'),
        finalScore: document.getElementById('final-score')
    };

    // --- Écouteurs d'événements ---

    inputs.isTextMode.addEventListener('change', (e) => {
        if (e.target.checked) {
            inputs.choicesContainer.classList.add('hidden');
        } else {
            inputs.choicesContainer.classList.remove('hidden');
        }
    });

    // Lancement du quiz
    document.getElementById('btn-start').addEventListener('click', () => {
        let nbQuestions = parseInt(inputs.questionsCount.value);
        let nbChoices = parseInt(inputs.choicesCount.value);

        if (isNaN(nbQuestions) || nbQuestions < 1) nbQuestions = 10;
        if (isNaN(nbChoices) || nbChoices < 2) nbChoices = 4;

        nbQuestions = Math.min(nbQuestions, DEPARTMENTS_DATA.length);

        if (inputs.mode.value.includes('Region')) {
            const uniqueRegions = new Set(DEPARTMENTS_DATA.map(d => d.region)).size;
            nbChoices = Math.min(nbChoices, uniqueRegions);
        }

        const settings = {
            mode: inputs.mode.value,
            nbQuestions: nbQuestions,
            nbChoices: nbChoices,
            isTextInput: inputs.isTextMode.checked
        };

        game.initialize(settings);
        showScreen('game');
        renderQuestion();
    });

    // Validation au clic
    document.getElementById('btn-submit-answer').addEventListener('click', () => {
        handleAnswerSubmission(inputs.userAnswer.value);
    });

    // Validation à la touche "Entrée"
    inputs.userAnswer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAnswerSubmission(inputs.userAnswer.value);
        }
    });

    document.getElementById('btn-next-question').addEventListener('click', () => {
        if (game.nextQuestion()) {
            showScreen('end');
            ui.finalScore.innerText = `${game.score} / ${game.questions.length}`;
        } else {
            showScreen('game');
            renderQuestion();
        }
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        showScreen('home');
    });

    // --- Fonctions d'affichage ---

    function showScreen(screenName) {
        Object.values(screens).forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        screens[screenName].classList.remove('hidden');
        screens[screenName].classList.add('active');
    }

    function renderQuestion() {
        const question = game.getCurrentQuestion();
        ui.questionText.innerText = question.text;

        ui.scoreDisplay.innerText = `Question ${game.currentQuestionIndex + 1} / ${game.questions.length} • Score : ${game.score}`;

        ui.choicesWrapper.innerHTML = '';
        inputs.userAnswer.value = '';

        if (game.settings.isTextInput) {
            ui.choicesWrapper.classList.add('hidden');
            ui.textInputWrapper.classList.remove('hidden');
            inputs.userAnswer.focus();
        } else {
            ui.textInputWrapper.classList.add('hidden');
            ui.choicesWrapper.classList.remove('hidden');

            question.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.innerText = choice;
                btn.addEventListener('click', () => handleAnswerSubmission(choice));
                ui.choicesWrapper.appendChild(btn);
            });
        }
    }

    function handleAnswerSubmission(userAnswer) {
        if (game.settings.isTextInput && userAnswer.trim() === "") return;

        const result = game.checkAnswer(userAnswer);

        if (result.isCorrect) {
            ui.feedbackTitle.innerText = "Bonne réponse !";
            ui.feedbackTitle.style.color = "var(--success-color)";
        } else {
            ui.feedbackTitle.innerText = "Mauvaise réponse !";
            ui.feedbackTitle.style.color = "var(--error-color)";
        }

        let contextMsg = "";
        const item = result.item;
        if (game.settings.mode === GameModes.GUESS_NAME_BY_CODE) {
            contextMsg = `Le département ${item.code} est : ${item.name}`;
        } else if (game.settings.mode === GameModes.GUESS_CODE_BY_NAME) {
            contextMsg = `Le code de ${item.name} est : ${item.code}`;
        } else {
            contextMsg = `La région de ${item.name} (${item.code}) est : ${item.region}`;
        }

        ui.feedbackMessage.innerText = contextMsg;
        showScreen('feedback');

        document.getElementById('btn-next-question').focus();
    }
});