import { RouletteTable } from "react-casino-roulette";

import "react-casino-roulette/dist/index.css";

const TableBet = (prop) => {
    const handleBets = prop.handleBets
    const handleBet = (betData) => {
        const { id } = betData;
        handleBets(betData);
    };

    return (
        <div style={{ maxWidth: 850, margin: "auto",background: ' rgba(255, 255, 255, 0.1)',  boxShadow: '0px 0px 100px 20px rgba(0, 0, 0, 0.75)'
        }}>
            <RouletteTable bets={prop?.bets ? prop.bets : []} onBet={handleBet} />
        </div>
    );
};
export default TableBet;
