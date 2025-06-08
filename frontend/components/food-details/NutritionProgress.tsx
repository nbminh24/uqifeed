import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Svg, Circle, Text as SvgText } from 'react-native-svg';

interface NutritionProgressProps {
    calories: number;
    targetCalories: number;
    macros: {
        protein: number;
        targetProtein: number;
        carbs: number;
        targetCarbs: number;
        fat: number;
        targetFat: number;
        fiber: number;
        targetFiber: number;
    };
}

export const NutritionProgress: React.FC<NutritionProgressProps> = ({
    calories,
    targetCalories,
    macros
}) => {
    const screenWidth = Dimensions.get('window').width;
    const size = screenWidth * 0.35; // Pie chart size
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const calorieProgress = Math.min((calories / targetCalories) * 100, 100);
    const calorieStrokeDashoffset = circumference - (circumference * calorieProgress) / 100;

    const renderMacroBar = (value: number, target: number, color: string, label: string) => {
        const progress = Math.min((value / target) * 100, 100);

        return (
            <View style={styles.macroBarContainer}>
                <View style={styles.macroLabelContainer}>
                    <ThemedText style={styles.macroLabel}>{label}</ThemedText>
                    <ThemedText style={styles.macroValue}>
                        {Math.round(value)}/{Math.round(target)}g
                    </ThemedText>
                </View>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: color }]} />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Left side: Calorie Ring */}
            <View style={styles.calorieRingContainer}>
                <Svg height={size} width={size} style={styles.svg}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#E0E0E0"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#FF6B6B"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={calorieStrokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                    <SvgText
                        x={size / 2}
                        y={size / 2 - 10}
                        textAnchor="middle"
                        fill="#333333"
                        fontSize="16"
                    >
                        {Math.round(calories)}
                    </SvgText>
                    <SvgText
                        x={size / 2}
                        y={size / 2 + 10}
                        textAnchor="middle"
                        fill="#666666"
                        fontSize="12"
                    >
                        /{Math.round(targetCalories)}
                    </SvgText>
                    <SvgText
                        x={size / 2}
                        y={size / 2 + 25}
                        textAnchor="middle"
                        fill="#666666"
                        fontSize="12"
                    >
                        kcal
                    </SvgText>
                </Svg>
            </View>

            {/* Right side: Macro Bars */}
            <View style={styles.macroProgressContainer}>
                {renderMacroBar(macros.protein, macros.targetProtein, '#118AB2', 'Protein')}
                {renderMacroBar(macros.carbs, macros.targetCarbs, '#FFD166', 'Carbs')}
                {renderMacroBar(macros.fat, macros.targetFat, '#06D6A0', 'Fat')}
                {renderMacroBar(macros.fiber, macros.targetFiber, '#8BC34A', 'Fiber')}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    calorieRingContainer: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        transform: [{ rotate: '90deg' }],
    },
    macroProgressContainer: {
        flex: 6,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    macroBarContainer: {
        marginBottom: 8,
    },
    macroLabelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    macroLabel: {
        fontSize: 14,
        color: '#333',
    },
    macroValue: {
        fontSize: 14,
        color: '#666',
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});
