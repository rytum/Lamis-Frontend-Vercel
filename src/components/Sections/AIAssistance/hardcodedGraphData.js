// Hardcoded chart data for chartDashboard fallback
export const hardcodedGraphData = {
  score_distribution: {
    title: 'Case Score Distribution',
    data: {
      datasets: [
        {
          backgroundColor: [
            '#22c55e',
            '#eab308',
            '#f97316',
            '#ef4444',
            '#991b1b'
          ],
          borderColor: '#ffffff',
          borderWidth: 2,
          data: [2]
        }
      ],
      labels: ['Medium-High (0.6-0.8)']
    },
    options: {
      plugins: { legend: { position: 'bottom' } },
      responsive: true
    }
  },
  score_heatmap: {
    title: 'Case Score Distribution Heatmap',
    data: {
      matrix: [[0], [0], [0], [2], [0]],
      max_value: 2,
      x_labels: ['Cases'],
      y_labels: [
        '0.0-0.2',
        '0.2-0.4',
        '0.4-0.6',
        '0.6-0.8',
        '0.8-1.0'
      ]
    },
    description: 'Visualization of how cases are distributed across different similarity score ranges',
    heatmap_details: [
      { cases: [], count: 0, range: '0.0-0.2' },
      { cases: [], count: 0, range: '0.2-0.4' },
      { cases: [], count: 0, range: '0.4-0.6' },
      {
        cases: [
          'Lancaster, CA 93535 -3500 , \nAppellant/Licensee  \nv. \nDEPARTMENT OF ALCOHOLIC BEVERAGE CONTROL',
          'Luis v. Superior Court'
        ],
        count: 2,
        range: '0.6-0.8'
      },
      { cases: [], count: 0, range: '0.8-1.0' }
    ]
  },
  score_timeline: {
    title: 'Case Similarity Score Timeline',
    data: {
      datasets: [
        {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: '#3b82f6',
          data: [
            {
              case_name: 'Lancaster, CA 93535 -3500 , \nAppellant/Licensee  \nv. \nDEPARTMENT OF ALCOHOLIC BEVERAGE CONTROL',
              x: 1,
              y: 0.7537760734558105
            },
            {
              case_name: 'Luis v. Superior Court',
              x: 2,
              y: 0.7670125961303711
            }
          ],
          fill: true,
          label: 'Similarity Score by Rank',
          pointHoverRadius: 8,
          pointRadius: 5,
          tension: 0.2
        }
      ]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Score: ' + context.parsed.y.toFixed(3) + '\nCase: ' + context.raw.case_name;
            },
            title: function(context) {
              return 'Rank #' + context[0].parsed.x;
            }
          }
        }
      },
      responsive: true,
      scales: {
        x: {
          min: 1,
          title: { display: true, text: 'Case Rank' }
        },
        y: {
          max: 1,
          min: 0,
          title: { display: true, text: 'Similarity Score' }
        }
      }
    }
  },
  similarity_bar: {
    title: 'Case Similarity Scores',
    data: {
      datasets: [
        {
          backgroundColor: ['#eab308', '#eab308'],
          borderColor: ['#eab308', '#eab308'],
          borderWidth: 1,
          data: [0.7537760734558105, 0.7670125961303711],
          label: 'Similarity Score'
        }
      ],
      labels: [
        '#1: Lancaster, CA 93535 -3500 ,...',
        '#2: Luis v. Superior Court'
      ]
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          max: 1.0,
          title: { display: true, text: 'Similarity Score' }
        }
      }
    }
  },
  threshold_analysis: {
    title: 'Cases Above/Below Threshold (0.75)',
    data: {
      datasets: [
        {
          backgroundColor: ['#22c55e', '#ef4444'],
          borderColor: ['#16a34a', '#dc2626'],
          borderWidth: 2,
          data: [2, 0],
          label: 'Number of Cases'
        }
      ],
      labels: ['Above Threshold', 'Below Threshold']
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Cases' }
        }
      }
    }
  }
};
