# Workflow Section

This folder contains the workflow automation components that were moved from the pages folder to the LandingPage components structure.

## Files

- `WorkflowSection.jsx` - Main workflow component containing the workflow automation interface
- `index.js` - Export file for clean imports
- `README.md` - This documentation file

## Usage

The WorkflowSection component can be imported and used in any page or component:

```jsx
import { WorkflowSection } from '../components/Sections/LandingPage/Workflow';

// Use the component
<WorkflowSection />
```

## Features

- Interactive workflow diagram for legal cases
- Case status tracking
- Client information display
- Feature cards explaining workflow automation benefits
- Testimonials from law firms
- Responsive design with dark/light theme support

## Dependencies

- React Router for navigation
- Theme context for dark/light mode
- Tabler Icons for icons
- CollapsiblePanel component for expandable sections
