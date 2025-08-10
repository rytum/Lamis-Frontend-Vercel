import React, { useEffect, useRef, useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

/**
 * CollapsiblePanel
 * Props:
 * - title: string
 * - Icon: optional React component (e.g., from @tabler/icons-react)
 * - defaultOpen: boolean (default: false)
 * - children: ReactNode (panel content)
 * - onToggle?: (isOpen: boolean) => void
 */
const CollapsiblePanel = ({ title, Icon, defaultOpen = false, children, onToggle }) => {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // Calculate content height for smooth transition
    if (open) {
      const fullHeight = el.scrollHeight;
      setMaxHeight(`${fullHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  }, [open, children]);

  // Recompute height on window resize for responsive correctness
  useEffect(() => {
    const onResize = () => {
      if (!contentRef.current) return;
      if (open) setMaxHeight(`${contentRef.current.scrollHeight}px`);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 justify-between px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-gray-50 dark:hover:bg-neutral-800/70 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon ? (
            <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
          ) : null}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{title}</h3>
        </div>
        <IconChevronDown
          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight }}
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsiblePanel;
