const GameModes = Object.freeze({
    GUESS_NAME_BY_CODE: 'guessNameByCode',
    GUESS_CODE_BY_NAME: 'guessCodeByName',
    GUESS_REGION_BY_NAME: 'guessRegionByName',
    GUESS_REGION_BY_CODE: 'guessRegionByCode'
});

const Utils = {
    shuffleArray: (array) => {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    getRandomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    normalizeString: (str) => {
        return str.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z]/g, '');
    },

    normalizeCode: (code) => {
        return code.replace(/\s/g, '').toUpperCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/^0+/, '')
            .replace(/[^0-9AB]/gi, '');
    }
};