import React, { useState } from 'react';
import { AnalyticsDashboard, CaseAnalyticsSummary } from './ChartComponents';

// Test data
const testData = {
  case_analytics: {
    case_data: {
      avg_similarity: 0.7603943347930908,
      cases_above_threshold: 2,
      cases_below_threshold: 0,
      max_similarity: 0.7670125961303711,
      median_similarity: 0.7603943347930908,
      min_similarity: 0.7537760734558105,
      score_ranges: {
        "0.0-0.2": 0,
        "0.2-0.4": 0,
        "0.4-0.6": 0,
        "0.6-0.8": 2,
        "0.8-1.0": 0
      },
      std_deviation: 0.009359634942511259,
      threshold_used: 0.75,
      total_cases: 2
    },
    graphs: {
      score_distribution: {
        chart_type: "pie",
        data: {
          datasets: [
            {
              backgroundColor: [
                "#22c55e",
                "#eab308",
                "#f97316",
                "#ef4444",
                "#991b1b"
              ],
              borderColor: "#8b5cf6",
              borderWidth: 2,
              data: [2]
            }
          ],
          labels: ["Medium-High (0.6-0.8)"]
        },
        title: "Case Score Distribution"
      },
      similarity_bar: {
        chart_type: "bar",
        data: {
          datasets: [
            {
              backgroundColor: ["#eab308", "#eab308"],
              borderColor: ["#eab308", "#eab308"],
              borderWidth: 1,
              data: [0.7537760734558105, 0.7670125961303711],
              label: "Similarity Score"
            }
          ],
          labels: [
            "#1: Lancaster, CA 93535 -3500 ,...",
            "#2: Luis v. Superior Court"
          ]
        },
        title: "Case Similarity Scores"
      },
      score_timeline: {
        chart_type: "line",
        data: {
          datasets: [
            {
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderColor: "#8b5cf6",
              data: [
                {
                  case_name: "Lancaster, CA 93535 -3500 , \nAppellant/Licensee  \nv. \nDEPARTMENT OF ALCOHOLIC BEVERAGE CONTROL",
                  x: 1,
                  y: 0.7537760734558105
                },
                {
                  case_name: "Luis v. Superior Court",
                  x: 2,
                  y: 0.7670125961303711
                }
              ],
              fill: true,
              label: "Similarity Score by Rank",
              pointHoverRadius: 8,
              pointRadius: 5,
              tension: 0.2
            }
          ]
        },
        title: "Case Similarity Score Timeline"
      },
      threshold_analysis: {
        chart_type: "bar",
        data: {
          datasets: [
            {
              backgroundColor: ["#22c55e", "#ef4444"],
              borderColor: ["#16a34a", "#dc2626"],
              borderWidth: 2,
              data: [2, 0],
              label: "Number of Cases"
            }
          ],
          labels: ["Above Threshold", "Below Threshold"]
        },
        title: "Cases Above/Below Threshold (0.75)"
      },
      score_heatmap: {
        chart_type: "heatmap",
        data: {
          matrix: [[0], [0], [0], [2], [0]],
          max_value: 2,
          x_labels: ["Cases"],
          y_labels: ["0.0-0.2", "0.2-0.4", "0.4-0.6", "0.6-0.8", "0.8-1.0"]
        },
        title: "Case Score Distribution Heatmap"
      }
    }
  }
};

// Test AI response with JSON chart data
const testAIResponse = {
  content: "Here's the analysis of your legal query:\n\nBased on the search results, I found 2 relevant cases with similarity scores above the threshold of 0.75.\n\n```json\n{\n  \"case_analytics\": {\n    \"case_data\": {\n      \"avg_similarity\": 0.7603943347930908,\n      \"cases_above_threshold\": 2,\n      \"total_cases\": 2\n    }\n  }\n}\n```\n\nThe cases show strong relevance to your query.",
  analytics: {
    case_analytics: testData.case_analytics
  }
};

const ChartTest = () => {
  const [showCharts, setShowCharts] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Chart Components Test
        </h1>
        
        <div className="mb-8">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
        </div>
        
        {showCharts && (
          <>
            <div className="mb-8">
              <CaseAnalyticsSummary caseAnalytics={testData.case_analytics} />
            </div>
            
            <div className="space-y-8">
              <AnalyticsDashboard caseAnalytics={testData.case_analytics} />
            </div>
          </>
        )}
        
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Test AI Response with Charts</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">AI Response:</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(testAIResponse, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold">Chart Data:</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(testData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartTest;