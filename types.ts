export interface InterestDataPoint {
  period: number;
  simpleInterest: number;
  compoundInterest: number;
  totalSimple: number;
  totalCompound: number;
}

export enum LoanSystem {
  PRICE = 'PRICE',
  SAC = 'SAC',
}

export interface AmortizationEntry {
  installment: number;
  payment: number;
  interest: number;
  amortization: number;
  balance: number;
}

export interface InvestmentDataPoint {
  period: number;
  totalInvested: number;
  totalValue: number;
}

export interface CreditCard {
  id: number;
  name: string;
  issuer: string;
  brand: string;
  annuity: number;
  imageUrl: string;
  cashback?: number;
  milesPerDollar?: number;
  benefits: string[];
  minIncome: number;
  totalAdvantage?: number; // Added for calculation result
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Debt {
    id: string;
    name: string;
    balance: number;
    rate: number; // annual percentage rate
    minPayment: number;
}

export interface StockPurchase {
    id: string;
    shares: number;
    price: number;
}

export interface BudgetCategory {
    id: string;
    name: string;
    budgeted: number;
    spent: number;
}

export enum CalculatorView {
  DASHBOARD = 'dashboard',
  INTEREST = 'interest',
  LOAN = 'loan',
  INVESTMENT = 'investment',
  CURRENCY = 'currency',
  INFLATION = 'inflation',
  SAVINGS_GOAL = 'savingsGoal',
  CAGR = 'cagr',
  RULE_OF_72 = 'ruleOf72',
  RETIREMENT = 'retirement',
  EMERGENCY_FUND = 'emergencyFund',
  ROI = 'roi',
  NET_SALARY = 'netSalary',
  BREAK_EVEN = 'breakEven',
  LOAN_COMPARISON = 'loanComparison',
  PRESENT_VALUE = 'presentValue',
  PROFIT_MARGIN = 'profitMargin',
  TIP = 'tip',
  CREDIT_CARD = 'creditCard',
  EXPENSE_TRACKER = 'expenseTracker',
  DEBT_PAYOFF = 'debtPayoff',
  STOCK_AVERAGE = 'stockAverage',
  LEASE_VS_BUY = 'leaseVsBuy',
  RETIREMENT_WITHDRAWAL = 'retirementWithdrawal',
  BUDGET_PLANNER = 'budgetPlanner',
  CLV_CALCULATOR = 'clvCalculator',
  COST_OF_LIVING_COMPARATOR = 'costOfLivingComparator',
  MORTGAGE_REFINANCE_CALCULATOR = 'mortgageRefinanceCalculator',
  RENTAL_PROPERTY = 'rentalProperty',
  TVM_SOLVER = 'tvmSolver',
  ROAS_CALCULATOR = 'roasCalculator',
}