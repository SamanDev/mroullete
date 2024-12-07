import React, { useState, useEffect } from "react";

import { Howl } from "howler";
import $ from "jquery";
import Info from "./components/Info";
import Loaderr from "./components/Loader";
import TableBet from "./components/Table";
import eventBus from "./eventBus";
import UserWebsocket from "./user.websocket";

import { Wheel } from "react-custom-roulette";

let _auth = null;
const loc = new URL(window.location);
const pathArr = loc.pathname.toString().split("/");

if (pathArr.length == 3) {
    _auth = pathArr[1];
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
const WEB_URL = `wss://mroullete.wheelofpersia.com/`;
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

    if (REDSeg.includes(item)) {
        def = "red";
    }
    if (BLACKSeg.includes(item)) {
        def = "black";
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
setInterval(() => {
    checkbox();
}, 500);
let _l = [];

segments.map((item, i) => {
    _l.push({
        option: item,
        style: {
            backgroundColor: getcolor(item),
            textColor: getcolortext(item),
        },
    });
});
function animateNum() {
    $(".counter").each(function () {
        let $this = $(this),
            countTo = $this.attr("data-count"),
            countFrom = $this.attr("start-num") ? $this.attr("start-num") : parseInt($this.text().replace(/,/g, ""));

        if (countTo != countFrom && !$this.hasClass("doing")) {
            $this.attr("start-num", countFrom);
            // $this.addClass("doing");

            $({ countNum: countFrom }).animate(
                {
                    countNum: countTo,
                },

                {
                    duration: 200,
                    easing: "linear",

                    step: function () {
                        //$this.attr('start-num',Math.floor(this.countNum));
                        $this.text(doCurrency(Math.floor(this.countNum)));
                    },
                    complete: function () {
                        $this.text(doCurrency(this.countNum));
                        $this.attr("start-num", Math.floor(this.countNum));
                        //$this.removeClass("doing");
                        //alert('finished');
                    },
                }
            );
        } else {
            if ($this.hasClass("doing")) {
                $this.attr("start-num", countFrom);
                $this.removeClass("doing");
            } else {
                $this.attr("start-num", countFrom);
            }
        }
    });
}
const AppOrtion = () => {
    if (!$("#scale").attr("style")) {
        let maxWidth = 1400,
            maxHeight = 750;
        //console.log($("#root").width(),$("#root").height());
        // console.log(gWidth,gHight,scale);
        let scale,
            width = $("#root").width(),
            height = $("#root").height(),
            isMax = width >= maxWidth && height >= maxHeight;

        scale = Math.min(width / maxWidth, height / maxHeight);
        let highProtect = ($("#root").height() * height) / maxHeight;

        let _t = 0;
        if (_t < 0) {
            //_t = _t * -1;
        }

        if (isMax) {
            $("#scale").css("transform", "scale(1)");
        } else {
            $("#scale").css("transform", "scale(" + scale + ")");
        }
    }

    // console.log(gWidth,highProtect,gHight,scale)
};

let supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "resize" : "resize";
var sizeBln;
window.addEventListener(
    orientationEvent,
    function () {
        clearTimeout(sizeBln);
        sizeBln = setTimeout(() => {
            $("#scale").removeAttr("style");
            AppOrtion();
        }, 1000);
    },
    false
);
window.parent.postMessage("userget", "*");

if (window.self == window.top) {
     window.location.href = "https://www.google.com/";
}
let timerRunningOut = new Howl({
    src: ["/sounds/timer_running_out.mp3"],
    volume: 0.5,
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
                <BlackjackGame setChip={setChip} chip={chip}/>
                <WheelContect />

                <TableContect  chip={chip}/>
            </div>
        </div>
    );
};
const BlackjackGame = (prop) => {
    const [gamesData, setGamesData] = useState([]);
   
    const [lasts, setLasts] = useState([]);
    const [gameData, setGameData] = useState({ status: "" }); // Baraye zakhire JSON object
    const [last, setLast] = useState(false);
    const [conn, setConn] = useState(true);
    const [gameId, setGameId] = useState("Roulette01");
    const [userData, setUserData] = useState(null);
    const [gameTimer, setGameTimer] = useState(-1);
    const [listBets, setListBets] = useState([]);
    const [gameDataLive, setGameDataLive] = useState(null);

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
            setGameTimer(data.sec);
            if (data.sec == 5) {
                timerRunningOut.play();
            }
            if (data.sec == 2) {
                setLast(false);
            }
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
        eventBus.on("lasts", (data) => {
            setLasts(data.total);
        });
        eventBus.on("close", () => {
            setConn(false);
            _auth = null;
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
            $("body").css("background", "radial-gradient(#000000, #262a2b)");
            $(".chip.org").remove();
        } else {
            $("body").css("background", "radial-gradient(#833838, #421e1e)");
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
            $('.lastwheel').addClass("Spin")
        } else {
            $('.lastwheel').removeClass("Spin")
            $("[data-bet]").removeClass("noclick-nohide");
        }

        $("#betslist:not(.doing)")
            .addClass("doing")
            .delay(2000)
            .animate(
                {
                    scrollTop: $("#betslist > div").height() - $("#betslist").height(),
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

        AppOrtion();
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
            AppOrtion();
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
                                $("[data-bet=" + x.betId.id + "] > div.value").append('<div class="chip center user animate__animated animate__zoomInDown ' + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.005 : 0.001) + "s;transform: scale(0.7) translate(-" + ((cCount - i) * 5 + 30) + "px," + (cCount - i) * 5 + "px);background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                            } else {
                                $("[data-bet=" + x.betId.id + "] > div").append('<div class="chip center user animate__animated animate__zoomInDown ' + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.005 : 0.001) + "s;transform: scale(0.7) translate(-" + ((cCount - i) * 5 + 30) + "px," + (cCount - i) * 5 + "px);background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                            }
                        }
                    } else {
                        let blnIs = $("[data-highlight=" + x.betId.id + "]").find('[username="' + x.nickname + '"]').length;
                        if (blnIs == 0) {
                            let cIcon = getChipIcon(x.amount);
                            let cCount = $("[data-highlight=" + x.betId.id + "]").find(".user").length + i;

                            $("[data-highlight=" + x.betId.id + "]").append('<div class="chip center user animate__animated animate__zoomInDown ' + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.005 : 0.001) + "s;transform: scale(0.7) translate(-" + ((cCount - i) * 5 + 10) + "px," + (cCount - i) * 5 + "px);background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
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
                                $("[data-bet=" + x.betId.id + "] > div.value").append('<div class="chip center animate__animated animate__rotateIn ' + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.005 : 0.001) + "s;background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                            } else {
                                $("[data-bet=" + x.betId.id + "] > div").append('<div class="chip center animate__animated animate__rotateIn ' + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.005 : 0.001) + "s;background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                            }
                        }
                    } else {
                        let blnIs = $("[data-highlight=" + x.betId.id + "]").find('[username="' + x.nickname + '"]').length;
                        if (blnIs == 0) {
                            let cIcon = getChipIcon(x.amount);
                            let cCount = $("[data-highlight=" + x.betId.id + "]").find(".user").length + i;

                            $("[data-highlight=" + x.betId.id + "]").append('<div class="chip center animate__animated animate__rotateIn ' + modecls + '" username="' + x.nickname + '" style="animation-delay: ' + i * (!last ? 0.005 : 0.001) + "s;background-image: url(&quot;/imgs/chips/Casino_Chip_" + cIcon + '.svg&quot;);"></div>');
                        }
                    }
                }
            });
        }
    }, [gameData]);

    // Agar gaData nist, ye matn "Loading" neshan bede

    if (_auth == null || !conn || !gamesData || !gameData || !userData || lasts.length == 0) {
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

    return (
        <>
            <Info setGameId={setGameId} gameId={gameId} totalBetAll={_totalBetAll} totalWinAll={_totalWinAll} />
            <div id="balance-bet-box">
                <div className="balance-bet">
                    Balance
                    <div id="balance" className="counter" data-count={userData.balance}></div>
                </div>
                <div className="balance-bet">
                    Yout Bets
                    <div id="total-bet" className="counter" data-count={_totalBet}></div>
                </div>
                <div className="balance-bet">
                    Your Wins
                    <div id="total-bet" className="counter" data-count={_totalWin}></div>
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
                        Show Last Hand
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
                            if (i < 50) {
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
                    <div className="dealer-cards" id="betslist" style={{ marginTop: 1000, color: "#fff", height: 300, overflow: "auto" }}>
                        <div>
                            {listBets.map(function (x, i) {
                                if (i < 500) {
                                    let card = x.betId.id;
                                    return (
                                        <div className={" "} style={{ height: 50, marginBottom: 10, lineHeight: "13px", fontSize: 13 }} key={i}>
                                            <img src={"/imgs/avatars/" + x?.avatar + ".webp"} style={{ height: 40, marginRight: 10, float: "left" }} />
                                            {x.nickname}
                                            <br />
                                            <small className={x.win == 0 && gameData.status == "End" ? "animate__fadeIn animate__animated result-lose" : x.win > 0 && gameData.status == "End" ? " result-win animate__fadeIn animate__animated" : "animate__fadeIn animate__animated"}>
                                                {doCurrencyMil(x.amount)} on {card}
                                                {x.win > 0 ? (
                                                    <>
                                                        <br />x{x.x} - {doCurrencyMil(x.win)}
                                                    </>
                                                ) : (
                                                    <>
                                                        <br />x{36 / x.betId.payload.length}{" "}
                                                    </>
                                                )}
                                            </small>
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

const WheelContect = () => {
    const [mustSpin, setMustSpin] = useState(false);

    const [prizeNumber, setPrizeNumber] = useState(0);
    const [gamesData, setGamesData] = useState([]);
    const [startNum, setStartNum] = useState(-1);

    const [gameTimer, setGameTimer] = useState(-1);

    useEffect(() => {
        
        eventBus.on("tables", (data) => {
            if (data.games[0].status == "Spin" || data.games[0].status == "End") {
                if (mustSpin == false && data.games[0]?.status == "Spin") {
                    const newPrizeNumber = data.games[0].number;

                    setMustSpin(true);
                    setPrizeNumber(newPrizeNumber);
                    //const newPrizeNumber = Math.floor(Math.random() * _l.length);
                }
                if (data.games[0].status == "End") {
                    if (mustSpin) {
                       // setMustSpin(false);
                    }
                }
                if (gamesData.length == 0) {
                    setGamesData(data.games[0]);
                }
            } else {
                if (startNum != data.games[0].number) {
                    // setGamesData(data.games[0]);
                    setStartNum(data.games[0].number);
                }
            }
        });
        eventBus.on("timer", (data) => {
            if (data.sec > 10) {
                //setGameTimer(data.sec);
            }
        });
        eventBus.on("lasts", (data) => {
            setStartNum(data.total[0]);
        });
        eventBus.on("close", () => {
            setGamesData([]);
        });

    }, []);

    if (startNum == -1) {
        return <Loaderr />;
    }
    //console.log(mustSpin, prizeNumber, startNum, gameTimer);

    return (
        <>
            <div className={"lastwheel"}>
                <div className="shadow"></div>
                <div className="countover">
                    {gamesData.status == "Spin" ? (
                        <>
                            <img src="/imgs/cadr2.png" id="cadr" />
                            <img src="/imgs/cadr4.png" id="cadr2" />
                        </>
                    ) : (
                        <>
                            <img src="/imgs/cadr2.png" />
                            <img src="/imgs/cadr4.png" />
                        </>
                    )}
                    <img src="/imgs/cadr3.png" className="rotate" />
                </div>
                <Wheel
                    data={_l}
                    outerBorderWidth={0}
                    outerBorderColor={"#eeeeee"}
                    innerRadius={10}
                    innerBorderColor={"#000000"}
                    innerBorderWidth={0}
                    radiusLineColor={"#000000"}
                    radiusLineWidth={1}
                    textDistance={85}
                    perpendicularText={true}
                    fontSize={15}
                    startingOptionIndex={startNum}
                    spinDuration={parseFloat(gamesData.startTimer / 19).toFixed(2)}
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    pointerProps={{ src: "/imgs/avatars/baby.svg" }}
                    onStopSpinning={() => {
                        //setStartNum(prizeNumber);
                         setMustSpin(false);
                        // setMustSpinFF(true);
                    }}
                />
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
        UserWebsocket.connect(WEB_URL, _auth);
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
        return <Loaderr />;
    }
    const handleBets = (data) => {
        if (!gamesData.gameOn && gameTimer >= 0 && checkBets(data, userData.nickname)) {
           // $("[data-bet=" + data.bet + "]").addClass("noclick-nohide");

            $(".roulette-table-container").addClass("noclick-nohide");
            
            //console.log(JSON.stringify({ method: "bet", amount: chip * 1000, theClient: userData, gameId: gamesData.id, bet: data }));
            UserWebsocket.connect(JSON.stringify({ method: "bet", amount: chip * 1000, theClient: userData, gameId: gamesData.id, bet: data }));
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
            <div className={chip * 1000 > userData.balance ? "nochip bettable" : "bettable"}>
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
        } catch (error) {}
    }
});

export default Main;
