import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
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
    );

    return (
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
                            <View>
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
                            </View>
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
        paddingVertical: 0,
        backgroundColor: 'transparent',
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: 90,
    },
    dateButton: {
        width: 48,
        height: 80,
        borderRadius: 12,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 8,
    },
    dayName: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 6,
        marginBottom: 8,
        textAlign: 'center',
    },
    dayNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 2,
    },
});
