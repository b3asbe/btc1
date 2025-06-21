import { Operation, Cryptocurrency, ParsedOperationData } from '../types';

export const parseOperationData = (rawData: string): ParsedOperationData | null => {
  try {
    const lines = rawData.trim().split('\n').map(line => line.trim());
    
    let date = '';
    let tradingPrice = 0;
    let executed = 0;
    let transactionFee = '';
    let total = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line === 'Date' && i + 1 < lines.length) {
        date = lines[i + 1];
      } else if (line === 'Trading Price' && i + 1 < lines.length) {
        tradingPrice = parseFloat(lines[i + 1]);
      } else if (line === 'Executed' && i + 1 < lines.length) {
        executed = parseFloat(lines[i + 1]);
      } else if (line === 'Transaction Fee' && i + 1 < lines.length) {
        transactionFee = lines[i + 1];
      } else if (line === 'Total' && i + 1 < lines.length) {
        const totalLine = lines[i + 1];
        const totalMatch = totalLine.match(/(\d+\.?\d*)/);
        if (totalMatch) {
          total = parseFloat(totalMatch[1]);
        }
      }
    }

    if (date && tradingPrice && executed && transactionFee && total) {
      return { date, tradingPrice, executed, transactionFee, total };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

export const calculateProfitLoss = (openOperation: Operation, closeOperation: ParsedOperationData): number => {
  if (openOperation.type === 'buy') {
    // For buy operations, profit = closing total - opening total
    return closeOperation.total - openOperation.total;
  } else {
    // For sell operations, profit = opening total - closing total
    return openOperation.total - closeOperation.total;
  }
};

export const calculatePredictionRanges = (
  tradingPrice: number, 
  crypto: Cryptocurrency
): { buyRanges: number[], sellRanges: number[] } => {
  const buyRanges = [];
  const sellRanges = [];

  // Calculate 5 buy ranges (below current price)
  for (let i = 1; i <= 5; i++) {
    const adjustment = crypto.buyAdjustment * i;
    buyRanges.push(tradingPrice - adjustment);
  }

  // Calculate 5 sell ranges (above current price)
  for (let i = 1; i <= 5; i++) {
    const adjustment = crypto.sellAdjustment * i;
    sellRanges.push(tradingPrice + adjustment);
  }

  return { buyRanges, sellRanges };
};

export const extractTransactionFee = (feeString: string): { amount: number, currency: string } => {
  const match = feeString.match(/(\d+\.?\d*)\s*([A-Z]+)/);
  if (match) {
    return {
      amount: parseFloat(match[1]),
      currency: match[2]
    };
  }
  return { amount: 0, currency: '' };
};