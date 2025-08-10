import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

// Pie Chart Component
export const PieChart = ({ data, title, className = "" }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderWidth: dataset.borderWidth || 2,
      borderColor: dataset.borderColor || '#ffffff',
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${className}`}>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

// Bar Chart Component
export const BarChart = ({ data, title, className = "", indexAxis = "x" }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderWidth: dataset.borderWidth || 1,
    }))
  };

  const options = {
    indexAxis: indexAxis,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: indexAxis === "y" ? false : true,
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        display: indexAxis === "x",
        grid: {
          display: false,
        },
      },
      y: {
        display: indexAxis === "y",
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${className}`}>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

// Line Chart Component
export const LineChart = ({ data, title, className = "" }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderWidth: dataset.borderWidth || 2,
      fill: dataset.fill || false,
      tension: dataset.tension || 0.4,
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${className}`}>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

// Heatmap Component (Custom implementation)
export const Heatmap = ({ data, title, className = "" }) => {
  // Handle backend data structure
  if (data.labels && data.data) {
    // Backend format: { labels: [...], data: [...] }
    const maxValue = Math.max(...data.data);
    
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${className}`}>
        <h3 className="text-lg font-bold mb-4 text-center">{title}</h3>
        <div className="space-y-2">
          {data.labels.map((label, index) => {
            const value = data.data[index] || 0;
            const intensity = value === 0 ? 0 : Math.min(100, Math.floor((value / maxValue) * 100));
            const bgColor = value === 0 
              ? 'bg-gray-100 dark:bg-gray-700' 
              : `bg-purple-${Math.max(100, Math.floor(intensity / 25) * 100)}`;
            
            return (
              <div key={index} className="flex items-center justify-between p-2 rounded">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-16 h-6 rounded ${bgColor} flex items-center justify-center text-xs font-medium text-white`}>
                    {value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Original matrix format (fallback)
  const { matrix, x_labels, y_labels, max_value } = data;
  
  const getColorIntensity = (value) => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-700';
    const intensity = Math.min(255, Math.floor((value / max_value) * 255));
    return `bg-purple-${Math.max(100, Math.floor(intensity / 25) * 100)}`;
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-center">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left"></th>
              {x_labels.map((label, index) => (
                <th key={index} className="p-2 text-center text-sm">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-2 text-sm font-medium">{y_labels[rowIndex]}</td>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={`p-2 text-center text-sm ${getColorIntensity(cell)}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Analytics Dashboard Component
export const AnalyticsDashboard = ({ caseAnalytics, className = "" }) => {
  if (!caseAnalytics || !caseAnalytics.graphs) {
    return <div className="text-center text-gray-500">No analytics data available</div>;
  }

  const { graphs } = caseAnalytics;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Score Distribution Pie Chart */}
      {graphs.distribution_chart && (
        <div className="lg:col-span-1">
          <PieChart 
            data={{
              labels: graphs.distribution_chart.labels,
              datasets: [{
                data: graphs.distribution_chart.data,
                backgroundColor: graphs.distribution_chart.colors || ['#22c55e', '#eab308', '#f97316', '#ef4444', '#991b1b'],
                borderWidth: 2,
                borderColor: '#ffffff'
              }]
            }} 
            title={graphs.distribution_chart.title || "Score Distribution"}
          />
        </div>
      )}

      {/* Similarity Bar Chart */}
      {graphs.similarity_chart && (
        <div className="lg:col-span-1">
          <BarChart 
            data={{
              labels: graphs.similarity_chart.labels,
              datasets: [{
                data: graphs.similarity_chart.data,
                backgroundColor: graphs.similarity_chart.colors || ['#22c55e', '#eab308', '#ef4444'],
                borderWidth: 1,
                borderColor: '#ffffff'
              }]
            }} 
            title={graphs.similarity_chart.title || "Case Similarity Scores"}
            indexAxis="y"
          />
        </div>
      )}

      {/* Score Timeline Line Chart */}
      {graphs.timeline_chart && (
        <div className="lg:col-span-2">
          <LineChart 
            data={{
              labels: graphs.timeline_chart.data.map((item, index) => `Rank ${item.rank}`),
              datasets: [{
                data: graphs.timeline_chart.data.map(item => item.score),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
              }]
            }} 
            title={graphs.timeline_chart.title || "Score by Rank"}
          />
        </div>
      )}

      {/* Threshold Analysis Bar Chart */}
      {graphs.threshold_chart && (
        <div className="lg:col-span-1">
          <BarChart 
            data={{
              labels: graphs.threshold_chart.labels,
              datasets: [{
                data: graphs.threshold_chart.data,
                backgroundColor: graphs.threshold_chart.colors || ['#22c55e', '#ef4444'],
                borderWidth: 1,
                borderColor: '#ffffff'
              }]
            }} 
            title={graphs.threshold_chart.title || `Cases Above/Below Threshold (${graphs.threshold_chart.threshold})`}
          />
        </div>
      )}

      {/* Score Heatmap */}
      {graphs.heatmap_chart && (
        <div className="lg:col-span-1">
          <Heatmap 
            data={{
              labels: graphs.heatmap_chart.ranges,
              data: graphs.heatmap_chart.data
            }} 
            title={graphs.heatmap_chart.title || "Score Distribution Heatmap"}
          />
        </div>
      )}
    </div>
  );
};

// Case Analytics Summary Component
export const CaseAnalyticsSummary = ({ caseAnalytics, className = "" }) => {
  if (!caseAnalytics) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md ${className}`}>
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Case Analytics Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{caseAnalytics.total_cases || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Cases</div>
        </div>
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{caseAnalytics.above_threshold || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Above Threshold</div>
        </div>
        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{(caseAnalytics.avg_similarity || 0).toFixed(3)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Similarity</div>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{caseAnalytics.threshold_used || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Threshold Used</div>
        </div>
      </div>
    </div>
  );
};

export default {
  PieChart,
  BarChart,
  LineChart,
  Heatmap,
  AnalyticsDashboard,
  CaseAnalyticsSummary
}; 