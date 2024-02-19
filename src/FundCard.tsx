import React from "react";
import { Fund } from "./Fund";

interface FundCardProps {
  fund: Fund;
}

const FundCard: React.FC<FundCardProps> = ({ fund }) => {
    return (
        <div className="fund-card">
            <p>Purpose: {fund.purpose}</p>
            <p>Target Amount: {fund.targetAmount}</p>
            <p>Amount Raised: {fund.amountRaised}</p>
        </div>
    );
};

export default FundCard;
