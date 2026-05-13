class QuizGame {
    constructor(data) {
        this.data = data;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.settings = {};
    }

    initialize(settings) {
        this.settings = settings;
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.questions = this.generateQuestions();
    }

    generateQuestions() {
        let generated = [];
        let usedAnswers = new Set();
        const maxIterations = 1000;

        for (let i = 0; i < this.settings.nbQuestions; i++) {
            let answerItem, questionText, correctAnswer;
            let loopCount = 0;

            do {
                answerItem = this.data[Utils.getRandomInt(0, this.data.length)];
                correctAnswer = this.getAnswerForMode(answerItem, this.settings.mode);
                loopCount++;
            } while (usedAnswers.has(correctAnswer) && loopCount < maxIterations);

            usedAnswers.add(correctAnswer);

            switch (this.settings.mode) {
                case GameModes.GUESS_NAME_BY_CODE:
                    questionText = `Quel département a pour code postal ${answerItem.code} ?`;
                    break;
                case GameModes.GUESS_CODE_BY_NAME:
                    questionText = `Quel est le code correspondant à ${answerItem.name} ?`;
                    break;
                case GameModes.GUESS_REGION_BY_NAME:
                    questionText = `Dans quelle région se situe ${answerItem.name} ?`;
                    break;
                case GameModes.GUESS_REGION_BY_CODE:
                    questionText = `Dans quelle région se situe le département numéro ${answerItem.code} ?`;
                    break;
            }

            let choices = [correctAnswer];
            if (!this.settings.isTextInput) {
                while (choices.length < this.settings.nbChoices) {
                    let randomItem = this.data[Utils.getRandomInt(0, this.data.length)];
                    let fakeAnswer = this.getAnswerForMode(randomItem, this.settings.mode);
                    if (!choices.includes(fakeAnswer)) {
                        choices.push(fakeAnswer);
                    }
                }
                choices = Utils.shuffleArray(choices);
            }

            generated.push({
                text: questionText,
                choices: choices,
                correctAnswer: correctAnswer,
                fullItem: answerItem
            });
        }
        return generated;
    }

    getAnswerForMode(item, mode) {
        if (mode === GameModes.GUESS_NAME_BY_CODE) return item.name;
        if (mode === GameModes.GUESS_CODE_BY_NAME) return item.code;
        if (mode === GameModes.GUESS_REGION_BY_NAME || mode === GameModes.GUESS_REGION_BY_CODE) return item.region;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    checkAnswer(userAnswer) {
        const question = this.getCurrentQuestion();
        const mode = this.settings.mode;

        let normalizedUser, normalizedCorrect;

        if (mode === GameModes.GUESS_CODE_BY_NAME) {
            normalizedUser = Utils.normalizeCode(userAnswer);
            normalizedCorrect = Utils.normalizeCode(question.correctAnswer);
        } else {
            normalizedUser = Utils.normalizeString(userAnswer);
            normalizedCorrect = Utils.normalizeString(question.correctAnswer);
        }

        const isCorrect = (normalizedUser === normalizedCorrect);
        if (isCorrect) this.score++;

        return {
            isCorrect: isCorrect,
            correctAnswer: question.correctAnswer,
            item: question.fullItem
        };
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        return this.isFinished();
    }

    isFinished() {
        return this.currentQuestionIndex >= this.questions.length;
    }
}