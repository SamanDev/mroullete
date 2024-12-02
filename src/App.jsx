import React, { useState, useEffect } from "react";

import { Howl } from "howler";
import { Icon, Popup } from "semantic-ui-react";
import $ from "jquery";
import Info from "./components/Info";
import TableBet from "./components/Table";

import Wheel from "./components/Wheel";
import Loaderr from "./components/Loader";

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
const betAreas = [{ x: 2 }, { x: 4 }, { x: 8 }, { x: 10 }, { x: 20 }, { x: 25 }];
const segments = ["0", 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, "00", 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
const REDSeg = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACKSeg = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
const allBets = {
    "ODD": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
    "EVEN": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
    "1_TO_18": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    "19_TO_36": [
      19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36
    ],
    "RED": [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
    "BLACK": [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
    "1ST_COLUMN": [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    "2ND_COLUMN": [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    "3RD_COLUMN": [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    "1ST_DOZEN": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    "2ND_DOZEN": [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    "3RD_DOZEN": [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
  }
  
var _l = [];
const getcolor = (item) => {
    var def = "green";

    if (REDSeg.includes(item)) {
        def = "red";
    }
    if (BLACKSeg.includes(item)) {
        def = "black";
    }

    return def;
};
const getcolortext = (item) => {
    var def = "#ffffff";

    return def;
};
const doCurrency = (value) => {
    var val = value?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return val;
};
const getChipIcon = (value) => {
    var chipsarr = ["Brown", "Purple", "Orange", "Red", "Blue", "Black"];
    var _idc = 0;
    _renge.map(function (bet, i) {
        if (bet == value / 1000) {
            _idc = i;
        }
    });

    return chipsarr[_idc];
};
const doCurrencyMil = (value, fix) => {
    if (value < 1000000) {
        var val = doCurrency(parseFloat(value / 1000).toFixed(fix || fix == 0 ? fix : 0)) + "K";
    } else {
        var val = doCurrency(parseFloat(value / 1000000).toFixed(fix || fix == 0 ? fix : 1)) + "M";
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
}, 2500);
function animateNum() {
    $(".counter").each(function () {
        var $this = $(this),
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
                    duration: 400,
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
    var gWidth = $("#root").width() / 1400;
    var gHight = $("#root").height() / 850;
    var scale = gWidth < gHight ? gWidth : gHight;
    var highProtect = $("#root").height() * scale;
    //console.log($("#root").width(),$("#root").height());
    // console.log(gWidth,gHight,scale);

    if (highProtect > 850) {
        //console.log(gWidth,gHight,highProtect);
        //gHight = $("#root").height() / 850;
        // scale = (scale + gHight)/2;
        scale = gHight;
        highProtect = $("#root").height() * scale;
        var _t = ($("#root").height() - highProtect) / 2;
        if (_t < 0) {
            _t = _t * -1;
        }

        if (scale < 1) {
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ")");
            }, 10);
        } else {
            scale = 1;
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ") translateY(" + _t + "px)");
            }, 10);
        }
    } else {
        // gHight = $("#root").height() / 850;
        // scale = (scale + gHight)/2;
        //  scale = gHight;
        var _t = ($("#root").height() - highProtect) / 2;
        if (_t < 0) {
            _t = _t * -1;
        }
        if (scale < 1) {
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ") translateY(" + _t + "px)");
            }, 10);
        } else {
            scale = 1;
            setTimeout(() => {
                $("#scale").css("transform", "scale(" + scale + ") translateY(" + _t + "px)");
            }, 10);
        }
    }

    // console.log(gWidth,highProtect,gHight,scale)
};
const socket = new WebSocket(WEB_URL, _auth);
window.addEventListener("message", function (event) {
    if (event?.data?.username) {
        const payLoad = {
            method: "syncBalance",

            balance: event?.data?.balance,
        };
        try {
            socket.send(JSON.stringify(payLoad));
        } catch (error) {}
    }
});
var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

window.addEventListener(
    orientationEvent,
    function () {
        AppOrtion();
    },
    false
);
window.parent.postMessage("userget", "*");

if (window.self == window.top) {
    window.location.href = "https://www.google.com/";
}
let dealingSound = new Howl({
    src: ["/sounds/dealing_card_fix3.mp3"],
    volume: 0.5,
});
let chipHover = new Howl({
    src: ["/sounds/chip_hover_fix.mp3"],
    volume: 0.1,
});
let chipPlace = new Howl({
    src: ["/sounds/chip_place.mp3"],
    volume: 0.1,
});
let actionClick = new Howl({
    src: ["/sounds/actionClick.mp3"],
    volume: 0.1,
});
let defaultClick = new Howl({
    src: ["/sounds/click_default.mp3"],
    volume: 0.1,
});
let clickFiller = new Howl({
    src: ["/sounds/click_filler.mp3"],
    volume: 0.1,
});
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



const BlackjackGame = () => {
  
    const [gamesData, setGamesData] = useState([]);
    const [chip, setChip] = useState(50);
    const [lasts, setLasts] = useState([]);
    const [gameData, setGameData] = useState({"status":""}); // Baraye zakhire JSON object
    const [userData, setUserData] = useState(null);
    const [last, setLast] = useState(false);
    const [conn, setConn] = useState(true);
    const [gameId, setGameId] = useState("Roulette01");
    const [gameTimer, setGameTimer] = useState(-1);
    const [listBets, setListBets] = useState([]);
    const [gameDataLive, setGameDataLive] = useState(null);
    const checkBets = (seat, username) => {
        let check = true;
        let userbet = gameData.players.filter((bet) => bet.betId.bet == seat.bet &&bet.betId.id == seat.id && bet.nickname == username);
        if (userbet.length) {
            check = false;
        }

        return check;
    };
    const getTotalBets = (seat) => {
        var userbet = gameData.players.filter((bet) => bet.seat == seat);
        var Total = 0;
        userbet.map(function (bet, i) {
            Total = Total + bet.amount;
        });
        return doCurrencyMil(Total);
    };
    const getBets = (seat, username) => {
        var userbet = gameData.players.filter((bet) => bet.seat == seat && bet.nickname == username);

        return userbet[0];
    };
    const getAllBets = (seat, username) => {
        var userbet = gameData.players.filter((bet) => bet.seat == seat && bet.nickname != username);

        return userbet;
    };
    const doplayers = (betsP) => {
        let net = [];
        betsP.filter((bet) => bet.nickname == userData.nickname).map(function (betpp, i) {
            let cIcon = getChipIcon(betpp.amount);
            net[betpp?.betId.id] = { number: betpp.amount, icon: "/imgs/chips/Casino_Chip_" + cIcon + ".svg" };
        });
        return net;
    };
    const getPercent = (seat) => {
        var userbet = lasts.filter((x) => segments[x] == seat.x).length;

        return parseFloat((userbet / lasts.length) * 100).toFixed(0);
    };
    useEffect(() => {
        // Event onopen baraye vaghti ke websocket baz shode

        socket.onopen = () => {
            console.log("WebSocket connected");
            setTimeout(() => {
               //a socket.send(JSON.stringify({ method: "join", gameId: gameId }));
            }, 2000);
        };

        // Event onmessage baraye daryaft data az server
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse kardan JSON daryafti
            //console.log("Game data received: ", data);
            if (data.method == "tables") {
                setGamesData(data.games);
               
                if (data.last) {
                    setTimeout(() => {
                        let _data = data.games[0];
                        localStorage.setItem(data.gameId, JSON.stringify(_data));
                    }, 3000);
                    setGameTimer(15);
                }
                // Update kardan state
            }
            if (data.method == "connect") {
                if (data.theClient?.balance >= 0) {
                    setUserData(data.theClient);
                } else {
                    setUserData(data.theClient);
                    // setConn(false);
                    //_auth = null;
                }
                // Update kardan state
            }
            if (data.method == "timer") {
                setGameTimer(data.sec);
                if (data.sec == 5) {
                    timerRunningOut.play();
                }
                // Update kardan state
            }

            if (data.method == "lasts") {
                setLasts(data.total);
            }
        };

        // Event onclose baraye vaghti ke websocket baste mishe
        socket.onclose = () => {
            console.log("WebSocket closed");
            setConn(false);
            _auth = null;
        };

        // Cleanup websocket dar zamane unmount kardan component
        return () => {
            // socket.close();
        };
    }, []);

    useEffect(() => {
        if (gamesData.length) {
            const _data = gamesData.filter((game) => game?.id === gameId)[0];
            //console.log(_data);
            if (_data.players.length == 0) {
                
                setGameTimer(15);
               
            }


            setGameDataLive(_data)
            //setGameData(_data);
           
        }
        setTimeout(() => {
            animateNum();
            AppOrtion();
        }, 100);
       
    }, [gamesData]);
    useEffect(() => {
        // console.log("gameId",gameId)
        if (last) {
            $("body").css("background", "radial-gradient(#000000, #262a2b)");
        } else {
            $("body").css("background", "radial-gradient(#833838, #421e1e)");
        }
    }, [last]);
     useEffect(() => {
      
             if(gameData?.status=='End'){
                 for (const [key, value] of Object.entries(allBets)) {
                             
                             
                     if(value.includes(''+segments[gameData.number]+'')|| value.includes(segments[gameData.number])){
                         $('[data-bet='+key+']').addClass('item-selected')
                     }
                
                   }
               
                 $('[data-bet='+segments[gameData?.number]+']').addClass('item-selected-num');
                 $('[data-bet="'+segments[gameData?.number]+'"]').addClass('item-selected-num');
                 $('[data-bet]').removeClass('noclick-nohide')
                 setTimeout(() => {
                    $('#betslist').stop().animate({scrollTop:500}, (gameData?.players?.length>0?gameData?.players?.length:1)*500, 'swing', function() { 
                        $('#betslist').stop().animate({scrollTop:0}, (gameData?.players?.length>0?gameData?.players?.length:1)*500, 'swing', function() { 
                            
                         });
                     });
                }, 2000);
                 
             }else{
                 $('.item-selected-num').removeClass('item-selected-num')
 
                 $('.item-selected').removeClass('item-selected')
             
             }
             if(gameData?.status=='Spin'){
                setLast(false)
             }
        
     
         // AppOrtion();
     }, [gameData?.status]);
     useEffect(() => {
        if (last && gameDataLive?.status!='Spin') {
            setGameData(JSON.parse(localStorage.getItem(gameId)));
            
        } else {
            setGameData(gameDataLive);
           
            
        }
        setTimeout(() => {
            animateNum();
            AppOrtion();
        }, 100);
        
    }, [last, gameDataLive]);
    useEffect(() => {
        
            if(gameData?.players){
                if(gameData?.status=='End'){
                    setListBets(gameData?.players.sort((a, b) => (a.win > b.win ? -1 : 1)))
                }else{
                    setListBets(gameData?.players.sort((a, b) => (a.amount > b.amount ? -1 : 1)))
                }
            }
        
        
    }, [gameData]);
    useEffect(() => {
        setTimeout(() => {
            AppOrtion();
        }, 500);
    }, []);
    // Agar gaData nist, ye matn "Loading" neshan bede
    const handleBets = (data) => {
        if(!gameData.gameOn && gameTimer >= 0 && checkBets(data, userData.nickname)){
            $('[data-bet='+data.bet+']').addClass('noclick-nohide')
        socket.send(JSON.stringify({ method: "bet", amount: chip * 1000, theClient: userData, gameId: gameData.id, bet: data }));
        }
    };

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
        <div>
            <div className="game-room" id="scale">
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
                    {localStorage.getItem(gameId) && gameDataLive.status!="Spin" && (
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
                                    <span key={i} className={chip == bet ? "curchip" : ""}>
                                        <button
                                            className="betButtons  animate__faster animate__animated animate__zoomInUp"
                                            style={{ animationDelay: i * 100 + "ms" }}
                                            id={"chip" + i}
                                            value={bet * 1000}
                                            onClick={() => {
                                                setChip(bet);
                                            }}
                                        >
                                            {doCurrencyMil(bet * 1000)}
                                        </button>
                                    </span>
                                );
                            } else {
                                return (
                                    <span key={i} className={chip == bet ? "curchip" : ""}>
                                        <button className="betButtons noclick noclick-nohide animate__animated animate__zoomInUp" style={{ animationDelay: i * 100 + "ms" }} id={"chip" + i} value={bet * 1000}>
                                            {doCurrencyMil(bet * 1000)}
                                        </button>
                                    </span>
                                );
                            }
                        })}
                    </div>
                </div>
                <div id="volume-button">
                    <i className="fas fa-volume-up"></i>
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
                                    var card = segments[x];
                                    return (
                                        <div className="visibleCards animate__flipInY animate__animated" key={i} style={{ animationDelay: (i + 1) * 90 + "ms", background: getcolor(card), color: getcolortext(card) }}>
                                            {card}
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                     {gameData.players.length > 0 && (
                        <div className="dealer-cards" id="betslist" style={{marginTop:1000,color:"#fff",height:300,overflow:'auto'}}>
                            {listBets.map(function (x, i) {
                                if (i < 500) {
                                    let card = x.betId.id;
                                    return (
                                        <div className={"animate__fadeIn animate__animated"} style={{ height: 50, marginBottom:10,lineHeight:'13px',fontSize:13 }}  key={i} >
                                            <img src={"/imgs/avatars/" + x?.avatar + ".webp"} style={{ height: 40, marginRight: 10, float: "left" }} />
                                                            {x.nickname}
                                                            <br />
                                                            <small className={x.win==0 && gameData.status=="End"?"animate__fadeIn animate__animated result-lose":x.win>0 && gameData.status=="End"?" result-win animate__fadeIn animate__animated":"animate__fadeIn animate__animated"}>{doCurrencyMil(x.amount)} on {card}{x.win > 0? <><br />x{x.x} - {doCurrencyMil(x.win)}</>:<><br />x{36/x.betId.payload.length} </>}</small>
                                                            
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
                <Wheel number={gameDataLive.number} status={gameDataLive.status} last={lasts[0]} gameTimer={gameTimer} time={gameDataLive.startTimer} />
                
                <div  className={(gameTimer < 2) || chip * 1000 > userData.balance ? "nochip bettable" : "bettable"} >
                <TableBet handleBets={handleBets} bets={doplayers(gameData.players)} />
                </div>
                
            </div>
        </div>
    );
};

export default BlackjackGame;
