import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function OnTimeChart({ orderResults }) {
  const onTime = orderResults.filter(o=>o.deliveredOnTime).length;
  const late = orderResults.length - onTime;
  const data = {
    labels: ['On Time', 'Late'],
    datasets: [{
      data: [onTime, late],
      backgroundColor: ['#10b981', '#ef4444'],
    }]
  };
  return <div>
    <h3 className="mb-2 font-semibold">On-time vs Late</h3>
    <Pie data={data} />
  </div>;
}
