import React, { useState, useEffect } from "react";

import { Howl } from "howler";
import $ from "jquery";
import Info from "./components/Info";
import Loaderr from "./components/Loader";
import TableBet from "./components/Table";
import eventBus from "./eventBus";
import UserWebsocket from "./user.websocket";
import { Button } from "semantic-ui-react";


let _auth = null;
const loc = new URL(window.location);
const pathArr = loc.pathname.toString().split("/");

if (pathArr.length == 3) {
    _auth = pathArr[1] + "___" + pathArr[2];
}

//_auth = "farshad-HangOver2";
//console.log(_auth);
let _renge = [25];
_renge.push(_renge[0] * 2);

_renge.push(_renge[1] * 2);
_renge.push(_renge[1] * 5);
_renge.push(_renge[1] * 10);
_renge.push(_renge[1] * 20);
//const WEB_URL = process.env.REACT_APP_MODE === "production" ? `wss://${process.env.REACT_APP_DOMAIN_NAME}/` : `ws://${loc.hostname}:8088`;
//const WEB_URL = `wss://mroullete.wheelofpersia.com/`;
//const WEB_URL = `ws://${loc.hostname}:8100/roullete`;
const WEB_URL = `wss://server.wheelofpersia.com/roullete`;
// (A) LOCK SCREEN ORIENTATION

