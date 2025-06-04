import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { format, isSameDay } from 'date-fns';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WeekDayPickerProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    dates: Date[];
}

export function WeekDayPicker({ selectedDate, onSelectDate, dates }: WeekDayPickerProps) {
    const selectedBackground = useThemeColor(
        {
            light: '#1E2A3A',
            dark: '#64FFDA',
        },
        'background'
    );

    const selectedTextColor = useThemeColor(
        {
            light: '#FFFFFF',
            dark: '#1E2A3A',
        },
        'text'
    ); return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.datesRow}>
                {dates.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                        <TouchableOpacity
                            key={date.toISOString()}
                            onPress={() => onSelectDate(date)}
                            style={[
                                styles.dateButton,
                                isSelected && { backgroundColor: selectedBackground }
                            ]}
                        >
                            <ThemedText style={[
                                styles.dayName,
                                isSelected && { color: selectedTextColor }
                            ]}>
                                {format(date, 'EEE')}
                            </ThemedText>
                            <ThemedText style={[
                                styles.dayNumber,
                                isSelected && { color: selectedTextColor }
                            ]}>
                                {format(date, 'd')}
                            </ThemedText>
                        </TouchableOpacity>
                    );
                })}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        marginTop: 1,
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateButton: {
        width: 48,
        height: 64,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingVertical: 8,
    },
    dayName: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 6,
        textAlign: 'center',
    },
    dayNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
