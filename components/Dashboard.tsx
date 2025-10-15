import React from 'react';
import { 
    CalculatorIcon, PiggyBankIcon, UserGroupIcon, 
    BuildingOfficeIcon, RefreshIcon, WalletIcon, DebtPayoffIcon,
    ChartBarIcon, KeyIcon, BanknotesIcon, HouseDollarIcon, ClockDollarIcon, MegaphoneIcon
} from './Icons';
import { CalculatorView } from '../types';

interface DashboardProps {
  onNavigate: (view: CalculatorView) => void;
}

const calculators = [
  // Tier 1: Core Personal Finance
  { id: CalculatorView.EXPENSE_TRACKER, name: 'Controle de Gastos', description: 'Monitore suas receitas e despesas mensais.', Icon: WalletIcon },
  { id: CalculatorView.BUDGET_PLANNER, name: 'Planejador de Orçamento', description: 'Defina orçamentos por categoria e controle seus gastos.', Icon: PiggyBankIcon },
  { id: CalculatorView.INTEREST, name: 'Juros Simples e Compostos', description: 'Calcule e compare a evolução do seu dinheiro.', Icon: CalculatorIcon },
  { id: CalculatorView.INVESTMENT, name: 'Simulador de Investimentos', description: 'Projete o crescimento dos seus investimentos com aportes.', Icon: CalculatorIcon },
  { id: CalculatorView.LOAN, name: 'Financiamentos (Price & SAC)', description: 'Simule seu financiamento e veja a tabela de amortização.', Icon: CalculatorIcon },
  { id: CalculatorView.RETIREMENT, name: 'Calculadora de Aposentadoria', description: 'Planeje seu futuro e veja quanto precisará acumular.', Icon: CalculatorIcon },
  { id: CalculatorView.DEBT_PAYOFF, name: 'Quitação de Dívidas', description: 'Crie um plano para pagar suas dívidas mais rápido.', Icon: DebtPayoffIcon },
  
  // Tier 2: Very Useful (Common needs and decisions)
  { id: CalculatorView.CURRENCY, name: 'Conversor de Moedas', description: 'Converta valores entre diversas moedas do mundo.', Icon: CalculatorIcon },
  { id: CalculatorView.NET_SALARY, name: 'Salário Líquido', description: 'Calcule seu salário líquido a partir do bruto com descontos.', Icon: CalculatorIcon },
  { id: CalculatorView.EMERGENCY_FUND, name: 'Fundo de Emergência', description: 'Calcule o valor ideal para sua reserva de segurança.', Icon: CalculatorIcon },
  { id: CalculatorView.SAVINGS_GOAL, name: 'Planejador de Metas', description: 'Descubra quanto precisa economizar para atingir seus objetivos.', Icon: CalculatorIcon },
  { id: CalculatorView.CREDIT_CARD, name: 'Comparador de Cartões', description: 'Encontre o melhor cartão de crédito para seu perfil de gastos.', Icon: CalculatorIcon },
  { id: CalculatorView.LEASE_VS_BUY, name: 'Alugar vs Comprar Imóvel', description: 'Analise financeiramente qual opção é melhor para você.', Icon: KeyIcon },
  
  // Tier 3: Useful for Investors & Business (More specific)
  { id: CalculatorView.RENTAL_PROPERTY, name: 'Análise de Imóvel p/ Aluguel', description: 'Calcule o fluxo de caixa e o retorno de um imóvel.', Icon: HouseDollarIcon },
  { id: CalculatorView.STOCK_AVERAGE, name: 'Preço Médio de Ações', description: 'Calcule o preço médio de suas ações após várias compras.', Icon: ChartBarIcon },
  { id: CalculatorView.ROI, name: 'Calculadora de ROI', description: 'Meça o retorno sobre um investimento específico.', Icon: CalculatorIcon },
  { id: CalculatorView.ROAS_CALCULATOR, name: 'Calculadora de ROAS', description: 'Mensure o Retorno Sobre o Gasto com Anúncios.', Icon: MegaphoneIcon },
  { id: CalculatorView.CAGR, name: 'Calculadora CAGR', description: 'Calcule a taxa de crescimento anual composta de um investimento.', Icon: CalculatorIcon },
  { id: CalculatorView.TVM_SOLVER, name: 'Calculadora TVM', description: 'Solucionador financeiro para o Valor do Dinheiro no Tempo.', Icon: ClockDollarIcon },
  { id: CalculatorView.INFLATION, name: 'Calculadora de Inflação', description: 'Veja o poder de compra do dinheiro ao longo do tempo.', Icon: CalculatorIcon },
  { id: CalculatorView.PRESENT_VALUE, name: 'Valor Presente (PV)', description: 'Calcule o valor hoje de um montante futuro.', Icon: CalculatorIcon },
  { id: CalculatorView.RETIREMENT_WITHDRAWAL, name: 'Saque na Aposentadoria', description: 'Calcule retiradas seguras do seu patrimônio aposentado.', Icon: BanknotesIcon },
  { id: CalculatorView.BREAK_EVEN, name: 'Ponto de Equilíbrio', description: 'Descubra o necessário para cobrir os custos do seu negócio.', Icon: CalculatorIcon },
  { id: CalculatorView.PROFIT_MARGIN, name: 'Margem de Lucro', description: 'Analise a rentabilidade do seu negócio ou produto.', Icon: CalculatorIcon },
  { id: CalculatorView.CLV_CALCULATOR, name: 'Calculadora CLV', description: 'Calcule o Valor Vitalício do Cliente para o seu negócio.', Icon: UserGroupIcon },
  
  // Tier 4: Niche or Convenience Tools
  { id: CalculatorView.RULE_OF_72, name: 'Regra dos 72', description: 'Estime em quanto tempo seu investimento irá dobrar.', Icon: CalculatorIcon },
  { id: CalculatorView.LOAN_COMPARISON, name: 'Comparador de Empréstimos', description: 'Compare duas opções de empréstimo e veja a mais vantajosa.', Icon: CalculatorIcon },
  { id: CalculatorView.MORTGAGE_REFINANCE_CALCULATOR, name: 'Refinanciar Hipoteca', description: 'Analise se vale a pena refinanciar seu imóvel.', Icon: RefreshIcon },
  { id: CalculatorView.COST_OF_LIVING_COMPARATOR, name: 'Comparador de Custo de Vida', description: 'Compare o custo de vida entre cidades e seu salário.', Icon: BuildingOfficeIcon },
  { id: CalculatorView.TIP, name: 'Calculadora de Gorjeta', description: 'Calcule gorjetas e divida a conta facilmente.', Icon: CalculatorIcon },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-navy dark:text-gray-100 mb-2">Painel de Calculadoras</h1>
      <p className="text-slate dark:text-slate-light mb-8">Sua suíte completa de ferramentas para decisões financeiras inteligentes.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            onClick={() => onNavigate(calc.id as CalculatorView)}
            className="group bg-white dark:bg-navy-light p-6 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-green-accent/10 transition-all duration-300 text-left transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-green-accent/10 p-2 rounded-md">
                <calc.Icon className="w-6 h-6 text-green-accent" />
              </div>
              <h2 className="text-lg font-bold text-navy dark:text-gray-100">{calc.name}</h2>
            </div>
            <p className="text-sm text-slate dark:text-slate-light">{calc.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;