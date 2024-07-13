import React, { useMemo } from 'react';

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
  const balances: WalletBalance[] = []; // Placeholder for useWalletBalances()
  const prices: Record<string, number> = {}; // Placeholder for usePrices()

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
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
        formatted: balance.amount.toFixed()
      }));
  }, [balances]);

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <div key={index}>
        <p>Currency: {balance.currency}</p>
        <p>Amount: {balance.amount}</p>
        <p>Formatted: {balance.formatted}</p>
        <p>USD Value: {usdValue}</p>
      </div>
    );
  });

  return <div className={className}>{rows}</div>;
};

export default App;
