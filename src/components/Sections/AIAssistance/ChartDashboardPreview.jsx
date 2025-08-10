import React from 'react';
import { ChartDashboard } from './chartDashboard';
import { hardcodedGraphData } from './hardcodedGraphData';

const ChartDashboardPreview = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Chart Dashboard Preview</h1>
      <ChartDashboard graphData={hardcodedGraphData} />
    </div>
  );
};

export default ChartDashboardPreview;
