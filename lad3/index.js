const readlineSync = require('readline-sync');

//количество цифр
const askNumberLength = 3;

//число попыток
const attemptsNumber = askNumberLength;

//загаданное число
function initAskNumber(askNumberLength) {
    let askNumber = '';
    for (let i = 0; i < askNumberLength; i++) {
        askNumber += Math.round((Math.random() * 9));
    }
    return askNumber;
}

const askNumber = initAskNumber(askNumberLength);
console.log(askNumber);

//магия угадывания
function superSmartFunction(ask, answer) {
    const arrMatch = [];
    const arrMiss = [];
    const arrMissIndex = [];
    const arrMissMatch = [];
    for (let i = 0; i < ask.length; i++) {
        if (ask[i] === answer[i]) {
            arrMatch.push(answer[i]);
        }
        if (ask[i] !== answer[i]) {
            arrMiss.push(answer[i]);
            arrMissIndex.push(i);
        }
    }

    if (arrMatch.length === ask.length) {
        return { match: arrMatch };
    }

    for (let index of arrMissIndex) {
        if (arrMiss.includes(ask[index])) {
            arrMissMatch.push(ask[index]);
            arrMiss.splice(arrMiss.indexOf(ask[index]), 1);
        }
    }

    return { match: arrMatch, miss: arrMissMatch };
}


for (let i = 0; i < attemptsNumber; i++) {
    let answerNumber = readlineSync.question(`Угадайте число из ${askNumberLength} цифр, введите ответ: `);
    while (answerNumber.length !== askNumber.length) {
        answerNumber = readlineSync.question(`Ответ должен содержать число из ${askNumberLength} цифр, введите ответ: `);
    }

    console.log(`Попытка №${i + 1}: ответ - ${answerNumber}`);
    const resultObj = superSmartFunction(askNumber, answerNumber);
    if (resultObj.match.length === askNumber.length) {
        console.log('Победа!');
        break;
    }

    console.log(`совпавших цифр не на своих местах - ${resultObj.miss.length} (${resultObj.miss})`);
    console.log(`совпавших цифр на своих местах - ${resultObj.match.length} (${resultObj.match})`);

    if (i === attemptsNumber - 1) {
        console.log('Поражение!');
        break;
    }
}