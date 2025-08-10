# AI Analytics Chart Components

This directory contains chart components for visualizing AI response analytics data. The components are designed to work with the AI response data structure that includes case analytics and various chart configurations.

## Components Overview

### 1. ChartComponents.jsx
Contains all the chart components:
- `PieChart` - For score distribution visualization
- `BarChart` - For similarity scores and threshold analysis
- `LineChart` - For timeline visualization
- `Heatmap` - For score distribution heatmaps
- `AnalyticsDashboard` - Complete dashboard with all charts
- `CaseAnalyticsSummary` - Summary statistics

### 2. AIAnalyticsDemo.jsx
A demo component showing how to use all the charts with sample data.

### 3. AIAnalyticsIntegration.jsx
An integration component showing how to add analytics to your existing AI interface.

## Installation Requirements

You'll need to install Chart.js and react-chartjs-2:

```bash
npm install chart.js react-chartjs-2
```

## Usage Examples

### Basic Usage

```jsx
import { AnalyticsDashboard, CaseAnalyticsSummary } from './ChartComponents';

// In your component
const MyComponent = ({ aiResponse }) => {
  return (
    <div>
      {/* Show analytics summary */}
      <CaseAnalyticsSummary caseAnalytics={aiResponse.case_analytics} />
      
      {/* Show all charts */}
      <AnalyticsDashboard caseAnalytics={aiResponse.case_analytics} />
    </div>
  );
};
```

### Individual Charts

```jsx
import { PieChart, BarChart, LineChart, Heatmap } from './ChartComponents';

// Pie Chart
<PieChart 
  data={aiResponse.case_analytics.graphs.score_distribution.data}
  title="Case Score Distribution"
/>

// Bar Chart
<BarChart 
  data={aiResponse.case_analytics.graphs.similarity_bar.data}
  title="Case Similarity Scores"
  indexAxis="y"
/>

// Line Chart
<LineChart 
  data={aiResponse.case_analytics.graphs.score_timeline.data}
  title="Case Similarity Score Timeline"
/>

// Heatmap
<Heatmap 
  data={aiResponse.case_analytics.graphs.score_heatmap.data}
  title="Case Score Distribution Heatmap"
/>
```

## Data Structure

The components expect AI response data in this format:

```javascript
{
  "answer": "AI response text...",
  "case_analytics": {
    "case_data": {
      "avg_similarity": 0.760,
      "cases_above_threshold": 2,
      "total_cases": 2,
      "threshold_used": 0.75
    },
    "graphs": {
      "score_distribution": {
        "chart_type": "pie",
        "data": { /* Chart.js data format */ },
        "title": "Case Score Distribution"
      },
      "similarity_bar": {
        "chart_type": "bar",
        "data": { /* Chart.js data format */ },
        "title": "Case Similarity Scores"
      },
      "score_timeline": {
        "chart_type": "line",
        "data": { /* Chart.js data format */ },
        "title": "Case Similarity Score Timeline"
      },
      "threshold_analysis": {
        "chart_type": "bar",
        "data": { /* Chart.js data format */ },
        "title": "Cases Above/Below Threshold"
      },
      "score_heatmap": {
        "chart_type": "heatmap",
        "data": {
          "matrix": [[0], [0], [0], [2], [0]],
          "x_labels": ["Cases"],
          "y_labels": ["0.0-0.2", "0.2-0.4", "0.4-0.6", "0.6-0.8", "0.8-1.0"],
          "max_value": 2
        },
        "title": "Case Score Distribution Heatmap"
      }
    }
  }
}
```

## Features

### 1. Responsive Design
All charts are responsive and work well on different screen sizes.

### 2. Dark Mode Support
Charts automatically adapt to dark/light theme using Tailwind CSS classes.

### 3. Interactive Tooltips
Line charts include custom tooltips showing case names and scores.

### 4. Custom Styling
Charts use consistent styling with rounded corners, shadows, and proper spacing.

### 5. Error Handling
Components gracefully handle missing or malformed data.

## Integration with Existing AI Interface

To integrate these charts into your existing AI assistance interface:

1. Import the components:
```jsx
import { AnalyticsDashboard, CaseAnalyticsSummary } from './ChartComponents';
```

2. Add a tab or section for analytics:
```jsx
const [activeTab, setActiveTab] = useState('answer');

// In your render method
{activeTab === 'analytics' && (
  <div className="space-y-6">
    <CaseAnalyticsSummary caseAnalytics={aiResponse.case_analytics} />
    <AnalyticsDashboard caseAnalytics={aiResponse.case_analytics} />
  </div>
)}
```

3. Handle the AI response data:
```jsx
const handleAIResponse = (response) => {
  if (response.case_analytics && response.case_analytics.has_cases) {
    // Show analytics tab
    setShowAnalytics(true);
  }
};
```

## Customization

### Colors
Chart colors can be customized by modifying the `backgroundColor` and `borderColor` properties in the data objects.

### Layout
The dashboard layout can be customized by modifying the grid classes in the `AnalyticsDashboard` component.

### Styling
All components use Tailwind CSS classes and can be customized by passing additional `className` props.

## Performance Considerations

- Charts are only rendered when data is available
- Large datasets are handled efficiently by Chart.js
- Components use React.memo for performance optimization where appropriate

## Browser Compatibility

- Modern browsers with ES6+ support
- Chart.js handles canvas rendering
- Responsive design works on mobile devices

## Troubleshooting

### Charts not rendering
- Check if Chart.js and react-chartjs-2 are installed
- Verify the data structure matches the expected format
- Check browser console for errors

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check if dark mode classes are applied correctly

### Performance issues
- Consider lazy loading charts for large datasets
- Use React.memo for components that don't need frequent updates