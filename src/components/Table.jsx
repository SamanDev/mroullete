import { RouletteTable } from "react-casino-roulette";

import "react-casino-roulette/dist/index.css";

const TableBet = (prop) => {
    const handleBets = prop.handleBets
    const handleBet = (betData) => {
        const { id } = betData;
        handleBets(betData);
    };

    return (
        <div>
            <RouletteTable bets={{}} onBet={handleBet} />
        </div>
    );
};
export default TableBet;
