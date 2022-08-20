const readlineSync = require('readline-sync');

const monster = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0     // ходов на восстановление
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2
        },
    ]
};
const player = {
    maxHealth: 10,
    name: "Евстафий",
    moves: [
        {
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 50,
            "cooldown": 0
        },
        {
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 4
        },
        {
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercents": 100,
            "magicArmorPercents": 100,
            "cooldown": 4
        },
    ]
};

function getRandomMoveNumber(movesArrLength) {
    return Math.round((Math.random() * (movesArrLength - 1)));
}

function addCoolDownStateProp(obj) {
    for (const move of obj.moves) {
        move.remainCooldown = 0;
    }
}

function getPlayerMoveNumber(obj) {
    let moveNumber = 0;
    while (moveNumber <= 0 || moveNumber > obj.moves.length) {
        console.log('\n');
        console.log('Выберите номер действия:');
        console.log('Здоровье Евстафия: ', player.maxHealth);
        console.log('Здоровье Лютого: ', monster.maxHealth);
        obj.moves.forEach((move, moveIndex) => {
            console.log(moveIndex + 1, '-', move.name);
            console.log('Физ.урон: ', move.physicalDmg);
            console.log('Маг.урон: ', move.magicDmg);
            console.log('Физ.защита: ', move.physicArmorPercents);
            console.log('Маг.защита: ', move.magicArmorPercents);
            console.log('Перезарядка: ', move.cooldown);
            console.log('Осталось ходов до перезарядки: ', move.remainCooldown);
        });
        console.log('\n');

        moveNumber = readlineSync.question('Выбрано действие');
        console.log('\n');
        if (!obj.moves[moveNumber - 1]) {
            console.warn(`Действие номер ${moveNumber} не существует!`);
            moveNumber = 0;
        }
        if (obj.moves[moveNumber - 1] && obj.moves[moveNumber - 1].remainCooldown > 0) {
            console.warn(`Действие ${moveNumber} не может быть выбрано, пока перезаряжается!`);
            moveNumber = 0;
        }
    }

    return (moveNumber - 1 >= 0) ? moveNumber - 1 : moveNumber;
}

function getMonsterMoveNumber(obj) {
    const monsterMovesIndexArr = [];
    obj.moves.forEach((move, moveIndex) => {
        if (move.remainCooldown === 0) {
            monsterMovesIndexArr.push(moveIndex);
        }
    });
    let randomIndex = 0;
    if (monsterMovesIndexArr.length) randomIndex = getRandomMoveNumber(monsterMovesIndexArr.length);
    const randomMove = obj.moves[monsterMovesIndexArr[randomIndex]];
    console.log('Лютый атакует игрока:');
    console.log(randomMove.name);
    console.log('Физ.урон: ', randomMove.physicalDmg);
    console.log('Маг.урон: ', randomMove.magicDmg);
    console.log('Физ.защита: ', randomMove.physicArmorPercents);
    console.log('Маг.защита: ', randomMove.magicArmorPercents);
    console.log('Перезарядка: ', randomMove.cooldown);

    return monsterMovesIndexArr[randomIndex];
}

function coolDownPerTurnDecrease(obj) {
    for (const move of obj.moves) {
        if (move.remainCooldown > 0)
            move.remainCooldown--;
    }
}

const initPlayerHealth = readlineSync.question('Введите начальное здоровье игрока:');
player.maxHealth = parseInt(initPlayerHealth) || player.maxHealth;
addCoolDownStateProp(monster);
addCoolDownStateProp(player);
let turn = 0;

while (monster.maxHealth > 0 && player.maxHealth > 0) {
    turn++;
    console.log('\n');
    console.log('Номер текущего хода: ', turn);
    console.log('\n');

    coolDownPerTurnDecrease(monster);
    coolDownPerTurnDecrease(player);

    //расчет урона
    const monsterAction = monster.moves[getMonsterMoveNumber(monster)];
    const playerAction = player.moves[getPlayerMoveNumber(player)];
    player.maxHealth -= monsterAction.physicalDmg * ((100 - playerAction.physicArmorPercents) / 100);
    player.maxHealth -= monsterAction.magicDmg * ((100 - playerAction.magicArmorPercents) / 100);
    monster.maxHealth -= playerAction.physicalDmg * ((100 - monsterAction.physicArmorPercents) / 100);
    monster.maxHealth -= playerAction.magicDmg * ((100 - monsterAction.magicArmorPercents) / 100);
    //добавить выполненым ударам перезарядку
    monsterAction.remainCooldown = monsterAction.cooldown;
    playerAction.remainCooldown = playerAction.cooldown;

    console.log('Конец хода');
    if (player.maxHealth <= 0) {
        console.log('Игра окончена');
        console.log('Лютый победил!');
        break;
    }
    if (monster.maxHealth <= 0) {
        console.log('Игра окончена');
        console.log('Евстафий победил!');
        break;
    }
}
