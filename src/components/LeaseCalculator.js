import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LeaseCalculator.css';

function LeaseCalculator() {
  const { t, i18n } = useTranslation(); // Initialize the translation hook
  

  const [carPrice, setCarPrice] = useState(20000);
  const [leaseTerm, setLeaseTerm] = useState(36); // Lease term in months
  const [leasingRate, setLeasingRate] = useState(5.0); // Leasing rate in %
  const [downPayment, setDownPayment] = useState(0); // Down payment
  const [leasePayment, setLeasePayment] = useState(0);
  const [paymentSchedule, setPaymentSchedule] = useState([]);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const taxRate = 13.0; // Tax rate in %

  useEffect(() => {
    const calculateLeasePayment = () => {
      const monthlyLeaseRate = (leasingRate / 100) / 12;
      const adjustedLeaseRate = 1 + monthlyLeaseRate;
      const residualValue = carPrice - downPayment;
      const leasePayment = (residualValue * adjustedLeaseRate) / leaseTerm;
      setLeasePayment(leasePayment);

      const generatePaymentSchedule = () => {
        return Array.from({ length: leaseTerm }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() + i + 1);
          const paymentWithTax = leasePayment + (leasePayment * taxRate) / 100;
          return {
            date: date.toLocaleDateString(),
            payment: paymentWithTax.toFixed(2),
          };
        });
      };

      const schedule = generatePaymentSchedule();
      setPaymentSchedule(schedule);
    };

    calculateLeasePayment();
  }, [carPrice, leaseTerm, leasingRate, downPayment]);

  const toggleShowAllPayments = () => {
    setShowAllPayments(!showAllPayments);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change the language
  };

  return (
    <div className="container">
      <h1>{t('leaseCalculator.title')}</h1>
      <label>
        {t('leaseCalculator.carPrice')}:
        <input
          type="text"
          value={carPrice}
          onChange={(e) => setCarPrice(Number(e.target.value))}
        />
      </label>
      <label>
        {t('leaseCalculator.leaseTerm')}:
        <input
          type="text"
          value={leaseTerm}
          onChange={(e) => setLeaseTerm(Number(e.target.value))}
        />
      </label>
      <label>
        {t('leaseCalculator.leasingRate')}:
        <input
          type="text"
          value={leasingRate}
          onChange={(e) => setLeasingRate(Number(e.target.value))}
        />
      </label>
      <label>
        {t('leaseCalculator.downPayment')}:
        <input
          type="text"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
        />
      </label>
      <div className="payment-schedule">
        <h2>
          {t('leaseCalculator.monthlyLeasePayment')}: {(leasePayment + (leasePayment * taxRate) / 100).toFixed(2)}
          &nbsp;({t('leaseCalculator.includedTax')}: {(leasePayment * taxRate / 100).toFixed(2)})
        </h2>
        <h2>{t('leaseCalculator.paymentSchedule')}:</h2>
        <ul>
          {paymentSchedule.slice(0, showAllPayments ? undefined : 5).map(({ date, payment }, index) => (
            <li key={index}>
              {t('leaseCalculator.paymentDate')} {date}: ${payment}
            </li>
          ))}
        </ul>
        {!showAllPayments && paymentSchedule.length > 5 && (
          <button onClick={toggleShowAllPayments}>{t('leaseCalculator.showAll')}</button>
        )}
      </div>

      <div className="language-toggle">
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('tr')}>Türkçe</button>
      </div>
    </div>
  );
}

export default LeaseCalculator;
