var points = 0;
var currentCubs = 0;
var myTimer;
$("#numberPoints").html(points);
var players_results = JSON.parse(localStorage.getItem('playersResults') || "{}")
var colorsPointsMap = {
    "green": 3,
    "red": -1,
    "black": -3,
    "yellow": 1,
    "blue": 2
};
var sizePointsMap = {
    "small": 5,
    "medium": 3,
    "large": 1
};
var clickPointsMap = {
    "green_small": 2,
    "green_medium": 1,
    "green_large": 1,
    "red_small": 3,
    "red_medium": 2,
    "red_large": 1,
    "black_small": 2,
    "black_medium": 2,
    "black_large": 1,
    "yellow_small": 1,
    "yellow_medium": 2,
    "yellow_large": 1,
    "blue_small": 3,
    "blue_medium": 2,
    "blue_large": 2
}
var colors = Object.keys(colorsPointsMap);

var maxCubes = 112;
var timerState = 0;
var startTime = 59;
var time = startTime;
var timerButton = $('#timerButton');
var startId = 1;
var countClickOnCubes = {};
var addResult = function (name, points) {
    $('#resultContainer').append(
        "<div><span id='nameVal'>"
        + name + ": "
        + "</span><span id='pointsVal'>"
        + points
        + "</span></div>"
    )
}


var cubeSize = Object.keys(sizePointsMap);
$('#timerButton').attr('disabled', 'disable');
for (var i in players_results) {
    addResult(i, players_results[i]);
}
var addCubes = function (countCubes) {
    for (var i = 0; i < countCubes; i++) {
        var randomSize = cubeSize[getRandomIntInclusive(0, cubeSize.length - 1)];
        var randomColor = colors[getRandomIntInclusive(0, colors.length - 1)];
        $('.wrapperGameField').append("<div id=" + startId + " onclick=\"onCubeClick(this,'" + randomColor + "','"
            + randomSize + "')\" class='cube " + randomColor + " " + randomSize + "'></div>");
        startId += 1;
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$('#timerButton').click(function () {
    function startTimer(duration, display) {
        var timer = duration, minutes, seconds;
        myTimer = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.text(minutes + ":" + seconds);
            time--;
            if (--timer < 0) {
                timer = 0;
                $(".modalWrapper").addClass("active");
                $("#numberPointsModal").html(points);
                $(".modalWrapper").removeClass("closeModal");
            }
        }, 1000);
    }
    var timerElement = $('#timer');
    if (timerState === 0) {
        startTimer(time, timerElement);
        timerButton.html("PAUSE");
        timerState = 1;
        var randomColCubs = getRandomIntInclusive(1, maxCubes);
        currentCubs = randomColCubs;
        addCubes(randomColCubs);
    }
    else if (timerState === 1) {
        clearInterval(myTimer);
        timerButton.html("START");
        timerState = -1;
        $('.wrapperGameField').append('<div class="pauseOverlay">PAUSE</div>');
    }
    else {
        startTimer(time, timerElement);
        timerButton.html("PAUSE");
        timerState = 1;
        $("div.pauseOverlay").remove()
    }

});

$('#newGameButton').click(function () {
    $('#timerButton').removeAttr('disabled');
    points = 0;
    if (myTimer != null) {
        clearInterval(myTimer);
    }
    time = startTime;
    $('.wrapperGameField').html("");
    $('#timer').html("01:00");
    $('#numberPoints').html("0");
    timerState = 0;
    currentCubs = 0;
    timerButton.html("START");
    countClickOnCubes = {};
});

$('.btnModal').on('click', function () {
    $(".modalWrapper").addClass("closeModal");
    $(".modalWrapper").removeClass('active');
    var value_player = $('#valuePlayer').val();
    console.log(value_player);
    addResult(value_player, points);
    players_results[value_player] = points;
    localStorage.setItem('playersResults', JSON.stringify(players_results));
    $('#timerButton').attr('disabled', 'disable');
    clearInterval(myTimer);
    points = 0;
    $("#numberPointsModal").html("");
    $("#valuePlayer").val("");
});

var onCubeClick = function (element, color, size) {
    var addColCubes = getRandomIntInclusive(0, 2);
    var currentId = $(element).attr('id');
    if (!(currentId in countClickOnCubes)) {
        countClickOnCubes[currentId] = 0;
    }
    countClickOnCubes[currentId] += 1;
    if (countClickOnCubes[currentId] >= clickPointsMap[color + "_" + size]) {
        $(element).remove();
        currentCubs -= 1;
        if ((currentCubs + addColCubes) < maxCubes) {
            points += colorsPointsMap[color] + sizePointsMap[size];
            $("#numberPoints").html(points);
            addCubes(addColCubes);
            currentCubs += addColCubes;
        }
    }


}