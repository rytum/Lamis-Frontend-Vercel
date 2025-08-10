import React from 'react';
import { AnalyticsDashboard, CaseAnalyticsSummary } from './ChartComponents';

// Sample AI response data structure (based on your example)
const sampleAIResponse = {
  "answer": "**🎯 DIRECT ANSWER**\nYes, school districts can face concurrent liability under both federal environmental laws and California state tort law for PCB contamination, even without immediate health impacts...",
  "case_analytics": {
    "case_data": {
      "avg_similarity": 0.7603943347930908,
      "cases_above_threshold": 2,
      "cases_below_threshold": 0,
      "max_similarity": 0.7670125961303711,
      "median_similarity": 0.7603943347930908,
      "min_similarity": 0.7537760734558105,
      "score_ranges": {
        "0.0-0.2": 0,
        "0.2-0.4": 0,
        "0.4-0.6": 0,
        "0.6-0.8": 2,
        "0.8-1.0": 0
      },
      "std_deviation": 0.009359634942511259,
      "threshold_used": 0.75,
      "total_cases": 2
    },
    "graphs": {
      "score_distribution": {
        "chart_type": "pie",
        "data": {
          "datasets": [
            {
              "backgroundColor": [
                "#22c55e",
                "#eab308",
                "#f97316",
                "#ef4444",
                "#991b1b"
              ],
              "borderColor": "#8b5cf6",
              "borderWidth": 2,
              "data": [
                2
              ]
            }
          ],
          "labels": [
            "Medium-High (0.6-0.8)"
          ]
        },
        "distribution_details": {
          "percentages": {
            "Medium-High (0.6-0.8)": 100.0
          },
          "ranges": {
            "Medium-High (0.6-0.8)": 2
          },
          "total_cases": 2
        },
        "options": {
          "plugins": {
            "legend": {
              "position": "bottom"
            }
          },
          "responsive": true
        },
        "title": "Case Score Distribution"
      },
      "score_heatmap": {
        "chart_type": "heatmap",
        "data": {
          "matrix": [
            [0],
            [0],
            [0],
            [2],
            [0]
          ],
          "max_value": 2,
          "x_labels": [
            "Cases"
          ],
          "y_labels": [
            "0.0-0.2",
            "0.2-0.4",
            "0.4-0.6",
            "0.6-0.8",
            "0.8-1.0"
          ]
        },
        "description": "Visualization of how cases are distributed across different similarity score ranges",
        "heatmap_details": [
          {
            "cases": [],
            "count": 0,
            "range": "0.0-0.2"
          },
          {
            "cases": [],
            "count": 0,
            "range": "0.2-0.4"
          },
          {
            "cases": [],
            "count": 0,
            "range": "0.4-0.6"
          },
          {
            "cases": [
              "Lancaster, CA 93535 -3500 , \nAppellant/Licensee  \nv. \nDEPARTMENT OF ALCOHOLIC BEVERAGE CONTROL",
              "Luis v. Superior Court"
            ],
            "count": 2,
            "range": "0.6-0.8"
          },
          {
            "cases": [],
            "count": 0,
            "range": "0.8-1.0"
          }
        ],
        "title": "Case Score Distribution Heatmap"
      },
      "score_timeline": {
        "chart_type": "line",
        "data": {
          "datasets": [
            {
              "backgroundColor": "rgba(59, 130, 246, 0.1)",
              "borderColor": "#8b5cf6",
              "data": [
                {
                  "case_name": "Lancaster, CA 93535 -3500 , \nAppellant/Licensee  \nv. \nDEPARTMENT OF ALCOHOLIC BEVERAGE CONTROL",
                  "x": 1,
                  "y": 0.7537760734558105
                },
                {
                  "case_name": "Luis v. Superior Court",
                  "x": 2,
                  "y": 0.7670125961303711
                }
              ],
              "fill": true,
              "label": "Similarity Score by Rank",
              "pointHoverRadius": 8,
              "pointRadius": 5,
              "tension": 0.2
            }
          ]
        },
        "options": {
          "plugins": {
            "tooltip": {
              "callbacks": {
                "label": "function(context) { return \"Score: \" + context.parsed.y.toFixed(3) + \"\\nCase: \" + context.raw.case_name; }",
                "title": "function(context) { return \"Rank #\" + context[0].parsed.x; }"
              }
            }
          },
          "responsive": true,
          "scales": {
            "x": {
              "min": 1,
              "title": {
                "display": true,
                "text": "Case Rank"
              }
            },
            "y": {
              "max": 1,
              "min": 0,
              "title": {
                "display": true,
                "text": "Similarity Score"
              }
            }
          }
        },
        "timeline_insights": {
          "consistent_quality": 2,
          "score_drop": -0.013236522674560547,
          "steep_drops": 0
        },
        "title": "Case Similarity Score Timeline"
      },
      "similarity_bar": {
        "case_details": [
          {
            "case_name": "Lancaster, CA 93535 -3500 , \nAppellant/Licensee  \nv. \nDEPARTMENT OF ALCOHOLIC BEVERAGE CONTROL",
            "download_path": "../../Data/casefiles/Ngo_v._ABC.pdf",
            "legal_principles": [
              "on November 30, 2017, documentary evidence was received and testimony concerning the violation charged was presented by Tiffany Ngo.",
              "that [the term 'malice' in such statutes] calls for more than mere intentional harm without justification or excuse; there must be a wanton and wilful (or 'reckless') disregard of the plain dangers of harm, without justification, excuse or mitigation.",
              "on November 30, 2017, documentary evidence was received and testimony concerning the violation charged was presented by Tiffany Ngo."
            ],
            "similarity_score": 0.7537760734558105,
            "topics": [
              "criminal",
              "violence",
              "drugs",
              "sentencing"
            ]
          },
          {
            "case_name": "Luis v. Superior Court",
            "download_path": "../../Data/casefiles/Luis_v._Superior_Court.pdf",
            "legal_principles": [
              "that, because the Department of Toxic Substance Control was not a direct victim of the defendant‟s crime , it was not entitled to recoup costs for remediating conditions created by a methamphetamine laboratory.",
              "would encourage public entities and other victi ms to incur out -of-pocket expenses rather than try to repair damage to the property in -house .",
              ", and, as we have noted, it is not compelled by statute."
            ],
            "similarity_score": 0.7670125961303711,
            "topics": [
              "criminal",
              "sentencing"
            ]
          }
        ],
        "chart_type": "bar",
        "data": {
          "datasets": [
            {
              "backgroundColor": [
                "#eab308",
                "#eab308"
              ],
              "borderColor": [
                "#eab308",
                "#eab308"
              ],
              "borderWidth": 1,
              "data": [
                0.7537760734558105,
                0.7670125961303711
              ],
              "label": "Similarity Score"
            }
          ],
          "labels": [
            "#1: Lancaster, CA 93535 -3500 ,...",
            "#2: Luis v. Superior Court"
          ]
        },
        "options": {
          "indexAxis": "y",
          "plugins": {
            "legend": {
              "display": false
            }
          },
          "responsive": true,
          "scales": {
            "x": {
              "beginAtZero": true,
              "max": 1.0,
              "title": {
                "display": true,
                "text": "Similarity Score"
              }
            }
          }
        },
        "title": "Case Similarity Scores"
      },
      "threshold_analysis": {
        "chart_type": "bar",
        "data": {
          "datasets": [
            {
              "backgroundColor": [
                "#22c55e",
                "#ef4444"
              ],
              "borderColor": [
                "#16a34a",
                "#dc2626"
              ],
              "borderWidth": 2,
              "data": [
                2,
                0
              ],
              "label": "Number of Cases"
            }
          ],
          "labels": [
            "Above Threshold",
            "Below Threshold"
          ]
        },
        "options": {
          "responsive": true,
          "scales": {
            "y": {
              "beginAtZero": true,
              "title": {
                "display": true,
                "text": "Number of Cases"
              }
            }
          }
        },
        "threshold_analysis": {
          "above_threshold": {
            "avg_score": 0.7603943347930908,
            "count": 2,
            "percentage": 100.0,
            "top_cases": [
              "Lancaster, CA 93535 -3500 , \nAppellant/Licensee  \nv. \nDEPARTMENT OF ALCOHOLIC BEVERAGE CONTROL",
              "Luis v. Superior Court"
            ]
          },
          "below_threshold": {
            "avg_score": 0,
            "count": 0,
            "percentage": 0.0
          },
          "recommendations": [
            "Low case count (2) - consider threshold of 0.7"
          ],
          "threshold_used": 0.75,
          "total_cases": 2
        },
        "title": "Cases Above/Below Threshold (0.75)"
      }
    },
    "has_cases": true
  },
  "case_downloads": [
    {
      "name": "Lancaster, CA 93535 -3500 , \nAppellant/Licensee  \nv. \nDEPARTMENT OF ALCOHOLIC BEVERAGE CONTROL",
      "url": "/download/Ngo_v._ABC.pdf"
    },
    {
      "name": "Luis v. Superior Court",
      "url": "/download/Luis_v._Superior_Court.pdf"
    }
  ],
  "processing_time": 12.972899,
  "query": "Can a school district be held liable under both federal environmental law (such as TSCA) and California state tort law for failing to remove hazardous chemicals like PCBs from school buildings, even when no direct health harm has yet occurred?",
  "sources": [
    "18 U.S.C. § 229 - CHEMICAL WEAPONS",
    "18 U.S.C. § 464 - ARSON",
    "California Penal Code § 1 - Access to School Premises [627 - 627.10]  ( Chapter 1.1 added by Stats. 1982, Ch. 76, Sec. 1. )",
    "California Penal Code § 1 - Effective January 1, 2003.)"
  ],
  "success": true
};

const AIAnalyticsDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI Analytics Dashboard Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            This demo shows how to visualize AI response analytics data using various chart types.
          </p>
        </div>

        {/* Case Analytics Summary */}
        <div className="mb-8">
          <CaseAnalyticsSummary 
            caseAnalytics={sampleAIResponse.case_analytics}
            className="mb-6"
          />
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsDashboard 
            caseAnalytics={sampleAIResponse.case_analytics}
            className="col-span-1 lg:col-span-2"
          />
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4">Query Information</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Query:</h4>
              <p className="text-gray-600 dark:text-gray-400">{sampleAIResponse.query}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Processing Time:</h4>
              <p className="text-gray-600 dark:text-gray-400">{sampleAIResponse.processing_time.toFixed(3)} seconds</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Case Downloads:</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                {sampleAIResponse.case_downloads.map((download, index) => (
                  <li key={index}>
                    <a 
                      href={download.url} 
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      {download.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsDemo;