const segments = ["0", 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, "00", 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
const REDSeg = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACKSeg = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
const allBets = {
    ODD: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
    EVEN: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
    "1_TO_18": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    "19_TO_36": [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    RED: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
    BLACK: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
    "1ST_COLUMN": [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    "2ND_COLUMN": [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    "3RD_COLUMN": [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    "1ST_DOZEN": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    "2ND_DOZEN": [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    "3RD_DOZEN": [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
};

const getcolor = (item) => {
    let def = "green";
    var itemStr = item.toString();
    if (itemStr.indexOf("DOZEN") > -1 || itemStr.indexOf("COLUMN") > -1 || itemStr.indexOf("_TO_") > -1 || itemStr == "ODD" || itemStr == "EVEN") {
        def = "#3a4744db";
    } else {
        if (REDSeg.includes(item) || REDSeg.includes(parseInt(item)) || itemStr == "RED") {
            def = "red";
        }
        if (BLACKSeg.includes(item) || BLACKSeg.includes(parseInt(item)) || itemStr == "BLACK") {
            def = "black";
        }
    }


    return def;
};
const getbettext = (item) => {
    let def = item;
    var itemStr = item.toString();
    if (itemStr.indexOf("DOZEN") > -1) {
        var s = parseInt(itemStr[0]) * 12 - 11;
        var e = parseInt(itemStr[0]) * 12;

        def = s + " to " + e;
    }
    if (itemStr.indexOf("COLUMN") > -1) {
        def = itemStr.replace("_COLUMN", "").toLowerCase();
    }

    if (itemStr.indexOf("_TO_") > -1) {
        def = itemStr.replace("_TO_", " to ");
    }


    return def;
};
const getcolortext = (item) => {
    let def = "#ffffff";

    return def;
};
const doCurrency = (value) => {
    let val = value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return val;
};
const getChipIcon = (value) => {
    let chipsarr = ["Brown", "Purple", "Orange", "Red", "Blue", "Black"];
    let _idc = 0;
    _renge.map(function (bet, i) {
        if (bet == value / 1000) {
            _idc = i;
        }
    });

    return chipsarr[_idc];
};
const doCurrencyMil = (value, fix) => {
    let val;
    if (value < 1000000) {
        val = doCurrency(parseFloat(value / 1000).toFixed(fix || fix == 0 ? fix : 0)) + "K";
    } else {
        val = doCurrency(parseFloat(value / 1000000).toFixed(fix || fix == 0 ? fix : 1)) + "M";
        val = val.replace(".0", "");
    }
    return val;
};
function checkbox() {
    if ($("#cadr2:visible").length) {
        $("#cadr").show();
        $("#cadr2").hide();
    } else {
        $("#cadr2").show();
        $("#cadr").hide();
    }
}

let _l = [];
let sectors = [];
segments.map((item, i) => {
    sectors.push({
        label: item,
        color: getcolor(item),
    });
});
function useScale(rootId = "root", scaleId = "scale", gamesData, conn) {

    useEffect(() => {

        const doScale = () => {
            try {
                const root = document.getElementById(rootId);
                const scaleEl = document.getElementById(scaleId);

                if (!root || !scaleEl) return;
                const gWidth = root.clientWidth / 1400;
                const gHeight = root.clientHeight / 850;
                let scale = Math.min(gWidth, gHeight);

                if (scale > 1) scale = 1;
                // center translation to keep proportions (approximate)



                const target = 800 - gHeight;
                let t = (800 - target) / 2;
                scaleEl.style.transform = `scale(${scale}) translateY(${t}px)`;

            } catch (e) {
                // ignore
            }
        };
        window.addEventListener("resize", doScale);
        window.addEventListener("orientationchange", doScale);
        // initial

        setTimeout(doScale, 50);



        return () => {
            window.removeEventListener("resize", doScale);
            window.removeEventListener("orientationchange", doScale);
        };
    }, [gamesData, conn]);

}
function animateNum() {
    $('.counter').each(function () {
        var $this = $(this),
            countTo = $this.attr('data-count'),
            countFrom = $this.attr('start-num') ? $this.attr('start-num') : parseInt($this.text().replace(/,/g, ""));

        if (countTo != countFrom && !$this.hasClass('doing')) {
            $this.attr('start-num', countFrom);
            // $this.addClass("doing");

            $({ countNum: countFrom }).animate({
                countNum: countTo
            },

                {

                    duration: 400,
                    easing: 'linear',

                    step: function () {
                        //$this.attr('start-num',Math.floor(this.countNum));
                        $this.text(doCurrency(Math.floor(this.countNum)));
                    },
                    complete: function () {
                        $this.text(doCurrency(this.countNum));
                        $this.attr('start-num', Math.floor(this.countNum));
                        //$this.removeClass("doing");
                        //alert('finished');
                    }

                });


        } else {
            if ($this.hasClass('doing')) {
                $this.attr('start-num', countFrom);
                $this.removeClass("doing");
            } else {
                $this.attr('start-num', countFrom);
            }
        }
    });
}



window.parent.postMessage("userget", "*");

if (window.self === window.top && WEB_URL.indexOf("localhost") == -1) {
    // window.location.href = "https://www.google.com/";
}
let timerRunningOut = new Howl({
    src: ["/sounds/timer_running_out.mp3"],
    volume: 0.5,
    rate: 0.4
});


// let youWin = new Howl({
//   src: ['/sounds/you_win.mp3']
// });
// let youLose = new Howl({
//   src: ['/sounds/you_lose.mp3']
// });

const Main = () => {
    const [chip, setChip] = useState(50);

    return (
        <div>
            <div className={"game-room"} id="scale">
                <div className="fix">
                    
                    <WheelContectNew />

                    <TableContect chip={chip} />
                    <BlackjackGame setChip={setChip} chip={chip} />
                </div>
            </div>
        </div>
    );
};
const BlackjackGame = (prop) => {
    const [gamesData, setGamesData] = useState([]);

    const [lasts, setLasts] = useState([]);
    const [gameData, setGameData] = useState({ status: "" }); // Baraye zakhire JSON object
    const [last, setLast] = useState(false);
    const [conn, setConn] = useState(false);
    const [gameId, setGameId] = useState("Roulette01");
    const [userData, setUserData] = useState(null);
    const [gameTimer, setGameTimer] = useState(-1);
    const [listBets, setListBets] = useState([]);
    const [gameDataLive, setGameDataLive] = useState(null);
    useScale("root", "scale", gamesData, conn);
    useEffect(() => {
        eventBus.on("tables", (data) => {
            setGamesData(data.games);
            if (data.last) {
                let _data = data.games[0];
                localStorage.setItem(data.gameId, JSON.stringify(_data));
                //setGameTimer(15);
            }
        });

        eventBus.on("timer", (data) => {
            if (data.sec <= 9) {
                setLast(false);
                localStorage.removeItem(String(gameId))

            }
            if (data.sec === 10) {
                timerRunningOut.fade(0, 0.5, 2000);
                timerRunningOut.play();
            }
            if (data.sec == 3) {

                timerRunningOut.fade(0.5, 0, 4000);
            }
            setGameTimer(data.sec);

        });
        eventBus.on("connect", (data) => {
            setConn(true);
            if (data.theClient?.balance >= 0) {
                setUserData(data.theClient);
            } else {
                setUserData(data.theClient);
                // setConn(false);
                //_auth = null;
            }
        });
        eventBus.on("lasts", (data) => {
            setLasts(data.total);
        });
        eventBus.on("close", () => {
            setConn(false);
            _auth = null;
            setGamesData([]);
        });
    }, []);

    useEffect(() => {
        if (gamesData.length) {
            const _data = gamesData.filter((game) => game?.id === gameId)[0];
            //console.log(_data);
            if (_data.players.length == 0) {
                setGameTimer(15);
            }
            setGameDataLive(_data);
            //setGameData(_data);
        }
    }, [gamesData]);
    useEffect(() => {
        if (last) {
            $("body").css("background", "rgb(16 67 67)").addClass('last');

            $(".chip.org").remove();
        } else {
            $("body").css("background", "rgb(96 6 71)").removeAttr("class");
            $(".chip.lst").remove();
        }
    }, [last]);
    useEffect(() => {


        if (gameData?.status == "End") {
            for (const [key, value] of Object.entries(allBets)) {
                if (value.includes("" + segments[gameData.number] + "") || value.includes(segments[gameData.number])) {
                    $("[data-bet=" + key + "]").addClass("item-selected");
                }
            }

            $("[data-bet=" + segments[gameData?.number] + "]").addClass("item-selected-num");
            $('[data-bet="' + segments[gameData?.number] + '"]').addClass("item-selected-num");

        } else {
            $(".item-selected-num").removeClass("item-selected-num");

            $(".item-selected").removeClass("item-selected");

        }
        if (gameData?.status == "Spin") {

            //setLast(false);
            $(".roulette-table-container").addClass("noclick-nohide");
            $(".lastwheel").addClass("Spin");
        } else {
            $(".lastwheel").removeClass("Spin");
            $("[data-bet]").removeClass("noclick-nohide");

        }
        if (gameData?.status == "Done") {

            $(".roulette-table-container").removeClass("noclick-nohide");
        }

        $("#betslist:not(.doing)")
            .addClass("doing")
            .delay(2000)
            .animate(
                {
                    scrollTop: 1000,
                },
                6000,
                function () {
                    $("#betslist.doing")
                        .delay(1000)
                        .animate(
                            {
                                scrollTop: 0,
                            },
                            1000,
                            function () {
                                $("#betslist.doing").removeClass("doing");
                            }
                        );
                }
            );


    }, [gameData?.status]);
    useEffect(() => {
        if (last && gameDataLive?.status == "Done") {
            setGameData(JSON.parse(localStorage.getItem(gameId)));
        } else {
            if (gameDataLive?.players) {
                if (gameDataLive?.players.length == 0) {
                    $(".chip").remove();
                }
            }
            setGameData(gameDataLive);
        }
        setTimeout(() => {
            animateNum();

        }, 100);
    }, [last, gameDataLive]);

    useEffect(() => {

        if (gameData?.players) {
            if (gameData?.status == "End") {
                setListBets(gameData?.players.sort((a, b) => (a.win > b.win ? -1 : 1)));
            } else {
                setListBets(gameData?.players.sort((a, b) => (a.amount > b.amount ? -1 : 1)));
            }
            gameData.players.map(function (x, i) {
                if (x.nickname != userData?.nickname) {
                    let modecls = "org";
                    if (last) {
                        modecls = "lst";
                    }
                    if ($("[data-bet=" + x.betId.id + "]").length > 0) {
                        let blnIs = $("[data-bet=" + x.betId.id + "]").find('[username="' + x.nickname + '"]').length;
                        if (blnIs == 0) {
                            let cIcon = getChipIcon(x.amount);
                            let cCount = $("[data-bet=" + x.betId.id + "]").find(".user").length + i;
                            if (x.betId.payload.length == 1) {
                                $("[data-bet=" + x.betId.id + "] > div.value").append('<div class="chip center user animate__animated animate__zoomInDown ' + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.002 : 0.001) + "s;transform: scale(0.7) translate(-" + ((cCount - i) * 5 + 30) + "px," + (cCount - i) * 5 + "px);background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                            } else {
                                $("[data-bet=" + x.betId.id + "] > div").append('<div class="chip center user animate__animated animate__zoomInDown ' + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.002 : 0.001) + "s;transform: scale(0.7) translate(-" + ((cCount - i) * 5 + 30) + "px," + (cCount - i) * 5 + "px);background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                            }
                        }
                    } else {
                        let blnIs = $("[data-highlight=" + x.betId.id + "]:first").find('[username="' + x.nickname + '"]').length;
                        if (blnIs == 0) {
                            let cIcon = getChipIcon(x.amount);
                            let cCountC = $("[data-highlight=" + x.betId.id + "]").find(".user").length + i;
                            let cCount = x.betId.id.split("-");
                            var cclass = "center";
                            if (cCount.length == 2 && parseInt(cCount[0]) + 1 != parseInt(cCount[1]) && parseInt(cCount[0]) - 1 != parseInt(cCount[1])) {
                                cclass = "right-center";
                            }
                            if (cCount.length == 2 && parseInt(cCount[0]) == 0 && cCount[1] == "00") {
                                cclass = "center";
                            }
                            if (cCount.length == 2 && parseInt(cCount[0]) == 0 && cCount[1] != "00") {
                                cclass = "right-center";
                            }
                            $("[data-highlight=" + x.betId.id + "]:first").append('<div class="chip ' + cclass + " user animate__animated animate__zoomInDown " + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.005 : 0.001) + "s;transform: scale(0.7) translate(-" + ((cCountC - i) * 5 + 10) + "px," + (cCountC - i) * 5 + "px);background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                        }
                    }
                } else {
                    $(".roulette-table-container").removeClass("noclick-nohide");

                    let modecls = "org";
                    if (last) {
                        modecls = "lst";
                    }
                    if ($("[data-bet=" + x.betId.id + "]").length > 0) {
                        let blnIs = $("[data-bet=" + x.betId.id + "]").find('[username="' + x.nickname + '"]').length;
                        if (blnIs == 0) {
                            let cIcon = getChipIcon(x.amount);
                            let cCount = $("[data-bet=" + x.betId.id + "]").find(".user").length + i;
                            if (x.betId.payload.length == 1) {
                                $("[data-bet=" + x.betId.id + "] > div.value").append('<div class="chip center animate__animated animate__rotateIn ' + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.002 : 0.001) + "s;background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                            } else {
                                $("[data-bet=" + x.betId.id + "] > div").append('<div class="chip center animate__animated animate__rotateIn ' + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.002 : 0.001) + "s;background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                            }
                        }
                    } else {
                        let blnIs = $("[data-highlight=" + x.betId.id + "]:first").find('[username="' + x.nickname + '"]').length;
                        if (blnIs == 0) {
                            let cIcon = getChipIcon(x.amount);
                            let cCount = x.betId.id.split("-");
                            var cclass = "center";
                            if (cCount.length == 2 && parseInt(cCount[0]) + 1 != parseInt(cCount[1]) && parseInt(cCount[0]) - 1 != parseInt(cCount[1])) {
                                cclass = "right-center";
                            }
                            if (cCount.length == 2 && parseInt(cCount[0]) == 0 && cCount[1] == "00") {
                                cclass = "center";
                            }
                            if (cCount.length == 2 && parseInt(cCount[0]) == 0 && cCount[1] != "00") {
                                cclass = "right-center";
                            }

                            // if(cCount.length==3){cclass = "left-top"}
                            // if(cCount.length==5){cclass = "right-top"}

                            $("[data-highlight=" + x.betId.id + "]:first").append('<div class="chip ' + cclass + " animate__animated animate__rotateIn " + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.002 : 0.001) + "s;background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                        }
                    }
                }
            });
        }
    }, [gameData?.players]);

    // Agar gaData nist, ye matn "Loading" neshan bede

    if (!conn || !gamesData || !gameData || !userData || lasts.length == 0) {
        return <Loaderr errcon={!gamesData || !gameData || !userData || lasts.length == 0 ? false : true} />;
    }
    let _countBet = 0;

    let _totalBet = 0;
    let _totalWin = 0;
    let _totalBetAll = 0;
    let _totalWinAll = 0;
    gameData.players.map(function (player, pNumber) {
        _totalBetAll = _totalBetAll + player.amount;
        _totalWinAll = _totalWinAll + player.win;
        if (player.nickname == userData.nickname) {

            _countBet = _countBet + 1;
            _totalBet = _totalBet + player.amount;
            _totalWin = _totalWin + player.win;
        }
    });
    if (_totalBet > 0 && gameDataLive.status != "Done") {
        let lastbet = gameData.players.filter((bet) => bet.nickname == userData.nickname);
        if (lastbet.length) { localStorage.setItem(gameId + "bet" + userData.nickname, JSON.stringify(lastbet)) }

    }
    return (
        <>
            <Info setGameId={setGameId} gameId={gameId} totalBetAll={_totalBetAll} totalWinAll={_totalWinAll} />
            <div id="balance-bet-box">
                <div className="balance-bet">
                    Balance
                    <div id="balance" className="counter" data-count={userData.balance}>{doCurrency(userData.balance)}</div>
                </div>
                <div className="balance-bet">
                    Yout Bets
                    <div id="total-bet" className="counter" data-count={_totalBet}>0</div>
                </div>
                <div className="balance-bet">
                    Your Wins
                    <div id="total-bet" className="counter" data-count={_totalWin}>0</div>
                </div>
                {localStorage.getItem(gameId) && gameDataLive.status == "Done" && gameTimer > 2 && (
                    <div
                        className="balance-bet"
                        onMouseEnter={() => {
                            setLast(true);
                        }}
                        onMouseLeave={() => {
                            setLast(false);
                        }}
                    >
                        Show Last Game
                    </div>
                )}

                <div id="bets-container" className={(gameTimer < 2 && gameTimer > -1) || gameData.gameOn == true ? "nochip" : ""}>
                    {_renge.map(function (bet, i) {
                        if (bet * 1000 <= userData.balance) {
                            return (
                                <span key={i} className={prop.chip == bet ? "curchip" : ""}>
                                    <button
                                        className="betButtons  animate__faster animate__animated animate__zoomInUp"
                                        style={{ animationDelay: i * 100 + "ms" }}
                                        id={"chip" + i}
                                        value={bet * 1000}
                                        onClick={() => {
                                            prop.setChip(bet);
                                        }}
                                    >
                                        {doCurrencyMil(bet * 1000)}
                                    </button>
                                </span>
                            );
                        } else {
                            return (
                                <span key={i} className={prop.chip == bet ? "curchip" : ""}>
                                    <button className="betButtons noclick noclick-nohide animate__animated animate__zoomInUp" style={{ animationDelay: i * 100 + "ms" }} id={"chip" + i} value={bet * 1000}>
                                        {doCurrencyMil(bet * 1000)}
                                    </button>
                                </span>
                            );
                        }
                    })}
                </div>
            </div>

            {gameTimer >= 1 && !gameData.gameOn && gameData.gameStart && (
                <div id="deal-start-label">
                    <p className="animate__bounceIn animate__animated animate__infinite" style={{ animationDuration: "1s" }}>
                        Waiting for bets <span>{gameTimer}</span>
                    </p>
                </div>
            )}

            <div id="dealer">
                {lasts.length > 0 && (
                    <div className="dealer-cards">
                        {lasts.map(function (x, i) {
                            if (i < 20) {
                                let card = segments[x];
                                return (
                                    <div className="visibleCards animate__fadeIn animate__animated" key={i} style={{ animationDelay: (i + 1) * 90 + "ms", background: getcolor(card), color: getcolortext(card) }}>
                                        {card}
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}
                {gameData.players.length > 0 && (
                    <div className="dealer-cards" id="betslist">
                        <div>
                            {listBets.map(function (x, i) {
                                if (i < 500) {
                                    let card = x.betId.payload;
                                    let mode = x.betId.id;
                                    return (
                                        <div className={x.win == 0 && gameData.status == "End" ? "result-lose betbox  animate__fadeIn animate__animated" : "betbox  animate__fadeIn animate__animated"} key={i}>
                                            <img src={"/imgs/avatars/" + x?.avatar + ".webp"} />
                                            {x.nickname}
                                            <div className={x.win == 0 && gameData.status == "End" ? "result-lose" : x.win > 0 && gameData.status == "End" ? "result-win" : ""}>


                                                {x.win > 0 ? (
                                                    <>
                                                        {doCurrencyMil(x.amount)} x{36 / x.betId.payload.length} +{doCurrencyMil(x.win)}
                                                    </>
                                                ) : (
                                                    <>
                                                        {doCurrencyMil(x.amount)} x{36 / x.betId.payload.length}
                                                    </>
                                                )}
                                            </div>
                                            <div>
                                                {card.length < 7 ? (
                                                    <>
                                                        {card.map(function (x, i) {
                                                            if (i < 6) {
                                                                let card = x;
                                                                return (
                                                                    <span className="betCards" key={i} style={{ background: getcolor(x), color: getcolortext(x) }}>{card}</span>
                                                                );
                                                            }
                                                        })}


                                                    </>
                                                ) : (
                                                    <><span className="betCards" style={{ background: getcolor(mode), color: getcolortext(mode) }}>{getbettext(mode)}</span></>
                                                )}
                                            </div>

                                        </div>
                                    );
                                }
                            })}

                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
var initTime;
var lightMod;
const WheelContectNew = () => {
    const [gamesData, setGamesData] = useState([]);
    const [startNum, setStartNum] = useState(-1);

    const [gameTimer, setGameTimer] = useState(-1);
    const [timer, setTimer] = useState(5);

    const initGame = (num, rot) => {
        //  console.log(initTime);


        clearTimeout(initTime);
        if (document.getElementsByTagName("canvas")[0]) {
            const tot = 360 / sectors.length;
            const ctx = document.querySelector("#wheel").getContext("2d");
            if (rot == true) {
                $(".lastwheel").addClass("Spin");

                $("#dospin").removeClass("frz").addClass("dospin");
                $("canvas").removeClass("frz");

            }
            if (!$("canvas").hasClass("drowed")) {
                $("canvas").addClass("drowed");
                var canvas = document.getElementsByTagName("canvas")[0];
                canvas.width = 600;
                canvas.height = 600;

                const dia = ctx.canvas.width;
                const rad = dia / 2;
                const PI = Math.PI;
                const TAU = 2 * PI;
                const arc = TAU / sectors.length;

                function drawSector(sector, i) {
                    const ang = arc * i;
                    ctx.save();
                    // COLOR
                    ctx.beginPath();
                    ctx.fillStyle = sector.color;
                    ctx.moveTo(rad, rad);
                    ctx.arc(rad, rad, rad, ang, ang + arc);
                    ctx.lineTo(rad, rad);
                    ctx.fill();
                    // TEXT
                    ctx.translate(rad, rad);
                    ctx.rotate(ang + arc / 2);
                    ctx.textAlign = "right";
                    ctx.fillStyle = "#fff";
                    ctx.font = "bold 22px sans-serif";
                    ctx.fillText(sector.label, rad - 50, 7);

                    //
                    ctx.restore();
                }
                sectors.forEach(drawSector);

                rot = true;
            }
            const defnum = num;
            function rotate() {

                const mydeg = tot * 28 + Math.floor((Math.random() * tot) / 1.5);
                //console.log(tot * 28, defnum);

                ctx.canvas.style.transform = `rotate(${mydeg - defnum * tot}deg)`;
            }
            // console.log(num, rot);
            if (rot) rotate();

        } else {
            initTime = setTimeout(() => {
                initGame(num, rot);
            }, 200);
        }
    };

    useEffect(() => {
        eventBus.on("tables", (data) => {
            setGamesData(data.games[0]);
            clearInterval(lightMod);
        });

        eventBus.on("close", () => {
            setGamesData([]);
        });
    }, []);
    useEffect(() => {

        if (gamesData?.status) {
            //console.log(gamesData);

            if (gamesData.status == "Spin") {


                if (timer != 15) {

                    setTimer(gamesData.startTimer);
                }

                lightMod = setInterval(() => {
                    checkbox();
                }, 1000);

                initGame(gamesData.number, true);

                //const newPrizeNumber = Math.floor(Math.random() * _l.length);
            } else {
                setTimer(15);


                $(".lastwheel").removeClass("Spin");

                $("#dospin").addClass("frz").removeClass("dospin");
                $("canvas").addClass("frz");
                initGame(gamesData.number, false);
            }
        }
    }, [gamesData.status]);
    //console.log(mustSpin, prizeNumber, startNum, gameTimer);
   if (!gamesData?.status) {
        return <></>;
    }

    return (
        <>
            <div className={"lastwheel"}>
                <div>

                    <div className="countover">
                        <img src="/imgs/cadr2.png" id="cadr" />
                        <img src="/imgs/cadr4.png" id="cadr2" style={{ display: "none" }} />

                        <img src="/imgs/cadr3.png" className="rotate" />
                    </div>
                    <div id="wheelOfFortune">
                        <div id="dospin" className="" style={{ transitionDuration: timer - 3 + "s" }}>
                            <canvas id="wheel" width="450" height="450" style={{ transitionDuration: timer - 12 + "s" }}></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const TableContect = (prop) => {
    const chip = prop.chip;
    const [gamesData, setGamesData] = useState(null);
    const [gameTimer, setGameTimer] = useState(-1);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            UserWebsocket.connect(WEB_URL, _auth);
        }, 500);

        eventBus.on("tables", (data) => {
            setGamesData(data.games[0]);
            if (gameTimer == -1) {
                setGameTimer(data.games[0].startTimer);
            }
        });

        eventBus.on("timer", (data) => {
            setGameTimer(data.sec);
        });
        eventBus.on("connect", (data) => {
            if (data.theClient?.balance >= 0) {
                setUserData(data.theClient);
            } else {
                setUserData(data.theClient);
                // setConn(false);
                //_auth = null;
            }

        });
        eventBus.on("close", () => {
            setGamesData([]);
        });
    }, []);

    if (!gamesData?.status) {
        return <></>;
    }
    const reBets = () => {
        var data = JSON.parse(localStorage.getItem(gamesData.id + "bet" + userData.nickname))
        data.forEach((bet, i) => {
            setTimeout(() => {
                handleBets(bet.betId, bet.amount)
            }, 500 * i);

        });
        localStorage.removeItem(gamesData.id + "bet" + userData.nickname)
    };
    const handleBets = (data, amount) => {
        if (!gamesData.gameOn && gameTimer >= 0 && checkBets(data, userData.nickname)) {
            $("[data-bet=" + data.bet + "]").addClass("noclick-nohide");
            var newAm = amount ? amount : chip * 1000
            //$(".roulette-table-container").addClass("noclick-nohide");

            //console.log(JSON.stringify({ method: "bet", amount: chip * 1000, theClient: userData, gameId: gamesData.id, bet: data }));
            UserWebsocket.connect(JSON.stringify({ method: "bet", amount: newAm, theClient: userData, gameId: gamesData.id, bet: data }));
        }
    };
    const checkBets = (seat, username) => {
        let check = true;
        let userbet = gamesData.players.filter((bet) => bet.betId.bet == seat.bet && bet.betId.id == seat.id && bet.nickname == username);
        if (userbet.length) {
            check = false;
        }

        return check;
    };

    return (
        <>
            {(localStorage.getItem(gamesData.id + "bet" + userData.nickname) && gamesData.status == "Done") && (

                <div id="deal-start-label" style={{ zIndex: 30, marginTop: -100 }}>
                    <Button color="red" size="huge" onClick={() => reBets()} className="animate__bounceIn animate__animated " >
                        ReBet
                    </Button>
                </div>
            )

            }
            <div className={chip * 1000 > userData.balance || gamesData.status != "Done" ? "nochip bettable " + gamesData.status : "bettable"}>
                <TableBet handleBets={handleBets} />
            </div>
        </>
    );
};

window.addEventListener("message", function (event) {
    if (event?.data?.username) {
        const payLoad = {
            method: "syncBalance",

            balance: event?.data?.balance,
        };
        try {
            UserWebsocket.connect(JSON.stringify(payLoad));
            //socket.send(JSON.stringify(payLoad));
        } catch (error) { }
    }
});

export default Main;
