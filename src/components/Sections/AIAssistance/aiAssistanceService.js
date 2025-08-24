// AI assistance service that connects to the Express wrapper API
import { API_ENDPOINTS } from '../../../utils/apiConfig';

// API configuration
const API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:5001';
const LOCAL_API_ENDPOINTS = {
  query: API_ENDPOINTS.AI.QUERY,
  health: API_ENDPOINTS.AI.HEALTH,
  status: API_ENDPOINTS.AI.STATUS
};

// Fallback static response for testing/offline mode
const getLamisAIResponse = () => {
    return {
        answer: "Theft is the unlawful taking of another's property with the intent to permanently deprive them of it. The legal definition and penalties vary across federal and state jurisdictions.^[1]^\n\n## Federal Law\n\nUnder 18 U.S.C. Chapter 113 (Stolen Property) and Chapter 103 (Robbery and Burglary), theft includes taking property belonging to the United States^[2]^ and taking property within special maritime/territorial jurisdiction.^[3]^\n\n**Federal Penalties:**\n• Basic theft: Up to 10 years imprisonment\n• Enhanced theft (violence/federal property): Up to 15 years\n• Multiple offense enhancements available under Federal Sentencing Guidelines\n\n## California Law\n\nCalifornia defines theft under Penal Code § 490.5 as taking property without consent, including organized retail theft when acting in concert with others.^[4]^\n\n**California Penalties:**\n• Misdemeanor (value under $950): Up to 1 year county jail\n• Felony (value over $950): 16 months, 2 or 3 years under PC § 1170(h)\n• Organized retail theft: Up to 3 years under PC § 1170(h)\n\n## Case Law Analysis\n\n**People v. Reid (2016)** establishes the test for separate theft offenses versus single continuing offense, determining \"whether the evidence discloses one general intent or separate and distinct intents.\"^[5]^\n\n**People v. Van Orden** addresses separation between theft and subsequent acts, requiring a \"substantial break\" between taking and later conduct.^[6]^\n\n## Penalty Analysis\n\n**Federal Penalties:**\n• Base penalties: 0-10 years\n• Enhanced penalties: Up to 15-20 years\n• Fines: Up to $250,000 per offense\n\n**California Penalties:**\n• Misdemeanor: Up to 1 year + $1,000 fine\n• Felony: 16 months to 3 years under PC § 1170(h)\n• Enhancements for prior convictions/aggravating factors\n\n## Integrated Legal Framework\n\nThe three-layer legal framework operates as follows:\n\n1. **Federal law** establishes baseline theft definitions for interstate and federal property cases\n2. **California law** provides specific state provisions for local theft prosecution\n3. **Case law** interprets statutory application in practice\n\nFederal prosecution typically focuses on interstate theft or federal property, while California handles most local theft cases. The Reid and Van Orden decisions guide courts in determining single versus multiple offenses and related conduct.\n\n---\n\n### Sources\n\n^[1]^ [18 U.S.C. § 408 - STOLEN PROPERTY](https://www.law.cornell.edu/uscode/text/18/408)\n^[2]^ [18 U.S.C. § 2112 - Taking Property of United States](https://www.law.cornell.edu/uscode/text/18/2112)\n^[3]^ [18 U.S.C. § 2111 - Special Maritime Jurisdiction](https://www.law.cornell.edu/uscode/text/18/2111)\n^[4]^ [California Penal Code § 490.5 - Theft Definition](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=490.5&lawCode=PEN)\n^[5]^ [People v. Reid (2016)](/download/People_v._Reid.pdf) - Filed 4/20/16, Court of Appeal of California, Fifth Appellate District\n^[6]^ [People v. Van Orden](/download/California_v._Van_Orden.pdf) - Court of Appeal of California, Fourth Appellate District",
        case_downloads: [
            {
                name: "Filed 4/20/16  \n \n \n \n \nCERTIFIED FOR PARTIAL PUBLICATION* \n \nIN THE COURT OF APPEAL OF THE STATE OF CALIFORNIA  \nFIFTH APPELLATE DISTRICT  \n \n \n \nTHE PEOPLE,  \n \nPlaintiff and Respondent,  \n \n  v. \n \nMARC LYNDS REID II",
                url: "/download/People_v._Reid.pdf"
            },
            {
                name: "See Dissenting Opinion  \nCERTIFIED FOR PUBLICATION  \n \nIN THE COURT OF APPEAL OF THE STATE OF CALIFORNIA  \n \nFOURTH APPELLATE DISTRICT  \n \nDIVISION TWO  \n \n \n \nTHE PEOPLE,  \n \n Plaintiff and Respondent,  \n \nv. \n \nCHARLES SAMUEL VAN  ORDEN",
                url: "/download/California_v._Van_Orden.pdf"
            }
        ],
        sources: [
            "18 U.S.C. § 408 - STOLEN PROPERTY",
            "18 U.S.C. § 451 - ROBBERY AND BURGLARY",
            "California Penal Code § 4 - Robbery [211 - 215]  ( Chapter 4 enacted 1872. )",
            "California Penal Code § 490.5 - Approved in Proposition 36 at the"
        ],
        success: true
    };
};

