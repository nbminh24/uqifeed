import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeeklyBMIData } from '@/services/weeklyBMIService';

interface WeeklyBMICardProps {
    bmiData: WeeklyBMIData | null;
    onUpdatePress?: () => void;
}

export const WeeklyBMICard: React.FC<WeeklyBMICardProps> = ({
    bmiData,
    onUpdatePress
}) => {
    const getBMIColor = (category: string) => {
        switch (category) {
            case 'Underweight':
                return '#FFB74D'; // Orange
            case 'Normal':
                return '#4CAF50'; // Green
            case 'Overweight':
                return '#FF9800'; // Dark Orange
            case 'Obese':
                return '#F44336'; // Red
            default:
                return '#757575'; // Grey
        }
    };

    if (!bmiData) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <ThemedText style={styles.title}>Weekly BMI</ThemedText>
                    <TouchableOpacity onPress={onUpdatePress} style={styles.updateButton}>
                        <MaterialCommunityIcons name="pencil" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                <View style={styles.noDataContainer}>
                    <ThemedText style={styles.noDataText}>No BMI data available for this week</ThemedText>
                    <ThemedText style={styles.noDataSubtext}>Tap the pencil icon to update your BMI</ThemedText>
                </View>
            </View>
        );
    }

    const bmiColor = getBMIColor(bmiData.category);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemedText style={styles.title}>Weekly BMI</ThemedText>
                <TouchableOpacity onPress={onUpdatePress} style={styles.updateButton}>
                    <MaterialCommunityIcons name="pencil" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.bmiContainer}>
                <View style={styles.bmiValueContainer}>
                    <ThemedText style={[styles.bmiValue, { color: bmiColor }]}>
                        {bmiData.bmi.toFixed(1)}
                    </ThemedText>
                    <ThemedText style={styles.bmiLabel}>BMI</ThemedText>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsContainer}>
                    <View style={styles.measurementRow}>
                        <ThemedText style={styles.measurementLabel}>Weight:</ThemedText>
                        <ThemedText style={styles.measurementValue}>{bmiData.weight} kg</ThemedText>
                    </View>
                    <View style={styles.measurementRow}>
                        <ThemedText style={styles.measurementLabel}>Height:</ThemedText>
                        <ThemedText style={styles.measurementValue}>{bmiData.height} m</ThemedText>
                    </View>
                    <View style={styles.categoryContainer}>
                        <ThemedText style={[styles.category, { color: bmiColor }]}>
                            {bmiData.category}
                        </ThemedText>
                        <ThemedText style={styles.description}>{bmiData.description}</ThemedText>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    updateButton: {
        padding: 4,
    },
    noDataContainer: {
        alignItems: 'center',
        padding: 16
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8
    },
    noDataSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center'
    }, bmiContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        minHeight: 140,
    },
    bmiValueContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        minWidth: 120,
    },
    bmiValue: {
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
        includeFontPadding: false,
        lineHeight: 50,
        minHeight: 50,
        textAlignVertical: 'center',
    },
    bmiLabel: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
        includeFontPadding: false,
    },
    divider: {
        width: 1,
        height: '80%',
        alignSelf: 'center',
        backgroundColor: '#E0E0E0',
        marginHorizontal: 20,
    },
    detailsContainer: {
        flex: 1.5,
        justifyContent: 'center',
        paddingVertical: 12,
    }, measurementRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    measurementLabel: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    measurementValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    categoryContainer: {
        marginTop: 12,
    },
    category: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
});
