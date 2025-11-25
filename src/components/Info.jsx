import { Button, Icon } from "semantic-ui-react";

const ModalExampleScrollingContent = (prop) => {
    return (
        <span id="leave-button">
           
            <div id="balance-bet-box" style={{ top: 95, right: -33 }}>
                <div className="balance-bet">
                    Total Bets
                    <div id="total-bet" className="counter" data-count={prop.totalBetAll}>0</div>
                </div>
                <div className="balance-bet">
                    Total Wins
                    <div id="total-bet" className="counter" data-count={prop.totalWinAll}>0</div>
                </div>
            </div>
        </span>
    );
};

export default ModalExampleScrollingContent;