// Test AI response with analytics data
const getTestAIResponse = (message) => {
  if (message.toLowerCase().includes('school district') && message.toLowerCase().includes('pcb')) {
    return {
      assistantMessage: {
        message: "**🎯 DIRECT ANSWER**\nYes, school districts can face concurrent liability under both federal environmental laws and California state tort law for PCB contamination, even without immediate health impacts. The liability stems from different legal theories across multiple jurisdictional layers.\n\n**📖 FEDERAL LAW**\nThe Toxic Substances Control Act (TSCA) creates strict federal requirements for PCB management in schools. Under 18 U.S.C. § 229, there is liability for knowingly possessing hazardous chemicals that pose risks. Penalties include:\n- Fines up to $100,000 per violation\n- Potential criminal penalties \"for any term of years\" \n- Enhanced penalties if death or serious injury results\n\n**🏛️ CALIFORNIA LAW**\nCalifornia law provides additional grounds for liability:\n- Public nuisance doctrine for dangerous conditions\n- Statutory duty to maintain safe school premises under Cal. Education Code\n- Civil penalties up to $500 per day of violation\n- Criminal misdemeanor charges possible under Cal. Penal Code § 627 for creating unsafe conditions\n\n**⚖️ CASE LAW**\nTwo relevant cases help interpret these statutes:\n\nLuis v. Superior Court (Relevance: 0.767)\n- Established that remediation costs are recoverable even without direct victims\n- Download: ../../Data/casefiles/Luis_v._Superior_Court.pdf\n\nLancaster v. Dept of ABC (Relevance: 0.754)\n- Defined \"wanton and willful disregard\" standard for hazardous conditions\n- Download: ../../Data/casefiles/Ngo_v._ABC.pdf\n\n**💰 COMPREHENSIVE PENALTY ANALYSIS**\nFederal penalties:\n- Civil: Up to $100,000 per violation\n- Criminal: Imprisonment possible\n- Enhanced penalties for knowing violations\n\nCalifornia penalties:\n- Civil: Up to $500 per day\n- Criminal: Misdemeanor charges possible\n- Additional tort damages available\n\n**🔗 INTEGRATED ANALYSIS**\nThe three layers create overlapping liability:\n1. Federal TSCA creates strict compliance requirements\n2. California law adds state-specific duties\n3. Case law enables recovery of remediation costs\n\nSchools must comply with both federal and state requirements. Failure to remove PCBs can trigger:\n- Federal environmental violations\n- State statutory violations\n- Civil tort liability\n- Criminal penalties in egregious cases\n\n**📥 CASE DOWNLOADS**\n1. Luis v. Superior Court: ../../Data/casefiles/Luis_v._Superior_Court.pdf\n2. Lancaster v. ABC: ../../Data/casefiles/Ngo_v._ABC.pdf\n\nThis layered approach shows how federal environmental law, state regulations, and case precedents create multiple, concurrent bases for school district liability regarding PCB contamination, even before direct harm occurs."
      },
      aiResponse: {
        "answer": "**🎯 DIRECT ANSWER**\nYes, school districts can face concurrent liability under both federal environmental laws and California state tort law for PCB contamination, even without immediate health impacts. The liability stems from different legal theories across multiple jurisdictional layers.\n\n**📖 FEDERAL LAW**\nThe Toxic Substances Control Act (TSCA) creates strict federal requirements for PCB management in schools. Under 18 U.S.C. § 229, there is liability for knowingly possessing hazardous chemicals that pose risks. Penalties include:\n- Fines up to $100,000 per violation\n- Potential criminal penalties \"for any term of years\" \n- Enhanced penalties if death or serious injury results\n\n**🏛️ CALIFORNIA LAW**\nCalifornia law provides additional grounds for liability:\n- Public nuisance doctrine for dangerous conditions\n- Statutory duty to maintain safe school premises under Cal. Education Code\n- Civil penalties up to $500 per day of violation\n- Criminal misdemeanor charges possible under Cal. Penal Code § 627 for creating unsafe conditions\n\n**⚖️ CASE LAW**\nTwo relevant cases help interpret these statutes:\n\nLuis v. Superior Court (Relevance: 0.767)\n- Established that remediation costs are recoverable even without direct victims\n- Download: ../../Data/casefiles/Luis_v._Superior_Court.pdf\n\nLancaster v. Dept of ABC (Relevance: 0.754)\n- Defined \"wanton and willful disregard\" standard for hazardous conditions\n- Download: ../../Data/casefiles/Ngo_v._ABC.pdf\n\n**💰 COMPREHENSIVE PENALTY ANALYSIS**\nFederal penalties:\n- Civil: Up to $100,000 per violation\n- Criminal: Imprisonment possible\n- Enhanced penalties for knowing violations\n\nCalifornia penalties:\n- Civil: Up to $500 per day\n- Criminal: Misdemeanor charges possible\n- Additional tort damages available\n\n**🔗 INTEGRATED ANALYSIS**\nThe three layers create overlapping liability:\n1. Federal TSCA creates strict compliance requirements\n2. California law adds state-specific duties\n3. Case law enables recovery of remediation costs\n\nSchools must comply with both federal and state requirements. Failure to remove PCBs can trigger:\n- Federal environmental violations\n- State statutory violations\n- Civil tort liability\n- Criminal penalties in egregious cases\n\n**📥 CASE DOWNLOADS**\n1. Luis v. Superior Court: ../../Data/casefiles/Luis_v._Superior_Court.pdf\n2. Lancaster v. ABC: ../../Data/casefiles/Ngo_v._ABC.pdf\n\nThis layered approach shows how federal environmental law, state regulations, and case precedents create multiple, concurrent bases for school district liability regarding PCB contamination, even before direct harm occurs.",
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
                    "borderColor": "#ffffff",
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
                    "borderColor": "#3b82f6",
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
      },
      userMessage: {
        message: message,
        meta: { role: 'user' }
      }
    };
  }
  return null;
};

