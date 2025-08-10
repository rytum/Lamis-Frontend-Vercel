import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../contexts/ThemeContext';
import CollapsiblePanel from '../../../ui/CollapsiblePanel';
import {
  IconTimeline,
  IconClipboardText,
  IconBinaryTree2,
  IconScale,
  IconBuilding,
  IconChartBar,
  IconShieldCheck,
  IconMessage2,
  IconSparkles,
} from '@tabler/icons-react';

const Card = ({ title, children, className = '' }) => (
  <div className={`rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-4 sm:p-5 ${className}`}>
    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h3>
    <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>
  </div>
);

const FeatureCard = ({ Icon, title, children }) => (
  <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm">
    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-3">
      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    </div>
    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h4>
    <p className="text-sm text-gray-700 dark:text-gray-300">{children}</p>
  </div>
);

const BenefitCard = ({ Icon, title, children }) => (
  <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-md bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
        <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </div>
      <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h5>
    </div>
    <p className="text-sm text-gray-700 dark:text-gray-300">{children}</p>
  </div>
);

const WorkflowSection = () => {
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const diagramContainerRef = useRef(null);

  // --- SVG Styling and Layout Constants ---
  const isDark = resolvedTheme === 'dark';
  const colors = {
    bgCanvas: isDark ? '#0a0a0a' : '#f9fafb',
    nodeFill: isDark ? '#171717' : '#ffffff',
    nodeStroke: isDark ? '#A78BFA' : '#7C3AED',
    text: isDark ? '#E5E7EB' : '#111827',
    subText: isDark ? '#9ca3af' : '#4b5563',
    diamondFill: isDark ? '#0f0f10' : '#ffffff',
    highlightFill: isDark ? 'rgba(250, 204, 21, 0.12)' : '#FFFBEB',
    highlightStroke: isDark ? '#854D0E' : '#FDE68A',
    gridDot: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
  };

  const nodeW = 180;
  const nodeH = 44;
  const diamondSize = 80;
  const hSpacing = 60;
  const vSpacing = 50;
  const midY = 220; // Centerline for the main flow, gives more vertical room

  // --- SVG Shape Components (Unchanged as requested) ---
  const NodeBox = ({ x, y, w = nodeW, h = nodeH, label, rounded = true, highlight = false }) => (
    <g>
      <rect 
        x={x} y={y} width={w} height={h} rx={rounded ? 6 : 0}
        fill={highlight ? colors.highlightFill : colors.nodeFill}
        stroke={highlight ? colors.highlightStroke : colors.nodeStroke} strokeWidth={1.5} 
      />
      <text 
        x={x + w / 2} 
        y={y + h / 2} 
        fill={highlight ? (isDark ? '#FDE68A' : '#854D0E') : colors.text}
        textAnchor="middle" 
        dominantBaseline="middle" 
        fontSize="11" 
        fontWeight="500"
      >
        {Array.isArray(label) ? label.map((line, idx) => (
          <tspan key={idx} x={x + w / 2} dy={idx === 0 ? (label.length > 1 ? '-0.5em' : '0') : '1.2em'}>{line}</tspan>
        )) : label}
      </text>
    </g>
  );

  const Diamond = ({ cx, cy, size = diamondSize, label }) => (
    <g>
      <rect 
        x={cx - size / 2} y={cy - size / 2} 
        width={size} height={size} 
        transform={`rotate(45 ${cx} ${cy})`}
        fill={colors.diamondFill} stroke={colors.nodeStroke} strokeWidth={1.5} rx={8} 
      />
      <text 
        x={cx} y={cy} fill={colors.text} 
        textAnchor="middle" dominantBaseline="middle" 
        fontSize="11" fontWeight="500"
      >
        {Array.isArray(label) ? label.map((line, idx) => (
          <tspan key={idx} x={cx} dy={idx === 0 ? (label.length > 1 ? '-0.5em' : '0') : '1.2em'}>{line}</tspan>
        )) : label}
      </text>
    </g>
  );
  
  const Arrow = ({ from, to, label, edge = 'middle' }) => {
    const fromX = from.x + (from.w || nodeW);
    const fromY = from.y + (from.h || nodeH) / 2;
    const toX = to.x;
    let toY;

    switch(edge) {
      case 'top': toY = to.y; break;
      case 'bottom': toY = to.y + (to.h || nodeH); break;
      default: toY = to.y + (to.h || nodeH) / 2; break;
    }
    
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;

    return (
      <g>
        <path d={`M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`} 
              stroke={colors.nodeStroke} strokeWidth={1.5} fill="none" markerEnd="url(#arrow)" />
        {label && (
           <g>
            <rect x={midX - 35} y={midY - 10} width="70" height="20" fill={colors.bgCanvas} />
            <text x={midX} y={midY} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={500} fill={colors.subText}>
              {label}
            </text>
          </g>
        )}
      </g>
    );
  };

  // --- Main Component Return ---
  return (
    <div className="min-h-[calc(100vh-160px)] bg-gray-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 pt-28 sm:pt-32 pb-10 sm:pb-12">
        {/* Hero Section */}
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">Workflow Automation</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center">
            Streamline your legal process for vandalism cases with our intelligent automated system.<br /> From client intake to case strategy, we've got you covered.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium" onClick={() => window.open('https://calendly.com/vishalydv202/30min', '_blank')}>
              Request a Demo
            </button>
            <button type="button" onClick={() => navigate('/learn')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium">
              Learn More
            </button>
          </div>
        </header>

        {/* Collapsible Workflow Diagram */}
        <div className="mb-6 sm:mb-8">
          <CollapsiblePanel title="Case Workflow Diagram" Icon={IconTimeline} defaultOpen>
            <div className={`relative rounded-lg border border-gray-200 dark:border-neutral-800 p-3 sm:p-4 ${isDark ? 'bg-neutral-950' : 'bg-gray-50'}`}>
              <div ref={diagramContainerRef} className="workflow-scroll overflow-x-auto overflow-y-hidden">
                <div className="min-w-[2000px] min-h-[450px]">
                  <svg width="2000" height="450" viewBox="0 0 2000 450" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
                        <path d="M0,0 L8,4 L0,8 Z" fill={colors.nodeStroke} />
                      </marker>
                      <pattern id="gridDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="1" fill={colors.gridDot} />
                      </pattern>
                    </defs>
                    <rect x="0" y="0" width="2000" height="450" fill="url(#gridDots)" />
                    
                    {/* Define Node Positions with corrected alignment and spacing */}
                    {(() => {
                        const positions = {
                            start: { x: 30, y: midY - nodeH / 2, label: ['Start: Attorney Hired'] },
                            intake: { x: 30 + 1 * (nodeW + hSpacing), y: midY - nodeH / 2, label: 'Initial Client Intake' },
                            gather: { x: 30 + 2 * (nodeW + hSpacing), y: midY - nodeH / 2, label: 'Gather Case Facts' },
                            assess: { x: 30 + 3 * (nodeW + hSpacing) + 20, y: midY - diamondSize / 2, type: 'diamond', label: ['Legal Assessment:', 'Criminal or Civil?'] },
                            
                            criminalRole: { x: 30 + 4 * (nodeW + hSpacing) + 40, y: midY - vSpacing - diamondSize, type: 'diamond', label: 'Client Role?' },
                            defensePath: { x: 30 + 5 * (nodeW + hSpacing) + 60, y: midY - vSpacing * 2.2 - nodeH, label: 'Criminal Defense Path' },
                            damageAmount: { x: 30 + 6 * (nodeW + hSpacing) + 80, y: midY - vSpacing * 2.2 - diamondSize, type: 'diamond', label: 'Damage Amount' },
                            misdemeanor: { x: 30 + 7 * (nodeW + hSpacing) + 100, y: midY - vSpacing * 3.5 - nodeH, label: 'Misdemeanor' },
                            felony: { x: 30 + 7 * (nodeW + hSpacing) + 100, y: midY - vSpacing * 1.5 - nodeH, label: 'Felony/Wobbler' },
                            victimPath: { x: 30 + 5 * (nodeW + hSpacing) + 60, y: midY - nodeH/2, label: 'Victim Assistance Path' },
                            
                            civilRole: { x: 30 + 4 * (nodeW + hSpacing) + 40, y: midY + vSpacing, type: 'diamond', label: 'Client Role?' },
                            plaintiffPath: { x: 30 + 5 * (nodeW + hSpacing) + 60, y: midY + vSpacing + diamondSize / 2 - nodeH / 2, label: 'Civil Plaintiff Path' },
                            civilDefensePath: { x: 30 + 5 * (nodeW + hSpacing) + 60, y: midY + 2 * vSpacing + diamondSize + 10, label: 'Civil Defense Path' },
                        };

                        return (
                            <g>
                                {/* Render Nodes */}
                                {Object.values(positions).map((p, i) => 
                                    p.type === 'diamond' ? 
                                    <Diamond key={`d-${i}`} cx={p.x + diamondSize/2} cy={p.y + diamondSize/2} label={p.label} /> : 
                                    <NodeBox key={`n-${i}`} x={p.x} y={p.y} label={p.label} />
                                )}

                                {/* Render Arrows with corrected parameters */}
                                <Arrow from={positions.start} to={positions.intake} />
                                <Arrow from={positions.intake} to={positions.gather} />
                                <Arrow from={positions.gather} to={{...positions.assess, h: diamondSize}} />
                                
                                <Arrow from={{...positions.assess, w: diamondSize, h: diamondSize}} to={{...positions.criminalRole, h: diamondSize}} label="Criminal" />
                                <Arrow from={{...positions.criminalRole, w: diamondSize, h: diamondSize}} to={positions.defensePath} label="Defendant" />
                                <Arrow from={positions.defensePath} to={{...positions.damageAmount, h: diamondSize}} />
                                <Arrow from={{...positions.damageAmount, w: diamondSize, h: diamondSize}} to={positions.misdemeanor} label="≤ $400" />
                                <Arrow from={{...positions.damageAmount, w: diamondSize, h: diamondSize}} to={positions.felony} label="> $400" />
                                
                                <Arrow from={{...positions.criminalRole, w: diamondSize, h: diamondSize}} to={positions.victimPath} label="Victim" />
                                
                                <Arrow from={{...positions.assess, w: diamondSize, h: diamondSize}} to={{...positions.civilRole, h: diamondSize}} label="Civil" />
                                <Arrow from={{...positions.civilRole, w: diamondSize, h: diamondSize}} to={positions.plaintiffPath} label="Plaintiff" />
                                <Arrow from={{...positions.civilRole, w: diamondSize, h: diamondSize}} to={positions.civilDefensePath} label="Defendant" />
                            </g>
                        );
                    })()}

                  </svg>
                </div>
              </div>
            </div>
          </CollapsiblePanel>
        </div>
        
        {/* Info Cards, Testimonials, Features, etc. (Unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card title="Client Info">
            <div className="space-y-1"><div><span className="font-medium">Case Name:</span> Miller v. City Parks</div><div><span className="font-medium">Case Number:</span> CV-2024-1839</div></div>
          </Card>
          <Card title="Completed Tasks">
            <ul className="space-y-2">
              {['Attorney Hired','Client Intake','Gather Facts'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 12.086l6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd"/></svg></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Current Status">
            <div className="rounded-lg border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50 dark:bg-yellow-900/20 p-3">
              <div className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Legal Assessment</div>
              <p className="text-sm text-yellow-800/90 dark:text-yellow-200">AI is analyzing case facts to determine if the path is criminal or civil.</p>
            </div>
          </Card>
          <Card title="Next Step">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block w-3 h-3 rounded-full border-gray-300 dark:border-neutral-700" />
                <span>Determine Client Role</span>
              </li>
            </ul>
          </Card>
        </div>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-5">Trusted by Leading Law Firms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
            <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm h-full flex flex-col">
              <p className="text-gray-700 dark:text-gray-300 italic mb-4 flex-1">"Lamis AI's live workflow is a transparency breakthrough. Our clients feel more connected and informed, seeing their case progress in real-time."</p>
              <div className="flex items-center gap-3 mt-auto pt-2">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">JS</div>
                <div><div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Jessica Miller</div><div className="text-xs text-gray-600 dark:text-gray-400">Partner, Miller & Associates</div></div>
              </div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-5 sm:p-6 shadow-sm h-full flex flex-col">
              <p className="text-gray-700 dark:text-gray-300 italic mb-4 flex-1">"The integrated case management and workflow visualization is brilliant. It not only streamlines our internal processes but also provides clients with an unprecedented level of clarity."</p>
              <div className="flex items-center gap-3 mt-auto pt-2">
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">DT</div>
                <div><div className="text-sm font-semibold text-gray-900 dark:text-gray-100">David Chen</div><div className="text-xs text-gray-600 dark:text-gray-400">Lead Attorney, Chen Legal Group</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="mb-10">
          <h2 className="text-xl text-center sm:text-2xl font-bold text-gray-900 dark:text-white mb-8">Key Features of the Workflow Automation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard Icon={IconClipboardText} title="Initial Assessment and Intake">
              Systematic client intake gathers essential information like nature of vandalism, damage amount, evidence, police involvement, and insurance claims for proper case categorization.
            </FeatureCard>
            <FeatureCard Icon={IconBinaryTree2} title="Intelligent Case Classification">
              Automatically determines if a case is criminal or civil, and for criminal cases under California Penal Code § 594, differentiates between misdemeanor and felony charges.
            </FeatureCard>
            <FeatureCard Icon={IconScale} title="Jurisdictional Routing">
              Sophisticated jurisdiction determination flags cases that may fall under federal jurisdiction, ensuring they are prosecuted under the correct laws like 18 U.S.C. § 1361.
            </FeatureCard>
            <FeatureCard Icon={IconSparkles} title="Role-Based Process Branching">
              Creates distinct pathways for Criminal Defense, Victim Assistance, and Civil Plaintiff to tailor the process to the client's specific needs.
            </FeatureCard>
            <FeatureCard Icon={IconBuilding} title="Automated Court Selection">
              For civil cases, the system automatically routes to the appropriate court—Small Claims, Superior Court—based on the damage amounts involved.
            </FeatureCard>
            <FeatureCard Icon={IconChartBar} title="Real-Time Progress Tracking">
              Clients and attorneys can see the live status of their case directly on the workflow, including completed, active, and upcoming steps.
            </FeatureCard>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-4 sm:mb-8">
          <h2 className="text-xl text-center sm:text-2xl font-bold text-gray-900 dark:text-white mb-8">Workflow Automation Benefits for Law Firms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <BenefitCard Icon={IconSparkles} title="Enhanced Efficiency">
              The automated decision trees reduce manual case assessment time while ensuring comprehensive evaluation of all relevant factors.
            </BenefitCard>
            <BenefitCard Icon={IconMessage2} title="Improved Client Communication">
              Visual flowcharts provide clear explanations of case progression and potential outcomes, enhancing attorney–client relationships.
            </BenefitCard>
            <BenefitCard Icon={IconShieldCheck} title="Risk Management">
              Systematic evaluation of jurisdiction, case classification, and strategic options minimizes the risk of procedural errors or missed opportunities.
            </BenefitCard>
            <BenefitCard Icon={IconSparkles} title="Standardized Quality">
              Consistent application of legal standards across cases ensures uniform quality of representation.
            </BenefitCard>
          </div>
        </section>

      </div>
    </div>
  );
};

export default WorkflowSection;