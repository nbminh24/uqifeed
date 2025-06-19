import React from 'react';
import { NutrientAnalysisCard } from './NutrientAnalysisCard';

interface ProteinAnalysisProps {
    average: number;
    target: number;
    previousAverage?: number;
}

export const ProteinAnalysis: React.FC<ProteinAnalysisProps> = ({
    average,
    target,
    previousAverage,
}) => {
    return (
        <NutrientAnalysisCard
            label="Protein"
            average={average}
            target={target}
            previousAverage={previousAverage}
            unit="g"
        />
    );
};
