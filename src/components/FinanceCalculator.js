import React, { useState, useEffect } from 'react';
import './FinanceCalculator.css';
import { useTranslation } from 'react-i18next';

function FinanceCalculator() {
  const { t } = useTranslation(); // Initialize the translation hook
  const [carPrice, setCarPrice] = useState(20000);
  const [financeTerm, setFinanceTerm] = useState(60); // Finance term in months
  const [interestRate, setInterestRate] = useState(5.0); // Annual interest rate in %
  const [downPayment, setDownPayment] = useState(0); // Down payment
  const [financePayment, setFinancePayment] = useState(0);
  const [paymentSchedule, setPaymentSchedule] = useState([]);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const taxRate = 13.0; // Tax rate in %

  useEffect(() => {
    const calculateFinancePayment = () => {
      const loanAmount = carPrice - downPayment;
      const monthlyInterestRate = (interestRate / 100) / 12;
      const adjustedInterestRate = 1 + monthlyInterestRate;
      const financePayment = (monthlyInterestRate * loanAmount) / (1 - Math.pow(adjustedInterestRate, -financeTerm));
      setFinancePayment(financePayment);

      const generatePaymentSchedule = () => {
        return Array.from({ length: financeTerm }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() + i + 1);
          const paymentWithTax = financePayment + (financePayment * taxRate) / 100;
          return {
            date: date.toLocaleDateString(),
            payment: paymentWithTax.toFixed(2),
          };
        });
      };

      const schedule = generatePaymentSchedule();
      setPaymentSchedule(schedule);
    };

    calculateFinancePayment();
  }, [carPrice, financeTerm, interestRate, downPayment]);

  const toggleShowAllPayments = () => {
    setShowAllPayments(!showAllPayments);
  };

  return (
    <div className="container">
      <h1>{t('carFinanceCalculator.title')}</h1>
      <label>
        {t('carFinanceCalculator.carPrice')}:
        <input
          type="text"
          value={carPrice}
          onChange={(e) => setCarPrice(Number(e.target.value))}
        />
      </label>
      <label>
        {t('carFinanceCalculator.financeTerm')}:
        <input
          type="text"
          value={financeTerm}
          onChange={(e) => setFinanceTerm(Number(e.target.value))}
        />
      </label>
      <label>
        {t('carFinanceCalculator.interestRate')}:
        <input
          type="text"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
        />
      </label>
      <label>
        {t('carFinanceCalculator.downPayment')}:
        <input
          type="text"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
        />
      </label>
      <div className="payment-schedule">
        <h2>
          {t('carFinanceCalculator.monthlyFinancePayment')}: {(financePayment + (financePayment * taxRate) / 100).toFixed(2)}
          &nbsp;({t('carFinanceCalculator.includedTax')}: {(financePayment * taxRate / 100).toFixed(2)})
        </h2>
        <h2>{t('carFinanceCalculator.paymentSchedule')}:</h2>
        <ul>
          {paymentSchedule.slice(0, showAllPayments ? undefined : 5).map(({ date, payment }, index) => (
            <li key={index}>
              {t('carFinanceCalculator.paymentDate')} {date}: ${payment}
            </li>
          ))}
        </ul>
        {!showAllPayments && paymentSchedule.length > 5 && (
          <button onClick={toggleShowAllPayments}>{t('carFinanceCalculator.showAll')}</button>
        )}
      </div>
    </div>
  );
}

export default FinanceCalculator;
