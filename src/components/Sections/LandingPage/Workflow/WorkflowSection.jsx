import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';

export default function WorkflowSection() {
  const { resolvedTheme } = useTheme();
  const [draggedItem, setDraggedItem] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const workflowStepsRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const handleDragStart = (e) => {
    setDraggedItem(e.target);
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    setTimeout(() => {
      e.target.classList.add('opacity-50', 'scale-105', 'shadow-2xl', 'cursor-grabbing');
    }, 0);
  };

  const handleDragEnd = (e) => {
    if (draggedItem) {
      draggedItem.classList.remove('opacity-50', 'scale-105', 'shadow-2xl', 'cursor-grabbing');
    }
    document.querySelectorAll('[draggable]').forEach(item => 
      item.classList.remove('bg-purple-500/20', 'border-purple-400')
    );
    setDraggedItem(null);
  };

  const allowDrop = (e) => {
    e.preventDefault();
    const dropTarget = getDropTarget(e.target);
    if (dropTarget) {
      dropTarget.classList.add('bg-purple-500/20', 'border-purple-400');
    }
  };

  const getDropTarget = (element) => {
    while (element && !element.hasAttribute('draggable')) {
      element = element.parentElement;
    }
    return element;
  };

  const handleDragLeave = (e) => {
    const dropTarget = getDropTarget(e.target);
    if (dropTarget) {
      dropTarget.classList.remove('bg-purple-500/20', 'border-purple-400');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropTarget = getDropTarget(e.target);
    if (dropTarget && draggedItem !== dropTarget) {
      const parent = dropTarget.parentNode;
      const dropTargetNextSibling = dropTarget.nextSibling === draggedItem ? dropTarget : dropTarget.nextSibling;
      parent.insertBefore(draggedItem, dropTargetNextSibling);
    }
    if (draggedItem) {
      draggedItem.classList.remove('opacity-50', 'scale-105', 'shadow-2xl', 'cursor-grabbing');
    }
    document.querySelectorAll('[draggable]').forEach(item => 
      item.classList.remove('bg-purple-500/20', 'border-purple-400')
    );
    setDraggedItem(null);
  };

  useEffect(() => {
    const workflowSteps = workflowStepsRef.current;
    if (workflowSteps) {
      workflowSteps.addEventListener('dragover', allowDrop);
      workflowSteps.addEventListener('dragleave', handleDragLeave);
      workflowSteps.addEventListener('drop', handleDrop);
      workflowSteps.addEventListener('dragend', handleDragEnd);

      return () => {
        workflowSteps.removeEventListener('dragover', allowDrop);
        workflowSteps.removeEventListener('dragleave', handleDragLeave);
        workflowSteps.removeEventListener('drop', handleDrop);
        workflowSteps.removeEventListener('dragend', handleDragEnd);
      };
    }
  }, [draggedItem]);

  return (
    <div className={`min-h-screen font-['Inter',sans-serif] pt-20 ${
      resolvedTheme === 'dark' 
        ? 'bg-black text-white' 
        : 'bg-white text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="text-center mb-8 md:mb-16">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-2 ${
            resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Workflow Automation
          </h1>
          <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4 ${
            resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Simplify Your Workflow from Intake to Strategy <br/>
Let our intelligent system automate the process, so you can deliver results faster
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300" 
              href="#"
            >
              Request a Demo
            </a>
            <a 
              className={`${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300`}
              href="#"
            >
              Learn More
            </a>
          </div>
        </header>

        <main>
          {/* Workflow Diagram Section */}
          <section className="mb-12 md:mb-20">
                                                   <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-white'} rounded-lg shadow-lg group relative`}>
               
               <div 
                 className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 cursor-pointer gap-4" 
                 onClick={() => setIsCollapsed(!isCollapsed)}
               >
                 <h2 className={`text-xl sm:text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Case Workflow Diagram</h2>
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                   <div className={`text-xs sm:text-sm flex items-center gap-2 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                     <span className="material-icons text-sm sm:text-base">drag_indicator</span> 
                     <span className="hidden sm:inline">Drag to reorder tasks</span>
                     <span className="sm:hidden">Drag to reorder</span>
                   </div>
                   <button className={`flex items-center transition-colors ${resolvedTheme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} type="button">
                    <span className="text-xs sm:text-sm font-semibold mr-2">
                      {isCollapsed ? 'Expand' : 'Collapse'}
                    </span>
                    <span className={`material-icons transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                      expand_less
                    </span>
                  </button>
                </div>
              </div>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isCollapsed ? 'max-h-0' : 'max-h-[1000px]'
                }`}
              >
                <div className="w-full">
                  <div className="flex items-center p-2 sm:p-4 md:p-8 overflow-x-auto scrollbar-hide min-h-[300px] sm:min-h-[400px] justify-start" ref={scrollContainerRef}>
                    <div className="flex items-stretch space-x-1 sm:space-x-2 md:space-x-4 min-w-max px-2 sm:px-4" ref={workflowStepsRef}>
                      {/* Start: Attorney Hired */}
                      <div className="flex items-center" draggable="true" onDragStart={handleDragStart}>
                                                 <div className="bg-purple-500/30 border-purple-500 ring-2 ring-purple-500/50 text-white border border-gray-600 rounded-lg p-2 md:p-3 text-center text-xs md:text-sm shadow-md flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] min-w-[120px] sm:min-w-[140px] md:min-w-[160px] w-28 sm:w-36 md:w-48 relative transition-all duration-300 cursor-grab hover:scale-105 group/tooltip">
                           <p className="font-semibold relative z-10 text-xs sm:text-sm">Start: Attorney Hired</p>
                                                                                                               <div className={`invisible opacity-0 absolute z-10 w-48 sm:w-64 p-2 sm:p-3 -mt-20 sm:-mt-24 left-1/2 -translate-x-1/2 text-xs sm:text-sm leading-normal rounded-lg shadow-lg transition-opacity duration-300 group-hover/tooltip:visible group-hover/tooltip:opacity-100 ${resolvedTheme === 'dark' ? 'bg-black text-white' : 'bg-gray-800 text-white'}`}>
                               The process begins when a client retains legal counsel for a vandalism incident.
                               <div className={`absolute w-3 h-3 rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2 ${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-800'}`}></div>
                           </div>
                         </div>
                        <div className="relative h-full flex items-center w-6 sm:w-8 md:w-16">
                          <div className="h-0.5 bg-purple-500 w-full"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-purple-500 text-xs sm:text-sm">►</div>
                        </div>
                      </div>

                      {/* Gather Case Facts */}
                      <div className="flex items-center" draggable="true" onDragStart={handleDragStart}>
                                                 <div className="bg-purple-500/30 border-purple-500 ring-2 ring-purple-500/50 text-white border border-gray-600 rounded-lg p-2 md:p-3 text-center text-xs md:text-sm shadow-md flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] min-w-[120px] sm:min-w-[140px] md:min-w-[160px] w-28 sm:w-36 md:w-48 relative transition-all duration-300 cursor-grab hover:scale-105 group/tooltip">
                           <p className="text-xs sm:text-sm">Gather Case Facts</p>
                                                                                                               <div className={`invisible opacity-0 absolute z-10 w-48 sm:w-64 p-2 sm:p-3 -mt-20 sm:-mt-24 left-1/2 -translate-x-1/2 text-xs sm:text-sm leading-normal rounded-lg shadow-lg transition-opacity duration-300 group-hover/tooltip:visible group-hover/tooltip:opacity-100 ${resolvedTheme === 'dark' ? 'bg-black text-white' : 'bg-gray-800 text-white'}`}>
                               Systematically collect evidence like photos, police reports, and repair estimates.
                               <div className={`absolute w-3 h-3 rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2 ${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-800'}`}></div>
                           </div>
                         </div>
                        <div className="relative h-full flex items-center w-6 sm:w-8 md:w-16">
                          <div className="h-0.5 bg-purple-500 w-full"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-purple-500 text-xs sm:text-sm">►</div>
                        </div>
                      </div>

                      {/* Initial Client Intake */}
                      <div className="flex items-center" draggable="true" onDragStart={handleDragStart}>
                                                 <div className="bg-purple-500/30 border-purple-500 ring-2 ring-purple-500/50 text-white border border-gray-600 rounded-lg p-2 md:p-3 text-center text-xs md:text-sm shadow-md flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] min-w-[120px] sm:min-w-[140px] md:min-w-[160px] w-28 sm:w-36 md:w-48 relative transition-all duration-300 cursor-grab hover:scale-105 group/tooltip">
                           <p className="text-xs sm:text-sm">Initial Client Intake</p>
                                                                                                               <div className={`invisible opacity-0 absolute z-10 w-48 sm:w-64 p-2 sm:p-3 -mt-20 sm:-mt-24 left-1/2 -translate-x-1/2 text-xs sm:text-sm leading-normal rounded-lg shadow-lg transition-opacity duration-300 group-hover/tooltip:visible group-hover/tooltip:opacity-100 ${resolvedTheme === 'dark' ? 'bg-black text-white' : 'bg-gray-800 text-white'}`}>
                               Lamis AI guides a structured interview to collect all pertinent details from the client.
                               <div className={`absolute w-3 h-3 rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2 ${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-800'}`}></div>
                           </div>
                         </div>
                        <div className="relative h-full flex items-center w-6 sm:w-8 md:w-16">
                          <div className="h-0.5 bg-purple-500 w-full"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-purple-500 text-xs sm:text-sm">►</div>
                        </div>
                      </div>

                      {/* Legal Assessment: Criminal or Civil? */}
                      <div className="flex items-center" draggable="true" onDragStart={handleDragStart}>
                                                 <div className="bg-yellow-500/30 border-yellow-400 ring-4 ring-yellow-400/50 text-white shadow-lg shadow-yellow-500/20 border border-gray-600 rounded-lg p-2 md:p-3 text-center text-xs md:text-sm shadow-md flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] min-w-[120px] sm:min-w-[140px] md:min-w-[160px] w-28 sm:w-36 md:w-48 relative transition-all duration-300 cursor-grab hover:scale-105 group/tooltip">
                           <p className="font-semibold relative z-10 text-xs sm:text-sm">Legal Assessment: Criminal or Civil?</p>
                                                                                                               <div className={`invisible opacity-0 absolute z-10 w-48 sm:w-64 p-2 sm:p-3 -mt-20 sm:-mt-24 left-1/2 -translate-x-1/2 text-xs sm:text-sm leading-normal rounded-lg shadow-lg transition-opacity duration-300 group-hover/tooltip:visible group-hover/tooltip:opacity-100 ${resolvedTheme === 'dark' ? 'bg-black text-white' : 'bg-gray-800 text-white'}`}>
                               The AI analyzes facts to determine if the act is a criminal offense or a civil matter.
                               <div className={`absolute w-3 h-3 rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2 ${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-800'}`}></div>
                           </div>
                         </div>
                        <div className="relative h-full flex items-center w-6 sm:w-8 md:w-16">
                          <div className="h-0.5 bg-gray-500 w-full"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">►</div>
                        </div>
                      </div>

                      {/* Branch: Criminal vs Civil Path */}
                      <div className="flex items-stretch" draggable="true" onDragStart={handleDragStart}>
                        <div className="relative flex flex-col justify-center items-center h-full w-auto cursor-grab hover:scale-105">
                          <div className="absolute h-full w-0.5 bg-gray-500 left-0 top-0"></div>
                                                     <div className="flex items-center w-full mb-4">
                             <div className="w-6 sm:w-8 h-0.5 bg-gray-500"></div>
                                                          <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-200'} border border-gray-600 rounded-lg p-2 md:p-3 text-center text-xs md:text-sm shadow-md flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] min-w-[120px] sm:min-w-[140px] md:min-w-[160px] w-28 sm:w-36 md:w-48 opacity-50`}>
                                <p className={`text-xs sm:text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Criminal Path</p>
                              </div>
                            </div>
                            <div className="flex items-center w-full">
                              <div className="w-6 sm:w-8 h-0.5 bg-gray-500"></div>
                              <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-200'} border border-gray-600 rounded-lg p-2 md:p-3 text-center text-xs md:text-sm shadow-md flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] min-w-[120px] sm:min-w-[140px] md:min-w-[160px] w-28 sm:w-36 md:w-48`}>
                                <p className={`text-xs sm:text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Civil Path</p>
                              </div>
                          </div>
                        </div>
                        <div className="relative h-full flex items-center w-6 sm:w-8 md:w-16">
                          <div className="h-0.5 bg-gray-500 w-full"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">►</div>
                        </div>
                      </div>

                      {/* Determine Client Role */}
                      <div className="flex items-center" draggable="true" onDragStart={handleDragStart}>
                                                                                                   <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-200'} border border-gray-600 rounded-lg p-2 md:p-3 text-center text-xs md:text-sm shadow-md flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] min-w-[120px] sm:min-w-[140px] md:min-w-[160px] w-28 sm:w-36 md:w-48 relative transition-all duration-300 cursor-grab hover:scale-105 group/tooltip`}>
                            <p className={`font-semibold relative z-10 text-xs sm:text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Determine Client Role</p>
                                                       <div className={`invisible opacity-0 absolute z-10 w-48 sm:w-64 p-2 sm:p-3 -mt-20 sm:-mt-24 left-1/2 -translate-x-1/2 text-xs sm:text-sm leading-normal rounded-lg shadow-lg transition-opacity duration-300 group-hover/tooltip:visible group-hover/tooltip:opacity-100 ${resolvedTheme === 'dark' ? 'bg-black text-white' : 'bg-gray-800 text-white'}`}>
                             Is the client the property owner seeking compensation (plaintiff) or the person being sued for damages (defendant)?
                             <div className={`absolute w-3 h-3 rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2 ${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-800'}`}></div>
                           </div>
                         </div>
                        <div className="relative h-full flex items-center w-6 sm:w-8 md:w-16">
                          <div className="h-0.5 bg-gray-500 w-full"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">►</div>
                        </div>
                      </div>

                      {/* Branch: Property Owner vs Accused */}
                      <div className="flex items-stretch" draggable="true" onDragStart={handleDragStart}>
                        <div className="relative flex flex-col justify-center items-center h-full w-auto cursor-grab hover:scale-105">
                          <div className="absolute h-full w-0.5 bg-gray-500 left-0 top-0"></div>
                                                     <div className="flex items-center w-full mb-4">
                             <div className="w-6 sm:w-8 h-0.5 bg-gray-500"></div>
                                                          <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-200'} border border-gray-600 rounded-lg p-2 md:p-3 text-center text-xs md:text-sm shadow-md flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] min-w-[120px] sm:min-w-[140px] md:min-w-[160px] w-28 sm:w-36 md:w-48`}>
                                <p className={`text-xs sm:text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Property Owner/Victim</p>
                              </div>
                            </div>
                            <div className="flex items-center w-full">
                              <div className="w-6 sm:w-8 h-0.5 bg-gray-500"></div>
                              <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-200'} border border-gray-600 rounded-lg p-2 md:p-3 text-center text-xs md:text-sm shadow-md flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] min-w-[120px] sm:min-w-[140px] md:min-w-[160px] w-28 sm:w-36 md:w-48 opacity-50`}>
                                <p className={`text-xs sm:text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Accused of Vandalism</p>
                              </div>
                          </div>
                        </div>
                        <div className="relative h-full flex items-center w-6 sm:w-8 md:w-16">
                          <div className="h-0.5 bg-gray-500 w-full"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">►</div>
                        </div>
                      </div>

                      {/* Assess Damage Amount */}
                      <div className="flex items-center" draggable="true" onDragStart={handleDragStart}>
                                                                                                   <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-200'} border border-gray-600 rounded-lg p-2 md:p-3 text-center text-xs md:text-sm shadow-md flex flex-col justify-center items-center min-h-[70px] sm:min-h-[80px] min-w-[120px] sm:min-w-[140px] md:min-w-[160px] w-28 sm:w-36 md:w-48 cursor-grab hover:scale-105`}>
                            <p className={`text-xs sm:text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Assess Damage Amount</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                             {/* Desktop Sidebar - Complete Workflow Overview */}
               {showSidebar && (
                 <div className={`hidden lg:block absolute top-0 right-0 w-80 h-full shadow-2xl z-20 overflow-y-auto ${
                   resolvedTheme === 'dark' 
                     ? 'bg-gray-900 border-gray-700' 
                     : 'bg-gray-100 border-gray-300'
                 } border-l`}>
                   <div className="p-6">
                     <div className="flex justify-between items-center mb-6">
                       <h3 className={`text-lg font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Complete Workflow Overview</h3>
                       <button
                         onClick={() => setShowSidebar(false)}
                         className={`${resolvedTheme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                       >
                         <span className="material-icons">close</span>
                       </button>
                     </div>
                     
                     {/* Vertical Workflow Steps */}
                     <div className="space-y-4">
                       {/* Start: Attorney Hired */}
                       <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-3">
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                           <div>
                             <p className={`font-semibold text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Start: Attorney Hired</p>
                             <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Client retains legal counsel</p>
                           </div>
                           <div className="ml-auto">
                             <span className={`material-icons text-sm ${resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>check_circle</span>
                           </div>
                         </div>
                       </div>

                       {/* Gather Case Facts */}
                       <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-3">
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                           <div>
                             <p className={`font-semibold text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Gather Case Facts</p>
                             <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Collect evidence & documentation</p>
                           </div>
                           <div className="ml-auto">
                             <span className={`material-icons text-sm ${resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>check_circle</span>
                           </div>
                         </div>
                       </div>

                       {/* Initial Client Intake */}
                       <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-3">
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                           <div>
                             <p className={`font-semibold text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Initial Client Intake</p>
                             <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>AI-guided structured interview</p>
                           </div>
                           <div className="ml-auto">
                             <span className={`material-icons text-sm ${resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>check_circle</span>
                           </div>
                         </div>
                       </div>

                       {/* Legal Assessment */}
                       <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                           <div>
                             <p className={`font-semibold text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Legal Assessment</p>
                             <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>Criminal or Civil determination</p>
                           </div>
                           <div className="ml-auto">
                             <span className={`material-icons text-sm ${resolvedTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>pending</span>
                           </div>
                         </div>
                       </div>

                       {/* Branch Paths */}
                       <div className={`${resolvedTheme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-200 border-gray-300'} border rounded-lg p-3`}>
                         <div className="flex items-center gap-3">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${resolvedTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'}`}>5</div>
                           <div>
                             <p className={`font-semibold text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Path Decision</p>
                             <div className={`text-xs space-y-1 mt-1 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                               <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                 <span>Criminal Path</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                 <span className={`${resolvedTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Civil Path (Selected)</span>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Determine Client Role */}
                       <div className={`${resolvedTheme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-200 border-gray-300'} border rounded-lg p-3`}>
                         <div className="flex items-center gap-3">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${resolvedTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'}`}>6</div>
                           <div>
                             <p className={`font-semibold text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Determine Client Role</p>
                             <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Plaintiff or Defendant</p>
                           </div>
                           <div className="ml-auto">
                             <span className="material-icons text-gray-500 text-sm">radio_button_unchecked</span>
                           </div>
                         </div>
                       </div>

                       {/* Role Branch */}
                       <div className={`${resolvedTheme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-200 border-gray-300'} border rounded-lg p-3`}>
                         <div className="flex items-center gap-3">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${resolvedTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'}`}>7</div>
                           <div>
                             <p className={`font-semibold text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Role Decision</p>
                             <div className={`text-xs space-y-1 mt-1 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                               <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                 <span className={`${resolvedTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Property Owner/Victim</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                 <span>Accused of Vandalism</span>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Assess Damage Amount */}
                       <div className={`${resolvedTheme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-200 border-gray-300'} border rounded-lg p-3`}>
                         <div className="flex items-center gap-3">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${resolvedTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'}`}>8</div>
                           <div>
                             <p className={`font-semibold text-sm ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Assess Damage Amount</p>
                             <p className={`text-xs ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Evaluate repair costs</p>
                           </div>
                           <div className="ml-auto">
                             <span className="material-icons text-gray-500 text-sm">radio_button_unchecked</span>
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Progress Summary */}
                     <div className={`mt-6 p-4 rounded-lg ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                       <h4 className={`font-semibold mb-3 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Progress Summary</h4>
                       <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                           <span className={resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Completed:</span>
                           <span className={resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600'}>3/8 steps</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className={resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Current:</span>
                           <span className={resolvedTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}>Legal Assessment</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className={resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Next:</span>
                           <span className={resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}>Determine Client Role</span>
                         </div>
                       </div>
                       <div className="mt-3">
                         <div className={`w-full rounded-full h-2 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}>
                           <div className="bg-purple-500 h-2 rounded-full" style={{width: '37.5%'}}></div>
                         </div>
                         <p className={`text-xs mt-1 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>37.5% Complete</p>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

                             {/* Case Information Panel */}
               <div className={`p-4 md:p-8 border-t ${resolvedTheme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                   {/* Client Info */}
                   <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-100'} p-6 rounded-lg`}>
                     <h3 className={`text-xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Client Info</h3>
                     <div className="space-y-3 text-sm">
                       <div><span className={`font-semibold ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Case Name:</span> <span className={resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}>Miller v. City Parks Dept.</span></div>
                       <div><span className={`font-semibold ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Case Number:</span> <span className={resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}>CV-2024-1839</span></div>
                       <div><span className={`font-semibold ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Client Role:</span> <span className={resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}>Plaintiff / Property Owner</span></div>
                     </div>
                   </div>

                   {/* Completed Tasks */}
                   <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-100'} p-6 rounded-lg`}>
                     <h3 className={`text-xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Completed Tasks</h3>
                     <ul className="space-y-3 text-sm">
                       <li className="flex items-center text-green-400">
                         <span className="material-icons text-base mr-2">check_circle</span>
                         <span>Attorney Hired</span>
                       </li>
                       <li className="flex items-center text-green-400">
                         <span className="material-icons text-base mr-2">check_circle</span>
                         <span>Initial Client Intake</span>
                       </li>
                       <li className="flex items-center text-green-400">
                         <span className="material-icons text-base mr-2">check_circle</span>
                         <span>Gather Case Facts</span>
                       </li>
                     </ul>
                   </div>

                   {/* Current Status */}
                   <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-100'} p-6 rounded-lg`}>
                     <h3 className={`text-xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Current Status</h3>
                     <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 text-sm h-full">
                       <p className="font-semibold text-yellow-300 mb-2">Legal Assessment: Criminal or Civil?</p>
                       <p className="text-yellow-400">Lamis AI is analyzing the case facts to determine the appropriate legal path. This decision is crucial for the case strategy.</p>
                     </div>
                   </div>

                   {/* Next Step */}
                   <div className={`${resolvedTheme === 'dark' ? 'bg-black' : 'bg-gray-100'} p-6 rounded-lg`}>
                     <h3 className={`text-xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Next Step</h3>
                     <ul className={`space-y-3 text-sm ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                       <li className="flex items-center">
                         <span className="material-icons text-base mr-2">radio_button_unchecked</span>
                         <span>Determine Client Role (Civil Path)</span>
                       </li>
                     </ul>
                   </div>
                 </div>
               </div>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="mb-12 md:mb-20">
            <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 px-4 ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Key Features of the Workflow Automation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-gray-100 border-gray-300'} border rounded-lg p-8 shadow-lg transition-transform duration-300 hover:scale-105`}>
                <span className="material-icons text-3xl text-purple-600 mb-4">assignment</span>
                <h3 className={`text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Initial Assessment and Intake</h3>
                <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}> Our systematic client intake gathers essential information, including the nature of vandalism, damage amount, evidence, police involvement, and insurance claims, for proper case categorization..</p>
              </div>
              
              <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg p-8 shadow-lg transition-transform duration-300 hover:scale-105`}>
                <span className="material-icons text-3xl text-purple-600 mb-4">rule</span>
                <h3 className={`text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Intelligent Case Classification</h3>
                <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>The system automatically determines if a case is criminal or civil and, for criminal cases under California Penal Code § 594, differentiates between misdemeanor and felony charges.</p>
              </div>
              
              <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg p-8 shadow-lg transition-transform duration-300 hover:scale-105`}>
                <span className="material-icons text-3xl text-purple-600 mb-4">drag_indicator</span>
                <h3 className={`text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Manual Workflow Adjustment</h3>
                <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sophisticated jurisdiction determination flags cases that may fall under federal jurisdiction, ensuring they are prosecuted under the correct laws like 18 U.S.C. § 1361.</p>
              </div>
              
              <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg p-8 shadow-lg transition-transform duration-300 hover:scale-105`}>
                <span className="material-icons text-3xl text-purple-600 mb-4">account_tree</span>
                <h3 className={`text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Role-Based Process Branching</h3>
                <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Distinct pathways are created for Criminal Defense, Victim Assistance, and Civil Plaintiff to tailor the process to the client's specific needs.</p>
              </div>
              
              <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg p-8 shadow-lg transition-transform duration-300 hover:scale-105`}>
                <span className="material-icons text-3xl text-purple-600 mb-4">gavel</span>
                <h3 className={`text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Automated Court Selection</h3>
                <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}> For civil cases, the system automatically routes to the appropriate court—Small Claims or Superior Court—based on the damage amounts involved.</p>
              </div>
              
              <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg p-8 shadow-lg transition-transform duration-300 hover:scale-105`}>
                <span className="material-icons text-3xl text-purple-600 mb-4">sync</span>
                <h3 className={`text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Real-Time Progress Tracking</h3>
                <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}> Clients and attorneys can track the live status of their case directly on the workflow, including completed, active, and upcoming steps.</p>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mb-12 md:mb-20">
            <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 px-4 ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Trusted by Leading Law Firms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto px-4">
                             <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg p-8 shadow-lg transition-transform duration-300 hover:scale-105`}>
                 <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6 text-lg italic`}>"Lamis AI's live workflow is a transparency breakthrough. Our clients feel more connected and informed, seeing their case progress in real-time."</p>
                 <div className="flex items-center">
                   <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                     <span className="text-white text-xl font-bold">JS</span>
                   </div>
                   <div>
                     <p className={`font-semibold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Jessica Miller</p>
                     <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Partner, Miller & Associates</p>
                   </div>
                 </div>
               </div>
              
                             <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg p-8 shadow-lg transition-transform duration-300 hover:scale-105`}>
                 <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6 text-lg italic`}>"The integrated case management and workflow visualization is brilliant. It not only streamlines our internal processes but also provides clients with an unprecedented level of clarity."</p>
                 <div className="flex items-center">
                   <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                     <span className="text-white text-xl font-bold">DT</span>
                   </div>
                   <div>
                     <p className={`font-semibold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>David Chen</p>
                     <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Lead Attorney, Chen Legal Group</p>
                   </div>
                 </div>
               </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section>
            <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 px-4 ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Workflow Automation Benefits for Law Firms</h2>
            <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 px-4">
              <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg shadow-lg p-6 md:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 transition-transform duration-300 hover:scale-105`}>
                <span className="material-icons text-2xl sm:text-3xl text-purple-600 mt-1">speed</span>
                <div>
                  <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Enhanced Efficiency</h3>
                  <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}> Automated decision trees reduce manual case assessment time while ensuring comprehensive evaluation of all relevant factors.</p>
                </div>
              </div>
              
              <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg shadow-lg p-6 md:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 transition-transform duration-300 hover:scale-105`}>
                <span className="material-icons text-2xl sm:text-3xl text-purple-600 mt-1">chat</span>
                <div>
                  <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Improved Client Communication</h3>
                  <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>Visual flowcharts provide clear explanations of case progression and potential outcomes, enhancing attorney–client relationships.</p>
                </div>
              </div>
              
              <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg shadow-lg p-6 md:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 transition-transform duration-300 hover:scale-105`}>
                <span className="material-icons text-2xl sm:text-3xl text-purple-600 mt-1">shield</span>
                <div>
                  <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Risk Management</h3>
                  <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>Systematic evaluation of jurisdiction, case classification, and strategic options minimizes the risk of procedural errors or missed opportunities.</p>
                </div>
              </div>
              
              <div className={`${resolvedTheme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-300'} border rounded-lg shadow-lg p-6 md:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 transition-transform duration-300 hover:scale-105`}>
                <span className="material-icons text-2xl sm:text-3xl text-purple-600 mt-1">verified_user</span>
                <div>
                  <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Standardized Quality</h3>
                  <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>Consistent application of legal standards across all vandalism cases ensures uniform quality of representation.</p>
                </div>
              </div>
            </div>
          </section>
        </main>


      </div>

      {/* Material Icons CDN */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      
      {/* Custom CSS for scrollbar hiding and hover effects */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Enhanced hover effects for workflow nodes */
        .group\\/tooltip:hover .group-hover\\/tooltip\\:visible {
          visibility: visible;
        }
        
        .group\\/tooltip:hover .group-hover\\/tooltip\\:opacity-100 {
          opacity: 1;
        }
        
        /* Ensure tooltips are properly positioned */
        .group\\/tooltip {
          position: relative;
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition-property: transform, opacity, background-color, border-color, box-shadow;
          transition-duration: 300ms;
          transition-timing-function: ease-in-out;
        }
        
        /* Ensure workflow is fully visible and properly spaced */
        @media (max-width: 640px) {
          .min-w-max {
            min-width: max-content;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          .min-w-max {
            min-width: max-content;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        /* Improve horizontal scrolling experience */
        .overflow-x-auto {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Sidebar animation and styling */
        .sidebar-enter {
          transform: translateX(100%);
          opacity: 0;
        }
        
        .sidebar-enter-active {
          transform: translateX(0);
          opacity: 1;
          transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        }
        
        .sidebar-exit {
          transform: translateX(0);
          opacity: 1;
        }
        
        .sidebar-exit-active {
          transform: translateX(100%);
          opacity: 0;
          transition: transform 0.3s ease-in, opacity 0.3s ease-in;
        }
        
        /* Ensure sidebar doesn't interfere with main content */
        @media (min-width: 1024px) {
          .sidebar-open {
            margin-right: 320px;
          }
        }
        
        /* Responsive tooltip positioning */
        @media (max-width: 640px) {
          .group\\/tooltip .invisible {
            width: 200px !important;
            font-size: 11px !important;
            padding: 0.5rem !important;
            margin-top: -16px !important;
          }
        }
        
        /* Ensure proper spacing on mobile */
        @media (max-width: 640px) {
          .container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
