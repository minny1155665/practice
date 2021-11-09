const p1 = {
    score: 0,
    button: document.querySelector('#p1Plus'),
    display: document.querySelector('#p1')
}
const p2 = {
    score: 0,
    button: document.querySelector('#p2Plus'),
    display: document.querySelector('#p2')
}
const select = document.querySelector('#winScore');
const reset = document.querySelector('#reset');

let winScore = select.options[select.selectedIndex].value;
let isGameOver = false;

p1.button.addEventListener('click', () => {
    updateScore(p1, p2);
});

p2.button.addEventListener('click', () => {
    updateScore(p2, p1);
});

select.addEventListener('change', () => {
    winScore = select.options[select.selectedIndex].value;
})

reset.addEventListener('click', () => {
    isGameOver = false;
    select.disabled = false;
    for (let p of [p1, p2]){
        p.score = 0;
        p.display.textContent = 0;
        p.display.classList.remove('win', 'lose');
        p.button.disabled = false;
    }
})

function updateScore(player, opponent) {
    if (!isGameOver){
        player.score++;
        player.display.textContent = player.score;
        if (player.score == winScore) {
            isGameOver = true;
            player.display.classList.add('win');
            opponent.display.classList.add('lose');
            player.button.disabled = true;
            opponent.button.disabled = true;
            select.disabled = true;
        }
    }
}