import React from 'react';
import { NutrientAnalysisCard } from './NutrientAnalysisCard';

interface CarbsAnalysisProps {
    average: number;
    target: number;
    previousAverage?: number;
}

export const CarbsAnalysis: React.FC<CarbsAnalysisProps> = ({
    average,
    target,
    previousAverage,
}) => {
    return (
        <NutrientAnalysisCard
            label="Carbs"
            average={average}
            target={target}
            previousAverage={previousAverage}
            unit="g"
        />
    );
};
