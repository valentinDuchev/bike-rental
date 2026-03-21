import { useState, useEffect, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import client from '../api/client';
import type { PricePeriod } from '../api/types';
import '../styles/admin.css';

interface PeriodFormData {
  price_per_day: string;
  start_date: string;
  end_date: string;
}

const emptyForm: PeriodFormData = { price_per_day: '', start_date: '', end_date: '' };

function AdminPage() {
  const [periods, setPeriods] = useState<PricePeriod[]>([]);
  const [defaultPrice, setDefaultPrice] = useState('');
  const [formData, setFormData] = useState<PeriodFormData>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadPeriods = async () => {
    try {
      const res = await client.get('/price-periods');
      setPeriods(res.data);
    } catch {
      toast.error('Failed to load periods');
    }
  };

  const loadDefaultPrice = async () => {
    try {
      const res = await client.get('/settings/default-price');
      setDefaultPrice(String(res.data.default_price_per_day));
    } catch {
      toast.error('Failed to load default price');
    }
  };

  useEffect(() => {
    loadPeriods();
    loadDefaultPrice();
  }, []);

  const handleDefaultPriceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await client.put('/settings/default-price', { price: parseFloat(defaultPrice) });
      toast.success('Default price updated');
    } catch {
      toast.error('Failed to update default price');
    }
  };

  const handlePeriodSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      price_per_day: parseFloat(formData.price_per_day),
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    try {
      if (editingId) {
        await client.put(`/price-periods/${editingId}`, payload);
        toast.success('Period updated');
      } else {
        await client.post('/price-periods', payload);
        toast.success('Period created');
      }
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
      loadPeriods();
    } catch {
      toast.error('Failed to save period');
    }
  };

  const handleEdit = (period: PricePeriod) => {
    setFormData({
      price_per_day: String(period.price_per_day),
      start_date: period.start_date,
      end_date: period.end_date,
    });
    setEditingId(period.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this price period?')) return;
    try {
      await client.delete(`/price-periods/${id}`);
      toast.success('Period deleted');
      loadPeriods();
    } catch {
      toast.error('Failed to delete period');
    }
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="container">
      <div className="admin-page">
        <h1>Manage Pricing</h1>

        <div className="admin-section">
          <h2>Default Price Per Day</h2>
          <form className="default-price-form" onSubmit={handleDefaultPriceSubmit}>
            <div className="field">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>

        <div className="admin-section">
          <h2>Price Periods</h2>
          {periods.length > 0 ? (
            <table className="periods-table">
              <thead>
                <tr>
                  <th>Price/Day</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => (
                  <tr key={p.id}>
                    <td>${p.price_per_day}</td>
                    <td>{p.start_date}</td>
                    <td>{p.end_date}</td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-secondary" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">No price periods yet</p>
          )}

          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add Period
            </button>
          )}

          {showForm && (
            <form className="period-form" onSubmit={handlePeriodSubmit}>
              <h3>{editingId ? 'Edit Period' : 'New Period'}</h3>
              <div className="period-form-fields">
                <div className="field">
                  <label>Price Per Day ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="period-form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
