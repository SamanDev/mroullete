import { Button, Icon } from "semantic-ui-react";

const ModalExampleScrollingContent = (prop) => {
    return (
        <span id="leave-button">
            <Button basic inverted color="grey" size="mini" style={{ position: "relative", marginBottom: 10, textAlign: "left" }} icon labelPosition="left">
                <Icon name="arrow circle down" />
                Last 20
            </Button>
            <div id="balance-bet-box" style={{ top: 200, right: -33 }}>
                <div className="balance-bet">
                    Total Bet
                    <div id="total-bet" className="counter" data-count={prop.totalBetAll}></div>
                </div>
                <div className="balance-bet">
                    Total Win
                    <div id="total-bet" className="counter" data-count={prop.totalWinAll}></div>
                </div>
            </div>
        </span>
    );
};

export default ModalExampleScrollingContent;
