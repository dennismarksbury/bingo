var board,
    numberHistory,
    current,
    winners = ['--', '--', '--'],
    rows = 'BINGO'.split('')
    winnerListEnabled = false,
    theme = 'default';
var settings = {
    title: 'Bingo Caller'
};

$(document).ready(init);

function init() {
    initPattern();
    board = $("#board");
    $('#title').text(settings.title);
    $('#bingoTitle').val(settings.title);
    $('#btnClearPattern').on('click', clearPattern);
    renderBoard(null, 15);
    _renderHistory();
    _renderWinnerList()
    window.addEventListener("resize", testWidthWidth);
}
function initPattern() {
    //$($('#pattern div')[12]).addClass('selected');
    $('#pattern div').on('click', clickPattern);
}
function renderBoard(btn, columns) {
    if (current != null) {
        if (!confirm('It appears you have already started a game.  If you continue, this will reset the game.  Do you wish to continue and start a new game?')) {
            return false;
        }
    }

    if (btn) {
        $('#ballButtons input.btn-bingo').removeClass('btn-bingo').addClass('btn-default');
        $(btn).addClass('btn-bingo');
    }

    startNewGame();
    var x = 1;
    board.empty();

    for (var i = 0; i < rows.length; i++) {
        var row = $('<tr></tr>');
        board.append(row);

        var cellHeading = $('<th></th>');
        var headingBall = $('<span class="ball"></span>');
        headingBall.text(rows[i]);
        cellHeading.append(headingBall);
        row.append(cellHeading);

        for (var j = 0; j < columns; j++) {
            var cell = $('<td></td>');

            var ball = $('<a class="ball"></a>');
            ball.text(x);
            ball.addClass(rows[i] + x);
            ball.on('click', cellClick);

            cell.append(ball);
            row.append(cell);
            x++;
        }
    }

    switch (columns) {
        case 6:
            showSaveSuccess('Game board set for "30 Ball" Bingo.');
            break;
        case 15:
            showSaveSuccess('Game board set for "75 Ball" Bingo.');
            break;
        case 18:
            showSaveSuccess('Game board set for "90 Ball" Bingo.');
            break;
    }

    return true;
}
function clickPattern(e) {
    var all = $('#pattern div');
    var i = all.index(this);
    $(all[i]).addClass('selected');
}
function cellClick(e) {
    var $cell = $(e.target);
    var th = e.target.parentNode.parentNode.childNodes[0].innerText;
    var bingoNumber = th + e.target.innerText;
    select(bingoNumber);

    return;
}
function select(bingoNumber) {
    var $cell = $('.' + bingoNumber);
    if ($cell.hasClass('selected')) {
        if (confirm('Uncheck this number?')) {
            $cell.removeClass('selected');

            var last = numberHistory[numberHistory.length - 1];
            if (bingoNumber === current) {
                $('.currentValue').text(last);
                current = last;
            }

            var i = numberHistory.indexOf(bingoNumber);
            if (i >= 0) {
                numberHistory.splice(i, 1);
            }

            i = numberHistory.indexOf(last);
            if (i >= 0) {
                numberHistory.splice(i, 1);
            }

            _renderHistory();

            return;
        } else {
            return;
        }
    }

    $cell.addClass('selected');

    if (current !== null) {
        addToHistory(current);
    }

    current = bingoNumber;
    $('.currentValue').text(current);
    _renderHistory();
}
function addToHistory(item) {
    numberHistory.push(item);
}
function _renderHistory() {
    var html = [];
    var end = numberHistory.length > 3 ? numberHistory.length - 3 : 0;
    for (var i = numberHistory.length - 1; i >= end; i--) {
        html.push('<li class="list-group-item list-group-item-info">' + numberHistory[i] + '</li>');
    }

    $('.history').html('');
    $('.history').html(html.join(''));
}
function startNewGame() {
    $('#board .selected').removeClass('selected');
    $('.currentValue').text('--');

    current = null;
    selected = [];
    numberHistory = ['--', '--', '--'];
    _renderHistory();
}
function setPattern(element) {
    $('#pattern .selected').removeClass('selected');
    var selected;
    var free = true;

    switch (element.value) {
        case 'Center Row':
            selected = [10, 11, 13, 14];
            free = true;
            break;
        case 'Checkmark':
            selected = [9, 13, 15, 17, 21];
            free = false;
            break;
        case "'C' for Clermont!":
            selected = [2, 3, 4, 6, 10, 16, 22, 23, 24];
            free = false;
            break;
        case "'L'":
            selected = [0, 5, 10, 15, 20, 21, 22, 23, 24];
            free = false;
            break;
        case 'Pyramid':
            selected = [16, 17, 18, 20, 21, 22, 23, 24];
            free = true;
            break;
        case "'T'":
            selected = [0, 1, 2, 3, 4, 7, 17, 22];
            free = true;
            break;
        case 'B-N-O':
            selected = [0, 5, 10, 15, 20, 2, 7, 17, 22, 4, 9, 14, 19, 24];
            free = true;
            break;
        case '4x4':
            selected = [0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 13, 15, 16, 17, 18];
            free = true;
            break;
        case 'Checkers':
            selected = [0, 2, 4, 6, 8, 10, 14, 16, 18, 20, 22, 24];
            free = true;
            break;
        case 'Blackout':
            selected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
            free = true;
            break;
        case '4 Corners':
            selected = [0, 4, 20, 24];
            free = false;
            break;
        case 'Cross':
            selected = [2, 7, 17, 22, 10, 11, 13, 14];
            free = true;
            break;
        case "'X'":
            selected = [0, 4, 6, 8, 16, 18, 20, 24];
            free = true;
            break;
        case "'Z'":
            selected = [0, 1, 2, 3, 4, 8, 16, 20, 21, 22, 23, 24];
            free = true;
            break;
        default:
            free = true;
    }

    if (!free) {
        $('#pattern .free').removeClass('free');
    } else {
        $($('#pattern div')[12]).addClass('free');
    }

    var all = $('#pattern div');
    for (var i = 0; i < selected.length; i++) {
        $(all[selected[i]]).addClass('selected');
    }
}
function clearPattern() {
    $('#pattern .selected').removeClass('selected');
    $($('#pattern div')[12]).addClass('free');
    $('#lstPatterns').val("Select...");
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
function addNewWinner() {
    var name = prompt('Enter winner name:');
    if (name) {
        winners.push(name.toUpperCase());
        if (winners.length === 4) {
            winners.splice(0, 1);
        }

        _renderWinnerList();
    }
}
function clearWinnerList() {
    winners = ['--', '--', '--'];
    _renderWinnerList();
}
function _renderWinnerList() {
    var html = [];
    for (var i = winners.length - 1; i >= 0; i--) {
        html.push('<li class="list-group-item list-group-item-info">' + winners[i] + '</li>');
    }

    $('#lstWinners').html('');
    $('#lstWinners').html(html.join(''));
}
function displayWinnerList(btn) {
    winnerListEnabled = !winnerListEnabled;
    if (winnerListEnabled) {
        $(btn).removeClass('btn-default').addClass('btn-bingo').text('YES');
        $('#detailRow .col-md-4').removeClass('col-md-4').addClass('col-md-3');
        $('.winnerContainer').show();
        showSaveSuccess('Winner list is now visible.');
    } else {
        $(btn).removeClass('btn-bingo').addClass('btn-default').text('NO');
        $('#detailRow .col-md-3').removeClass('col-md-3').addClass('col-md-4');
        $('.winnerContainer').hide();
        showSaveSuccess('Winner list no longer visible.');
    }
}

function testWidthWidth() {
    if (window.innerWidth < 900) {
        //alert('You must use a screen resolution of at least 900 pixels for proper experience.  If your browser is not full screen, please maximize your browser at this time.');
    }

    console.log("W: " + window.innerWidth);
}

function randomIntFromInterval(min, max) { // min and max included 
    min = min === 0 ? 1 : min;
    return Math.floor(Math.random() * (max - min + 1) + min);
}


var usedNumbers = [];
var timer = null;

startAutomatedDrawing();

function startAutomatedDrawing() {
    timer = window.setInterval(drawNumber, 5000);
}
function drawNumber() {
    if (usedNumbers.length === 75) {
        window.clearInterval(timer);
        timer = null;
        alert('Game over! All numbers have been used.');
        return;
    }

    var drawnNumber = randomIntFromInterval(1, 75);
    while (usedNumbers.indexOf(drawnNumber) > -1) {
        drawnNumber = randomIntFromInterval(1, 75);
    }

    usedNumbers.push(drawnNumber);

    var bingoNumber = '';
    var position = 0;
    if (drawnNumber % 15 === 0) {
        position = drawnNumber / 15 - 1;
    } else {
        position = Math.floor(drawnNumber / 15);
    }

    switch (position) {
        case 0:
            bingoNumber = 'B' + drawnNumber;
            break;
        case 1:
            bingoNumber = 'I' + drawnNumber;
            break;
        case 2:
            bingoNumber = 'N' + drawnNumber;
            break;
        case 3:
            bingoNumber = 'G' + drawnNumber;
            break;
        case 4:
            bingoNumber = 'O' + drawnNumber;
            break;
    }

    select(bingoNumber);
}