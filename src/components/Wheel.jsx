import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
const segments = ["0", 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, "00", 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
const REDSeg = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACKSeg = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
let _l = [];
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
segments.map((item, i) => {
    _l.push({
        option: item,
        style: {
            backgroundColor: getcolor(item),
            textColor: getcolortext(item),
        },
    });
});
const WheelContect = (prop) => {
    const [mustSpin, setMustSpin] = useState(false);

    const [mustSpinFF, setMustSpinFF] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [timer, setTimer] = useState(prop.time);

    useEffect(() => {
        if (!mustSpin && prop.status == "Spin") {
            const newPrizeNumber = prop.number;
            setMustSpinFF(true);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);

            //const newPrizeNumber = Math.floor(Math.random() * _l.length);
        
        }
        if (mustSpin && prop.status == "End") {
            setMustSpin(false);
        
        }
        
    }, [prop.status]);
    useEffect(() => {
        setTimer(prop.time);
        
    }, [prop.time]);

    return (
        <div className={prop.status == "Spin" && prop.gameTimer < 3 ? "lastwheel Spin" : "lastwheel " + prop.status}>
            <div className="shadow"></div>
            <div className="countover">
                {prop.status == "Spin" ? (
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
                spinDuration={parseFloat(((1 * timer) / 15)).toFixed(2)}
                startingOptionIndex={!mustSpinFF && !mustSpin ? prop.last : -1}
                disableInitialAnimation={false}
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                pointerProps={{ src: "/imgs/avatars/baby.svg" }}
                onStopSpinning={() => {
                    //setMustSpin(false);
                }}
            />
        </div>
    );
};
export default WheelContect;
