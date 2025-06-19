import React from 'react';
import { NutrientAnalysisCard } from './NutrientAnalysisCard';

interface FatsAnalysisProps {
    average: number;
    target: number;
    previousAverage?: number;
}

export const FatsAnalysis: React.FC<FatsAnalysisProps> = ({
    average,
    target,
    previousAverage,
}) => {
    return (
        <NutrientAnalysisCard
            label="Fats"
            average={average}
            target={target}
            previousAverage={previousAverage}
            unit="g"
        />
    );
};