export const aiAssistanceService = {
    // Start a new chat session - now returns static session
    startSession: async () => {
        try {
            // Generate session ID using same logic as frontend
            const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            return {
                sessionId: sessionId,
                created: new Date().toISOString(),
                success: true
            };
        } catch (error) {
            throw error;
        }
    },

    // Send a message and get AI response from the API
    sendMessage: async (sessionId, message) => {
        try {
            // Replace verbose logs with DEV-guarded no-ops
            // console.log('Lamis AI responding to:', { sessionId, message });
            
            // Try to get response from the API
            try {
                const apiResponse = await fetch(LOCAL_API_ENDPOINTS.query, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: message,
                        include_ai_response: true,
                        include_graphs: true
                    })
                });

                if (!apiResponse.ok) {
                    throw new Error(`API request failed: ${apiResponse.status} ${apiResponse.statusText}`);
                }

                const apiData = await apiResponse.json();
                // console.log('API response received:', apiData);

                const response = {
                    userMessage: {
                        message: message,
                        sender: 'user',
                        meta: { role: 'user' },
                        timestamp: new Date().toISOString()
                    },
                    assistantMessage: {
                        message: apiData.answer || 'No response from AI',
                        sender: 'assistant',
                        meta: { role: 'assistant' },
                        timestamp: new Date().toISOString()
                    },
                    aiResponse: apiData,
                    session: {
                        sessionId: sessionId
                    }
                };
                
                // console.log('Lamis AI response from API:', response);
                return response;

            } catch (apiError) {
                console.error('API request failed, falling back to static response:', apiError);
                
                // Fallback to static response if API fails
                const staticResponse = getLamisAIResponse();
                
                const response = {
                    userMessage: {
                        message: message,
                        sender: 'user',
                        meta: { role: 'user' },
                        timestamp: new Date().toISOString()
                    },
                    assistantMessage: {
                        message: staticResponse.answer,
                        sender: 'assistant',
                        meta: { role: 'assistant' },
                        timestamp: new Date().toISOString()
                    },
                    aiResponse: {
                        query: message,
                        answer: staticResponse.answer,
                        processing_time: 1.2,
                        case_analytics: {
                            total_cases: staticResponse.case_downloads.length,
                            avg_similarity: 0.85,
                            cases: staticResponse.case_downloads.map((caseItem, index) => ({
                                case_name: caseItem.name.split('\n')[0] || `Case ${index + 1}`,
                                similarity_score: 0.85 - (index * 0.05),
                                relevance_explanation: "Relevant to theft law analysis",
                                download_url: caseItem.url
                            })),
                            federal_statutes: staticResponse.sources.filter(s => s.includes('U.S.C.')),
                            state_statutes: staticResponse.sources.filter(s => s.includes('California')),
                            case_downloads: staticResponse.case_downloads
                        },
                        sources: staticResponse.sources,
                        success: staticResponse.success
                    },
                    session: {
                        sessionId: sessionId
                    }
                };
                
                // console.log('Lamis AI fallback response:', response);
                return response;
            }
        } catch (error) {
            console.error('Lamis AI error:', error);
            throw error;
        }
    },

    // Send a message with streaming response simulation
    sendMessageWithStreaming: async (sessionId, message, onChunk) => {
        try {
            // Replace verbose logs with DEV-guarded no-ops
            // console.log('Lamis AI streaming response to:', { sessionId, message });
            
            // Try to get response from the API
            try {
                const apiResponse = await fetch(LOCAL_API_ENDPOINTS.query, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: message,
                        include_ai_response: true,
                        include_graphs: true
                    })
                });

                if (!apiResponse.ok) {
                    throw new Error(`API request failed: ${apiResponse.status} ${apiResponse.statusText}`);
                }

                const apiData = await apiResponse.json();
                // console.log('API response received for streaming:', apiData);

                const fullResponse = apiData.answer || 'No response from AI';
                
                // Simulate streaming by sending the response in chunks
                const words = fullResponse.split(' ');
                let currentResponse = '';
                
                for (let i = 0; i < words.length; i++) {
                    currentResponse += (i > 0 ? ' ' : '') + words[i];
                    onChunk(currentResponse);
                    // Add a small delay to simulate real streaming
                    await new Promise(resolve => setTimeout(resolve, 30));
                }
                
                // Return the complete response structure
                const response = {
                    userMessage: {
                        message: message,
                        sender: 'user',
                        meta: { role: 'user' },
                        timestamp: new Date().toISOString()
                    },
                    assistantMessage: {
                        message: fullResponse,
                        sender: 'assistant',
                        meta: { role: 'assistant' },
                        timestamp: new Date().toISOString()
                    },
                    aiResponse: apiData,
                    session: {
                        sessionId: sessionId
                    }
                };
                
                return response;

            } catch (apiError) {
                console.error('API request failed for streaming, falling back to static response:', apiError);
                
                // Fallback to static response if API fails
                const staticResponse = getLamisAIResponse();
                const fullResponse = staticResponse.answer;
                
                // Simulate streaming by sending the response in chunks
                const words = fullResponse.split(' ');
                let currentResponse = '';
                
                for (let i = 0; i < words.length; i++) {
                    currentResponse += (i > 0 ? ' ' : '') + words[i];
                    onChunk(currentResponse);
                    // Add a small delay to simulate real streaming
                    await new Promise(resolve => setTimeout(resolve, 30));
                }
                
                // Return the complete response structure
                const response = {
                    userMessage: {
                        message: message,
                        sender: 'user',
                        meta: { role: 'user' },
                        timestamp: new Date().toISOString()
                    },
                    assistantMessage: {
                        message: staticResponse.answer,
                        sender: 'assistant',
                        meta: { role: 'assistant' },
                        timestamp: new Date().toISOString()
                    },
                    aiResponse: {
                        query: message,
                        answer: staticResponse.answer,
                        processing_time: 1.2,
                        case_analytics: {
                            total_cases: staticResponse.case_downloads.length,
                            avg_similarity: 0.85,
                            cases: staticResponse.case_downloads.map((caseItem, index) => ({
                                case_name: caseItem.name.split('\n')[0] || `Case ${index + 1}`,
                                similarity_score: 0.85 - (index * 0.05),
                                relevance_explanation: "Relevant to theft law analysis",
                                download_url: caseItem.url
                            })),
                            federal_statutes: staticResponse.sources.filter(s => s.includes('U.S.C.')),
                            state_statutes: staticResponse.sources.filter(s => s.includes('California')),
                            case_downloads: staticResponse.case_downloads
                        },
                        sources: staticResponse.sources,
                        success: staticResponse.success
                    },
                    session: {
                        sessionId: sessionId
                    }
                };
                
                return response;
            }
        } catch (error) {
            console.error('Lamis AI streaming error:', error);
            throw error;
        }
    },

    // Get chat history for a session - returns empty for now
    getChatHistory: async (sessionId) => {
        try {
            return {
                messages: [],
                sessionId: sessionId,
                success: true
            };
        } catch (error) {
            throw error;
        }
    },

    // Get all chat sessions for the user - returns empty for now
    getUserSessions: async () => {
        try {
            return {
                sessions: [],
                success: true
            };
        } catch (error) {
            throw error;
        }
    }
};
