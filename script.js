
const state = Object.freeze({
    batsu: -1,
    empty: 0,
    maru: 1
})
let cell_state = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]

const game_result = Object.freeze({
    batsu_win: -1,
    draw: 0,
    maru_win: 1,
    not_decided: 2
})
let result = game_result.not_decided

const message=$(".message-area")
    

$(".cell").on("click", function () {
    const row = $(this).data("row")
    const column = $(this).data("column")

    if (cell_state[row][column] == state.empty) {
        if (result == game_result.not_decided) {
            put_state(row, column, state.maru);
            check_game_result()
        }

        if (result == game_result.not_decided) {
            enemy_turn()
            check_game_result()
        }
    }
});

$(".restart").click(function () {
    reset_the_game()
});

function put_state(row, column, putstate) {

    // 対象となるセル
    const target_cell = $(".cell[data-row =" + row + "].cell[data-column =" + column + "]");

    // putstate引数の内容(○×空欄)に応じて処理
    switch (putstate) {
        case state.batsu:
            cell_state[row][column] = state.batsu
            target_cell.text("×");
            message.text("○の番");
            break;

        case state.maru:
            cell_state[row][column] = state.maru
            target_cell.text("○");
            message.text("×の番");
            break;

        default:
            cell_state[row][column] = state.empty
            target_cell.text("");
            break;
    }
}

function reset_the_game() {
    cell_state = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    result = game_result.not_decided
    $(".cell").text("");
    message.css("background-image", "none")
    message.text("あなたが先攻です");

}


function check_game_result() {
    // 列の判定
    for (let x = 0; x <= 2; x++) {
        if (is_winner(cell_state[x])) {
            win(cell_state[x][0]);
            // 勝敗がわかったらプロシージャを抜ける
            return;
        }
    }
    // 行の判定
    for (let y = 0; y <= 2; y++) {
        if (is_winner(getColumn(cell_state, y))) {
            win(cell_state[0][y]);
            return;
        }
    }
    // 斜めの判定
    if (is_winner([cell_state[0][0], cell_state[1][1], cell_state[2][2]]) ||
        is_winner([cell_state[0][2], cell_state[1][1], cell_state[2][0]])) {
        win(cell_state[1][1]);
        return;
    }
    // 引き分け
    if (cell_state.flat().every(v => v != state.empty)) { draw(); }

    // check_game_resultの中でしか使わない関数たち 

    // cellsとして配列を受け取り、その配列が全部一致しており、
    // 空白でないならtrueを返す関数
    function is_winner(cells) {
        // 配列の最初の値が空白でないことを確認し、
        // 配列の全要素が最初の要素と一致するかをチェック
        return cells[0] !== state.empty &&    // 最初の要素が空白でないこと
            cells.every(tmp => tmp === cells[0]); // すべての要素が最初の要素と一致するか
    }

    // 指定された列をarrayから取り出す関数
    function getColumn(array, y) {
        // Array.from()を使って、指定された列の要素を取り出す
        return Array.from(
            { length: array.length },  // 配列の長さだけ繰り返す
            (_, x) => array[x][y]      // xを行番号として、y列の値を取り出す
        );
    }
}
function win(winners_cell) {
 switch (winners_cell) {
        case state.maru:
            result = game_result.maru_win;
            message.text("");
            message.css("background-image", "url(./img/you-win-2024-11-12.gif)")
            message.css("height", "200px")
            // 10秒間の紙吹雪を開始
            startConfetti(10000);
            break;

        case state.batsu:
            result = game_result.batsu_win;
            message.text("×の勝ち");
            break;
    }

}
function draw() {
    result = game_result.draw;
    message.text("ひきわけ");

}


function enemy_turn() {
    let enemy_choice;
    do {
        enemy_choice = [
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3)
        ];
    }
    while (
        cell_state[enemy_choice[0]][enemy_choice[1]] != state.empty
    ) { console.log(enemy_choice); }
    put_state(enemy_choice[0], enemy_choice[1], state.batsu)
}

