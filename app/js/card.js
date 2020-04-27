var board,
    rows = 'BINGO'.split(''),
    theme = 'default';
var settings = {
    title: 'Bingo Card'
};

$(document).ready(init);

function init() {
    board = $("#board");
    $('#title').text(settings.title);
    $('#bingoTitle').val(settings.title);
    renderBoard();
    window.addEventListener("resize", testWidthWidth);
}
function generateRandomBoardNumbers() {
    var board = [
        'BINGO'.split(''),
        [],
        [],
        [],
        [],
        []
    ];

    var usedNumbers = [];
    for (var rowNumber = 1; rowNumber < 6; rowNumber++) {
        for (var columnNumber = 0; columnNumber < 5; columnNumber++) {
            var bingoNumber = randomIntFromInterval(columnNumber * 15 + 1, columnNumber * 15 + 15);
            while (usedNumbers.indexOf(bingoNumber) > -1) {
                bingoNumber = randomIntFromInterval(columnNumber * 15 + 1, columnNumber * 15 + 15);
            }

            usedNumbers.push(bingoNumber);

            board[rowNumber].push(bingoNumber);
        }
    }

    return board;
}
function randomIntFromInterval(min, max) { // min and max included 
    min = min === 0 ? 1 : min;
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function renderBoard() {
    var boardNumbers = generateRandomBoardNumbers();

    board.empty();

    for (var rowNumber = 0; rowNumber < 6; rowNumber++) {
        var row = $('<tr></tr>');
        board.append(row);

        for (var columnNumber = 0; columnNumber < 5; columnNumber++) {
            if (rowNumber === 0) {
                var cellHeading = $('<th></th>');
                var headingBall = $('<span class="ball"></span>');
                headingBall.text(boardNumbers[rowNumber][columnNumber]);
                cellHeading.append(headingBall);
                row.append(cellHeading);
            } else {
                var cell = $('<td></td>');
                var ball = $('<a class="ball"></a>');
                ball.text(boardNumbers[rowNumber][columnNumber]);
                ball.on('click', cellClick);
                cell.append(ball);
                row.append(cell);
            }
        }
    }
}
function cellClick(e) {
    var $cell = $(e.target);
    var th = e.target.parentNode.parentNode.childNodes[0].innerText;

    if ($cell.hasClass('selected')) {
        if (confirm('Uncheck this number?')) {
            $cell.removeClass('selected');

            var last = numberHistory[numberHistory.length - 1];
            var temp = th + $cell.text();
            console.log(temp + " " + current);
            if (temp === current) {
                $('.currentValue').text(last);
                current = last;
            }

            var i = numberHistory.indexOf(temp);
            if (i >= 0) {
                numberHistory.splice(i, 1);
            }

            i = numberHistory.indexOf(last);
            if (i >= 0) {
                numberHistory.splice(i, 1);
            }

            return;
        } else {
			return;
		}
    }

    $cell.addClass('selected');

    current = th + e.target.innerText;
    $('.currentValue').text(current);
}
function startNewGame() {
    if (confirm('Ready to start a new game?')) {
        $('#board .selected').removeClass('selected');
        renderBoard();
    }
}
function toggleView(which) {
    switch (which) {
        case 'game':
            $('#gameContainer').show();
            $('#settingsContainer').hide();
            $('#navSettings').removeClass('active');

            return;
        case 'settings':
            $('#gameContainer').hide();
            $('#settingsContainer').show();
            $('#navSettings').addClass('active');

            return;
    }
}
function updateTile(value) {
    settings.title = value;
    $('#title').text(settings.title);
    showSaveSuccess('Title saved');
}
function showSaveSuccess(msg) {
    $('.alert-success').text(msg).show();
    setTimeout(function () { $('.alert-success').hide(); }, 3000);
}
function setTheme(btn, which) {
    $('#themeButtons input.btn-bingo').removeClass('btn-bingo').addClass('btn-default');
    $(btn).addClass('btn-bingo');

    switch (which) {
        case 'default':
            document.getElementById('redTheme').disabled = true;
            document.getElementById('blueTheme').disabled = true;
            document.getElementById('greenTheme').disabled = true;
            break;

        case 'red':
            document.getElementById('redTheme').disabled = false;
            document.getElementById('greenTheme').disabled = true;
            document.getElementById('blueTheme').disabled = true;
            break;

        case 'blue':
            document.getElementById('blueTheme').disabled = false;
            document.getElementById('redTheme').disabled = true;
            document.getElementById('greenTheme').disabled = true;
            break;

        case 'green':
            document.getElementById('greenTheme').disabled = false;
            document.getElementById('redTheme').disabled = true;
            document.getElementById('blueTheme').disabled = true;
            break;
    }
}

function testWidthWidth() {
    if (window.innerWidth < 900) {
        //alert('You must use a screen resolution of at least 900 pixels for proper experience.  If your browser is not full screen, please maximize your browser at this time.');
    }

    console.log("W: " + window.innerWidth);
}
