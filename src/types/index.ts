export interface Cryptocurrency {
  id: string;
  acronym: string;
  buyAdjustment: number;
  sellAdjustment: number;
}

export interface Operation {
  id: string;
  date: string;
  tradingPrice: number;
  executed: number;
  transactionFee: string;
  total: number;
  type: 'buy' | 'sell';
  crypto: string;
  targetPrice?: number;
  status: 'pending' | 'completed';
  rawData: string;
  closingOperation?: {
    date: string;
    tradingPrice: number;
    executed: number;
    transactionFee: string;
    total: number;
    rawData: string;
  };
  profitLoss?: number;
}

export interface ParsedOperationData {
  date: string;
  tradingPrice: number;
  executed: number;
  transactionFee: string;
  total: number;
}