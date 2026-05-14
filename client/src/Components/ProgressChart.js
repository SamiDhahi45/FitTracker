import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

const ProgressChart = ({ workouts }) => {
  const data = workouts.slice(-10).map((w) => ({
    name:     new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    volume:   w.totalVolume,
    duration: w.duration || 0,
  }));

  return (
    <div data-testid="progress-chart">
      <h6 className="text-muted mb-3">Volume Over Time (last 10 workouts)</h6>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#0d6efd" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${v.toLocaleString()} kg`, "Volume"]} />
          <Area type="monotone" dataKey="volume" stroke="#0d6efd" fill="url(#volumeGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
