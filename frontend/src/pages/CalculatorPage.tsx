import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import client from '../api/client';
import type { CalculationResult } from '../api/types';
import '../styles/calculator.css';

function CalculatorPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCalculate = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both dates');
      return;
    }

    setLoading(true);
    try {
      const res = await client.post('/price-periods/calculate', {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      });
      setResult(res.data);
    } catch {
      toast.error('Failed to calculate price');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="calculator-page">
        <h1>Price Calculator</h1>
        <div className="calc-form">
          <div className="field">
            <label>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
              selectsStart
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
            />
          </div>
          <div className="field">
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
              selectsEnd
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              minDate={startDate ?? undefined}
            />
          </div>
          <button className="calc-btn" onClick={handleCalculate} disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </div>

        {result && (
          <div className="result-box">
            <div className="result-summary">
              <div className="stat">
                <span className="stat-label">Rental Days</span>
                <span className="stat-value">{result.rental_days}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Price</span>
                <span className="stat-value">${result.total_price}</span>
              </div>
            </div>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {result.breakdown.map((row) => (
                  <tr key={row.date}>
                    <td>{row.date}</td>
                    <td>${row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalculatorPage;
