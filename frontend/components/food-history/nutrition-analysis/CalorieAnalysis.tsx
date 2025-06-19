import React from 'react';
import { NutrientAnalysisCard } from './NutrientAnalysisCard';

interface CalorieAnalysisProps {
    average: number;
    target: number;
    previousAverage?: number;
}

export const CalorieAnalysis: React.FC<CalorieAnalysisProps> = ({
    average,
    target,
    previousAverage,
}) => {
    return (
        <NutrientAnalysisCard
            label="Calories"
            average={average}
            target={target}
            previousAverage={previousAverage}
            unit="kcal"
        />
    );
};
