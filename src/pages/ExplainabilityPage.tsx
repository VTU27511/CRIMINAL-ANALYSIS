import React from 'react';
import { ShapExplainabilityView } from '../components/explainability/ShapExplainabilityView';

export const ExplainabilityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ShapExplainabilityView />
    </div>
  );
};
