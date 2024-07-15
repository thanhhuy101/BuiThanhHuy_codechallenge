/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import "./App.css";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props {
  className?: string;
}

const App: React.FC<Props> = (props: Props) => {
  const { className } = props;
  const balances: WalletBalance[] = [
    { currency: "BTC", amount: 1.5, blockchain: "Bitcoin" },
    { currency: "ETH", amount: 10.2, blockchain: "Ethereum" },
    { currency: "ADA", amount: 500, blockchain: "Cardano" },
    { currency: "SOL", amount: 25.75, blockchain: "Solana" },
    { currency: "DOT", amount: 100, blockchain: "Polkadot" },
  ];
  const prices: Record<string, number> = {
    BTC: 50000,
    ETH: 2000,
    ADA: 1.2,
    SOL: 30,
    DOT: 25,
  };

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Bitcoin":
        return 100;
      case "Ethereum":
        return 50;
      case "Cardano":
        return 30;
      case "Solana":
        return 20;
      case "Polkadot":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      })
      .map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(2),
      }));
  }, [balances]);

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <div key={index} className="wallet-card">
          <p>Currency: {balance.currency}</p>
          <p>Amount: {balance.amount}</p>
          <p>Formatted: {balance.formatted}</p>
          <p>USD Value: {usdValue.toFixed(2)}</p>
        </div>
      );
    }
  );

  return <div className={`wallet-container ${className}`}>{rows}</div>;
};

export default App;
