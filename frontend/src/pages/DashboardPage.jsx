import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import StatChip from '../components/ui/StatChip';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';

const KITCHEN_ID = 'kitchen-nyc-001'; // matches the default in PredictionPage
const MEAL_PLATE_PRICE = 50; // ₹ per plate

function toShortDate(isoDate) {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return String(isoDate);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getLinePath(values, width = 560, height = 180, padding = 20) {
  const max = Math.max(...values, 1);
  const stepX = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;
  return values
    .map((value, idx) => {
      const x = padding + idx * stepX;
      const y = height - padding - ((value / max) * (height - padding * 2));
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

function DashboardPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const loadHistory = useCallback(async () => {
    try {
      setFetchError('');
      const res = await api.get(`/prediction-history?kitchenId=${KITCHEN_ID}&limit=100`);
      // API returns newest-first; reverse to oldest-first for charting
      const data = Array.isArray(res.data?.data) ? [...res.data.data].reverse() : [];
      setHistory(data);
    } catch (err) {
      setFetchError('Could not load predictions from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
    // Refresh every 10 s to auto-pick up new predictions from other tabs / sessions
    const interval = setInterval(loadHistory, 10000);
    return () => clearInterval(interval);
  }, [loadHistory]);

  const clearHistory = async () => {
    try {
      await api.delete(`/prediction-history?kitchenId=${KITCHEN_ID}`);
      setHistory([]);
    } catch {
      setFetchError('Failed to clear history.');
    }
  };

  if (loading) {
    return (
      <div className="stack">
        <PageHeader
          eyebrow="Performance Overview"
          title="Dashboard"
          description="Cumulative analytics computed from your demand predictions."
        />
        <Alert tone="info">⏳ Loading prediction history from database…</Alert>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="stack">
        <PageHeader eyebrow="Performance Overview" title="Dashboard" description="" />
        <Alert tone="error">{fetchError}</Alert>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="stack">
        <PageHeader
          eyebrow="Performance Overview"
          title="Dashboard"
          description="Cumulative analytics computed from your demand predictions."
        />
        <Alert tone="info">
          No prediction data yet. Go to the <strong>Demand Prediction</strong> tab, run a prediction, and the dashboard will populate automatically with real analytics!
        </Alert>
      </div>
    );
  }

  // ── Derived statistics from prediction history ──
  const totalPredictions = history.length;
  const totalExpected = history.reduce((s, r) => s + r.expectedPeople, 0);
  const totalPredicted = history.reduce((s, r) => s + r.predictedQuantity, 0);
  const totalWaste = history.reduce((s, r) => s + r.estimatedWaste, 0);
  const avgWastePerRun = Number((totalWaste / totalPredictions).toFixed(1));
  const efficiencyRate = totalPredicted > 0
    ? Number(((totalExpected / totalPredicted) * 100).toFixed(1))
    : 0;

  // Last 7 predictions for trend
  const last7 = history.slice(-7);
  const wasteValues = last7.map((r) => r.estimatedWaste);
  const linePath = wasteValues.length > 1 ? getLinePath(wasteValues) : '';
  const lineMax = Math.max(...wasteValues, 1);

  const donationRuns = history.filter((r) => r.donationRecommended).length;
  const highRiskRuns = history.filter((r) => r.surplusRisk).length;

  // Money saved = waste avoided vs estimated overcooked without prediction
  const potentialWasteIfNoPrediction = history.reduce((s, r) => {
    const wouldHaveCooked = Math.round(r.expectedPeople * 1.15);
    return s + Math.max(0, wouldHaveCooked - r.predictedQuantity);
  }, 0);
  const moneySavedTotal = potentialWasteIfNoPrediction * MEAL_PLATE_PRICE;
  const moneySavedPerRun = Number((moneySavedTotal / totalPredictions).toFixed(0));

  // Latest prediction
  const latest = history[history.length - 1];
  const barsMax = Math.max(...history.slice(-5).map((r) => r.estimatedWaste), 1);

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Performance Overview"
        title="Dashboard"
        description="Real-time analytics powered by your demand prediction data — waste reduction, cost savings, and efficiency."
      />

      {/* ── Overview Banner ── */}
      <Card title={`Analytics — ${totalPredictions} Prediction${totalPredictions > 1 ? 's' : ''} Logged`}>
        <div className="stats-grid">
          <StatChip
            label="Total Predictions Run"
            value={<Badge tone="success">{totalPredictions}</Badge>}
          />
          <StatChip
            label="Total Estimated Waste"
            value={<Badge tone={totalWaste > 0 ? 'warning' : 'success'}>{totalWaste} plates</Badge>}
          />
          <StatChip
            label="Avg Waste per Prediction"
            value={<Badge tone={avgWastePerRun > 10 ? 'warning' : 'success'}>{avgWastePerRun} plates</Badge>}
          />
          <StatChip
            label="Overall Efficiency Rate"
            value={<Badge tone={efficiencyRate >= 90 ? 'success' : efficiencyRate >= 75 ? 'warning' : 'error'}>{efficiencyRate}%</Badge>}
          />
        </div>
      </Card>

      {/* ── Savings Card ── */}
      <Card title="Cost Impact (at ₹50/plate)">
        <div className="stats-grid">
          <StatChip
            label="Waste Avoided vs Overcooked Estimate"
            value={<Badge tone="success">{potentialWasteIfNoPrediction} plates saved</Badge>}
          />
          <StatChip
            label="Money Saved (Total)"
            value={<Badge tone="success">₹{moneySavedTotal.toLocaleString('en-IN')}</Badge>}
          />
          <StatChip
            label="Avg Savings per Prediction"
            value={`₹${moneySavedPerRun.toLocaleString('en-IN')}`}
          />
          <StatChip
            label="Donations Recommended"
            value={<Badge tone={donationRuns > 0 ? 'success' : 'neutral'}>{donationRuns} / {totalPredictions} runs</Badge>}
          />
        </div>
      </Card>

      {/* ── Visual Charts ── */}
      <div className="dashboard-visual-grid">
        <Card title="Waste Trend (Last 7 Predictions)">
          <div className="chart-wrap">
            {wasteValues.length < 2 ? (
              <p className="empty-state">Run at least 2 predictions to see trend data.</p>
            ) : (
              <svg className="line-chart" viewBox="0 0 560 180" role="img" aria-label="Waste trend">
                <line x1="20" y1="160" x2="540" y2="160" className="chart-axis" />
                <line x1="20" y1="20" x2="20" y2="160" className="chart-axis" />
                {linePath && <path d={linePath} className="chart-line" />}
                {last7.map((r, index) => {
                  const x = 20 + (last7.length > 1 ? index * (520 / (last7.length - 1)) : 0);
                  const y = 160 - ((r.estimatedWaste / lineMax) * 140);
                  return (
                    <g key={r.id}>
                      <circle cx={x} cy={y} r="5" className="chart-point" />
                      <text x={x} y="176" textAnchor="middle" className="chart-label">
                        {toShortDate(r.date)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
          <p className="chart-caption">Lower values = less surplus predicted. Goal: steady downward trend.</p>
        </Card>

        <Card title="Efficiency Progress">
          <div className="progress-ring-wrap">
            <div
              className="progress-ring"
              style={{
                background: `conic-gradient(var(--success) ${Math.min(100, efficiencyRate)}%, color-mix(in srgb, var(--surface-muted) 92%, transparent) 0)`
              }}
            >
              <div className="progress-ring-inner">
                <strong>{efficiencyRate}%</strong>
                <span>Efficiency</span>
              </div>
            </div>
          </div>
          <div className="progress-legend">
            <p>Total expected: <strong>{totalExpected} people</strong></p>
            <p>Total predicted: <strong>{totalPredicted} plates</strong></p>
            <p>High risk runs: <strong style={{ color: highRiskRuns > 0 ? 'var(--error, #d32f2f)' : undefined }}>{highRiskRuns}</strong></p>
          </div>
        </Card>
      </div>

      {/* ── Last 5 predictions bar chart ── */}
      <Card title="Waste per Recent Prediction (Plates)">
        <div className="bar-chart">
          {history.slice(-5).map((r, idx) => (
            <div className="bar-item" key={r.id}>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ height: `${Math.max(8, ((r.estimatedWaste || 0) / barsMax) * 100)}%` }}
                />
              </div>
              <p className="bar-value">{r.estimatedWaste}</p>
              <p className="bar-label" title={toShortDate(r.date)}>{toShortDate(r.date)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Latest prediction details ── */}
      <Card title="Latest Prediction Snapshot">
        <div className="stats-grid">
          <StatChip label="Date" value={new Date(latest.date).toLocaleString('en-IN')} />
          <StatChip label="Expected People" value={`${latest.expectedPeople} people`} />
          <StatChip label="Predicted Quantity" value={<Badge tone="success">{latest.predictedQuantity} plates</Badge>} />
          <StatChip
            label="Estimated Waste"
            value={<Badge tone={latest.estimatedWaste > 0 ? 'warning' : 'success'}>{latest.estimatedWaste} surplus plates</Badge>}
          />
          <StatChip label="Day of Week" value={latest.dayOfWeek || '—'} />
          <StatChip label="Weather" value={latest.weather || '—'} />
          <StatChip label="Event Multiplier" value={`${Number(latest.eventMultiplier || 1).toFixed(2)}×`} />
          <StatChip label="Weather Multiplier" value={`${Number(latest.weatherMultiplier || 1).toFixed(2)}×`} />
        </div>
      </Card>

      {/* ── Calculation Breakdown ── */}
      <Card title="Calculation Details">
        <div style={{ padding: '1rem', fontSize: '0.92rem', lineHeight: '1.8' }}>
          <p><strong>How values are computed:</strong></p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Estimated Waste = max(0, Predicted Quantity − Expected People)</li>
            <li>Efficiency Rate = (Total Expected ÷ Total Predicted) × 100</li>
            <li>Plates Saved = Estimated overcooked without prediction (Expected × 1.15) − Predicted Quantity</li>
            <li>Money Saved = Plates Saved × ₹{MEAL_PLATE_PRICE}</li>
          </ul>

          <p style={{ marginTop: '1rem' }}><strong>Your totals (all {totalPredictions} predictions):</strong></p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Total people expected: <strong>{totalExpected}</strong></li>
            <li>Total plates predicted: <strong>{totalPredicted}</strong></li>
            <li>Total estimated waste: <strong>{totalWaste} plates</strong></li>
            <li>Plates avoided wasting vs no-prediction: <strong>{potentialWasteIfNoPrediction}</strong></li>
          </ul>

          {moneySavedTotal > 0 && (
            <p style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: 'var(--color-success-bg, #e6f4ea)', borderRadius: '10px', fontWeight: 500 }}>
              🎉 <strong>Impact:</strong> By using demand prediction, your kitchen potentially saved <strong>₹{moneySavedTotal.toLocaleString('en-IN')}</strong> and avoided wasting <strong>{potentialWasteIfNoPrediction} plates</strong> across {totalPredictions} sessions!
            </p>
          )}
        </div>
      </Card>

      {/* ── History Table ── */}
      <Card title="Prediction History">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['Date', 'Expected', 'Predicted', 'Waste', 'Efficiency', 'Risk', 'Donation'].map((h) => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((r) => {
                const eff = r.predictedQuantity > 0
                  ? Number(((r.expectedPeople / r.predictedQuantity) * 100).toFixed(1))
                  : 0;
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>{new Date(r.date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td style={{ padding: '8px 12px' }}>{r.expectedPeople}</td>
                    <td style={{ padding: '8px 12px' }}>{r.predictedQuantity}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <Badge tone={r.estimatedWaste > 0 ? 'warning' : 'success'}>{r.estimatedWaste}</Badge>
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <Badge tone={eff >= 90 ? 'success' : eff >= 75 ? 'warning' : 'error'}>{eff}%</Badge>
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <Badge tone={r.surplusRisk ? 'warning' : 'success'}>{r.surplusRisk ? 'High' : 'Low'}</Badge>
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <Badge tone={r.donationRecommended ? 'success' : 'neutral'}>{r.donationRecommended ? 'Yes' : 'No'}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button
          onClick={clearHistory}
          style={{ marginTop: '1rem', padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-subtle)' }}
        >
          Clear History
        </button>
      </Card>
    </div>
  );
}

export default DashboardPage;
