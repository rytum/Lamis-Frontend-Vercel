import React from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
import HeatMap from 'react-heatmap-grid';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

// 1. Pie Chart Component
export const ScoreDistributionPie = ({ chartData }) => (
  <div>
    <h2>{chartData.title}</h2>
    <Pie data={chartData.data} options={chartData.options} />
  </div>
);

// 2. Heatmap Component
export const ScoreHeatmap = ({ chartData }) => (
  <div>
    <h2>{chartData.title}</h2>
    <HeatMap
      xLabels={chartData.data.xLabels}
      yLabels={chartData.data.yLabels}
      data={chartData.data.matrix}
      cellStyle={(background, value, min, max) => ({
        background: `rgba(59,130,246, ${value / max})`,
        fontSize: '11px',
        color: '#000'
      })}
      cellRender={(value) => (value !== 0 ? value : '')}
    />
    <p>{chartData.description}</p>
  </div>
);

// 3. Line Chart Component
export const ScoreTimelineLine = ({ chartData }) => (
  <div>
    <h2>{chartData.title}</h2>
    <Line data={chartData.data} options={chartData.options} />
  </div>
);

// 4. Horizontal Bar Component
export const SimilarityBar = ({ chartData }) => (
  <div>
    <h2>{chartData.title}</h2>
    <Bar data={chartData.data} options={chartData.options} />
  </div>
);

// 5. Threshold Analysis Bar
export const ThresholdAnalysisBar = ({ chartData }) => (
  <div>
    <h2>{chartData.title}</h2>
    <Bar data={chartData.data} options={chartData.options} />
  </div>
);

// Data cleaner and extractor
export const prepareChartData = (raw) => {
  return {
    score_distribution: {
      title: raw.score_distribution.title,
      data: raw.score_distribution.data,
      options: raw.score_distribution.options,
    },
    score_heatmap: {
      title: raw.score_heatmap.title,
      data: {
        matrix: raw.score_heatmap.data.matrix,
        xLabels: raw.score_heatmap.data.x_labels,
        yLabels: raw.score_heatmap.data.y_labels,
        max: raw.score_heatmap.data.max_value
      },
      description: raw.score_heatmap.description
    },
    score_timeline: {
      title: raw.score_timeline.title,
      data: raw.score_timeline.data,
      options: raw.score_timeline.options,
    },
    similarity_bar: {
      title: raw.similarity_bar.title,
      data: raw.similarity_bar.data,
      options: raw.similarity_bar.options,
    },
    threshold_analysis: {
      title: raw.threshold_analysis.title,
      data: raw.threshold_analysis.data,
      options: raw.threshold_analysis.options,
    },
  };
};

// Example usage component
export const ChartDashboard = ({ graphData }) => {
  const charts = prepareChartData(graphData);

  return (
    <div className="grid grid-cols-1 gap-6">
      <ScoreDistributionPie chartData={charts.score_distribution} />
      <ScoreHeatmap chartData={charts.score_heatmap} />
      <ScoreTimelineLine chartData={charts.score_timeline} />
      <SimilarityBar chartData={charts.similarity_bar} />
      <ThresholdAnalysisBar chartData={charts.threshold_analysis} />
    </div>
  );
};
