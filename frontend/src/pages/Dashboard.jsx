import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Field from '../components/ui/Field';
import PageHeader from '../components/ui/PageHeader';
import StatChip from '../components/ui/StatChip';
import Badge from '../components/ui/Badge';

function Dashboard() {
  const [form, setForm] = useState({
    kitchenId: 'kitchen-nyc-001',
    pastConsumption: '120,130,115,140,125,132,138',
    dayOfWeek: 'Friday',
    expectedPeople: 145,
    events: 'Founders Day',
    weather: 'Rainy'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear stale localStorage on mount (data now lives in MongoDB)
  useEffect(() => {
    try { localStorage.removeItem('prediction_history'); } catch (_) {}
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitPrediction = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const payload = {
        kitchenId: form.kitchenId,
        pastConsumption: form.pastConsumption.split(',').map((n) => Number(n.trim())).filter((n) => !Number.isNaN(n)),
        dayOfWeek: form.dayOfWeek,
        expectedPeople: Number(form.expectedPeople),
        events: form.events ? form.events.split(',').map((x) => x.trim()) : [],
        weather: form.weather
      };

      const res = await api.post('/predict-demand', payload);
      const prediction = res.data;
      setResult(prediction);
      // Prediction is now auto-saved to MongoDB by the backend
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const wasteEstimate = result
    ? Math.max(0, Number(result.predictedQuantity) - Number(form.expectedPeople))
    : null;

  const efficiencyPct = result
    ? Number(((Number(form.expectedPeople) / Number(result.predictedQuantity)) * 100).toFixed(1))
    : null;

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Forecast Mission"
        title="Demand Prediction"
        description="Estimate demand before prep begins so your kitchen can reduce overproduction and redirect surplus responsibly."
      />

      <Card toned title="Demand Prediction">
        <form className="form-grid" onSubmit={submitPrediction}>
          <Field label="Kitchen ID" htmlFor="kitchen-id">
            <input id="kitchen-id" name="kitchenId" value={form.kitchenId} onChange={onChange} placeholder="Kitchen ID" />
          </Field>
          <Field label="Past Consumption (CSV)" htmlFor="past-consumption">
            <input id="past-consumption" name="pastConsumption" value={form.pastConsumption} onChange={onChange} placeholder="e.g., 120,130,115,140,125" />
          </Field>
          <Field label="Day of Week" htmlFor="day-of-week">
            <input id="day-of-week" name="dayOfWeek" value={form.dayOfWeek} onChange={onChange} placeholder="e.g., Monday, Friday" />
          </Field>
          <Field label="Expected People" htmlFor="expected-people">
            <input id="expected-people" name="expectedPeople" type="number" value={form.expectedPeople} onChange={onChange} placeholder="Expected number of people" />
          </Field>
          <Field label="Events (CSV)" htmlFor="events">
            <input id="events" name="events" value={form.events} onChange={onChange} placeholder="e.g., Founders Day, Festival" />
          </Field>
          <Field label="Weather" htmlFor="weather">
            <input id="weather" name="weather" value={form.weather} onChange={onChange} placeholder="e.g., Rainy, Sunny, Cloudy" />
          </Field>
          <div className="form-action">
            <Button id="predict-submit" type="submit" disabled={loading}>
              {loading ? 'Predicting...' : 'Predict Demand'}
            </Button>
          </div>
        </form>
      </Card>

      {error && <Alert tone="error" ariaLive="assertive">{error}</Alert>}

      {result && (
        <Card title="Prediction Results">
          <div className="stats-grid">
            <StatChip
              label="Predicted Quantity"
              value={<Badge tone="success">{result.predictedQuantity} plates</Badge>}
            />
            <StatChip
              label="Expected People"
              value={`${form.expectedPeople} people`}
            />
            <StatChip
              label="Estimated Surplus / Waste"
              value={
                <Badge tone={wasteEstimate > 0 ? 'warning' : 'success'}>
                  {wasteEstimate > 0 ? `+${wasteEstimate} plates surplus` : '✓ No surplus'}
                </Badge>
              }
            />
            <StatChip
              label="Consumption Efficiency"
              value={
                <Badge tone={efficiencyPct >= 90 ? 'success' : efficiencyPct >= 75 ? 'warning' : 'error'}>
                  {efficiencyPct}%
                </Badge>
              }
            />
            <StatChip
              label="Surplus Risk"
              value={result.surplusRisk ? <Badge tone="warning">High Risk</Badge> : <Badge tone="success">Controlled</Badge>}
            />
            <StatChip
              label="Donation Recommended"
              value={result.donationRecommended ? <Badge tone="success">Yes</Badge> : <Badge tone="neutral">No</Badge>}
            />
          </div>

          {result.adjustmentFactors && (
            <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'var(--surface-muted)', borderRadius: '10px', fontSize: '0.9rem', lineHeight: 1.7 }}>
              <strong>Adjustment Factors applied:</strong>
              <div>Event multiplier: <Badge tone="neutral">{result.adjustmentFactors.eventMultiplier?.toFixed(2) || '1.00'}×</Badge></div>
              <div>Weather multiplier: <Badge tone="neutral">{result.adjustmentFactors.weatherMultiplier?.toFixed(2) || '1.00'}×</Badge></div>
              <div>Day: <Badge tone="neutral">{form.dayOfWeek}</Badge></div>
            </div>
          )}

          {wasteEstimate > 0 && (
            <Alert tone="warning">
              ⚠️ Prediction suggests <strong>{wasteEstimate} surplus plates</strong> may go to waste. Consider donating to nearby NGOs or reducing prep by ~{wasteEstimate} plates.
            </Alert>
          )}

          <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
            ✅ This prediction was automatically saved. Check the <strong>Dashboard</strong> tab for cumulative analytics.
          </p>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;
