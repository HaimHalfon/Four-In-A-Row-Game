const GRAY_COLOR_1 = "#333";
const GRAY_COLOR_2 = "#aaa";
const GRAY_COLOR_3 = "#f1f1f1"

const RED_COLOR = "FireBrick";
const YELLOW_COLOR = "Gold";

const ROW = 6;
const COL = 7;

var arrBoard = [];

var currentPlayer;
var currentColor;
var currentCounter;

var otherPlayer;
var otherColor;
var otherCounter;

function my_onload() {
    create_board();
    new_game();
}

function create_board() {
    const board = $("#board");
    let row;
    let piece;
    for (let i = 0; i < ROW; i++) {
        row = $("<div></div>");
        row.addClass("row");
        arrBoard[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            piece = $("<div></div>");
            piece.attr("id", "piece_" + i + "_" + j);
            piece.addClass("piece");
            row.append(piece);
        }
        board.append(row);
    }
}

function new_game() {
    let piece;
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            piece = $("#piece_" + i + "_" + j);
            piece.css("background-color", GRAY_COLOR_3);
            piece.css("border", "none");
            piece.unbind("mouseover");
            piece.unbind("mouseout");
            piece.unbind("click");
            piece.mouseover(() => piece_over(i, j));
            piece.mouseout(() => piece_out(i, j));
            piece.click(() => piece_click(i, j));
            arrBoard[i][j] = GRAY_COLOR_3;
        }
    }

    currentColor = RED_COLOR;
    currentPlayer = $("#player1");
    currentPlayer.css("background-color", GRAY_COLOR_2);
    currentPlayer.css("border", "solid 5px " + RED_COLOR);
    currentPlayer.children("p").css("color", RED_COLOR);
    currentPlayer.children("p").text("Red Player");
    currentPlayer.children(".stepLine").css("background-size", "0%");
    currentCounter = 1;

    otherColor = YELLOW_COLOR;
    otherPlayer = $("#player2");
    otherPlayer.css("background-color", GRAY_COLOR_2);
    otherPlayer.css("border", "solid 5px " + GRAY_COLOR_2);
    otherPlayer.children("p").css("color", YELLOW_COLOR);
    otherPlayer.children("p").text("Yellow Player");
    otherPlayer.children(".stepLine").css("background-size", "0%");
    otherCounter = 1;
}

function piece_over(i, j) {
    let piece = get_last_piece_in_column(i, j);
    piece.css("opacity", "0.3");
    piece.css("background-color", currentColor);
}

function piece_out(i, j) {
    let piece = get_last_piece_in_column(i, j);
    piece.css("opacity", "1");
    piece.css("background-color", GRAY_COLOR_3);
}

function piece_click(i, j) {
    let piece = get_last_piece_in_column(i, j);
    piece.unbind("mouseover");
    piece.unbind("mouseout");
    piece.unbind("click");
    piece.css("background-color", currentColor);
    piece.css("opacity", "1");
    let indexI = Number(piece.attr("id").split("_")[1]);
    arrBoard[indexI][j] = currentColor;

    if (check_win()) {
        currentPlayer.css("background-color", currentColor);
        currentPlayer.children("p").css("color", GRAY_COLOR_1);
        currentPlayer.children("p").text("WIN!");
        currentPlayer.children(".stepLine").css("background-size", "100%");
        $(".piece").unbind("mouseover");
        $(".piece").unbind("mouseout");
        $(".piece").unbind("click");
        return;
    }

    currentPlayer.children(".stepLine").css("background-size", (currentCounter * 4.7) + "%");
    currentCounter++;
    let tmp1 = currentPlayer;
    let tmp2 = currentColor;
    let tmp3 = currentCounter;
    currentPlayer = otherPlayer;
    currentColor = otherColor;
    currentCounter = otherCounter;
    otherPlayer = tmp1;
    otherColor = tmp2;
    otherCounter = tmp3;
    currentPlayer.css("border", "solid 5px " + currentColor);
    otherPlayer.css("border", "solid 5px " + GRAY_COLOR_2);
}

function get_last_piece_in_column(i, j) {
    for (let k = i; k < ROW; k++) {
        if (k == ROW - 1 || arrBoard[k + 1][j] != GRAY_COLOR_3) {
            return $("#piece_" + k + "_" + j);
        }
    }
}

function check_win() {
    // horizontalCheck 
    for (let j = 0; j < COL - 3; j++) {
        for (let i = 0; i < ROW; i++) {
            if (arrBoard[i][j] == currentColor && arrBoard[i][j + 1] == currentColor && arrBoard[i][j + 2] == currentColor && arrBoard[i][j + 3] == currentColor) {
                make_border_on_pieces(i + "_" + j, i + "_" + (j + 1), i + "_" + (j + 2), i + "_" + (j + 3));
                return true;
            }
        }
    }
    // verticalCheck
    for (let i = 0; i < ROW - 3; i++) {
        for (let j = 0; j < COL; j++) {
            if (arrBoard[i][j] == currentColor && arrBoard[i + 1][j] == currentColor && arrBoard[i + 2][j] == currentColor && arrBoard[i + 3][j] == currentColor) {
                make_border_on_pieces(i + "_" + j, (i + 1) + "_" + j, (i + 2) + "_" + j, (i + 3) + "_" + j);
                return true;
            }
        }
    }
    // ascendingDiagonalCheck 
    for (let i = 3; i < ROW; i++) {
        for (let j = 0; j < COL - 3; j++) {
            if (arrBoard[i][j] == currentColor && arrBoard[i - 1][j + 1] == currentColor && arrBoard[i - 2][j + 2] == currentColor && arrBoard[i - 3][j + 3] == currentColor) {
                make_border_on_pieces(i + "_" + j, (i - 1) + "_" + (j + 1), (i - 2) + "_" + (j + 2), (i - 3) + "_" + (j + 3));
                return true;
            }
        }
    }
    // descendingDiagonalCheck
    for (let i = 3; i < ROW; i++) {
        for (let j = 3; j < COL; j++) {
            if (arrBoard[i][j] == currentColor && arrBoard[i - 1][j - 1] == currentColor && arrBoard[i - 2][j - 2] == currentColor && arrBoard[i - 3][j - 3] == currentColor) {
                make_border_on_pieces(i + "_" + j, (i - 1) + "_" + (j - 1), (i - 2) + "_" + (j - 2), (i - 3) + "_" + (j - 3));
                return true;
            }
        }
    }
    return false;
}

function make_border_on_pieces(piece1, piece2, piece3, piece4) {
    $("#piece_" + piece1).css("border", "solid 5px " + GRAY_COLOR_1);
    $("#piece_" + piece2).css("border", "solid 5px " + GRAY_COLOR_1);
    $("#piece_" + piece3).css("border", "solid 5px " + GRAY_COLOR_1);
    $("#piece_" + piece4).css("border", "solid 5px " + GRAY_COLOR_1);
}