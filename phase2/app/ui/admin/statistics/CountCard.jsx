

export default function CountCard({ label, count }) {
  return (
    <div className="count-card">
      <p className="count-label">{label}</p>
      <p className="count-value">{count}</p>
    </div>
  );
}
