import React from 'react';
import { AttackForecastChart } from '../components/dashboard/AttackForecastChart';
import { MultiStepForecastCards } from '../components/dashboard/MultiStepForecastCards';
import { TemporalStateSequence } from '../components/forecast/TemporalStateSequence';
import { AttackTrajectoryPath } from '../components/dashboard/AttackTrajectoryPath';

export const ForecastPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <AttackForecastChart />
      <MultiStepForecastCards />
      <TemporalStateSequence />
      <AttackTrajectoryPath />
    </div>
  );
};
