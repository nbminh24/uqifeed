import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface UpdateBMIModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (weight: number, height: number, selectedDate: string) => void;
    currentWeight?: number;
    currentHeight?: number;
    defaultDate?: string;
}

export const UpdateBMIModal: React.FC<UpdateBMIModalProps> = ({
    visible,
    onClose,
    onSubmit,
    currentWeight,
    currentHeight,
    defaultDate,
}) => {
    const [weight, setWeight] = useState(currentWeight?.toString() || '');
    const [height, setHeight] = useState(currentHeight?.toString() || '');
    const [selectedDate, setSelectedDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
    const [error, setError] = useState<string>('');

    const handleNumberInput = (value: string, setter: (value: string) => void) => {
        // Replace comma with dot for decimal numbers and remove any non-numeric characters except dot
        const formattedValue = value.replace(',', '.').replace(/[^0-9.]/g, '');
        // Ensure only one decimal point
        const parts = formattedValue.split('.');
        if (parts.length > 2) {
            setter(parts[0] + '.' + parts.slice(1).join(''));
        } else {
            setter(formattedValue);
        }
    };

    const handleSubmit = () => {
        // Validate inputs
        if (!weight || !height) {
            setError('Please enter both weight and height');
            return;
        }

        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);

        if (isNaN(weightNum) || isNaN(heightNum)) {
            setError('Please enter valid numbers');
            return;
        }

        if (weightNum <= 0 || heightNum <= 0) {
            setError('Values must be greater than 0');
            return;
        } if (weightNum < 30 || weightNum > 300) {
            setError('Weight must be between 30 and 300 kg');
            return;
        }

        if (heightNum < 1 || heightNum > 2.5) {
            setError('Height must be between 1 and 2.5 meters');
            return;
        }        // Clear error and submit
        setError('');
        onSubmit(weightNum, heightNum, selectedDate);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.header}>
                                    <ThemedText style={styles.title}>Update BMI</ThemedText>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <MaterialCommunityIcons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>                                <View style={styles.inputContainer}>
                                    <View style={styles.inputGroup}>
                                        <ThemedText style={styles.label}>Week Start Date</ThemedText>
                                        <TextInput
                                            style={styles.input}
                                            value={selectedDate}
                                            onChangeText={setSelectedDate}
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <ThemedText style={styles.label}>Weight (kg)</ThemedText>
                                        <TextInput
                                            style={styles.input}
                                            value={weight}
                                            onChangeText={(value) => handleNumberInput(value, setWeight)}
                                            keyboardType="decimal-pad"
                                            placeholder="Enter weight"
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <ThemedText style={styles.label}>Height (m)</ThemedText>
                                        <TextInput
                                            style={styles.input} value={height}
                                            onChangeText={(value) => handleNumberInput(value, setHeight)}
                                            keyboardType="decimal-pad"
                                            placeholder="Enter height"
                                        />
                                    </View>

                                    {error ? (
                                        <ThemedText style={styles.errorText}>{error}</ThemedText>
                                    ) : null}
                                </View>

                                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                    <ThemedText style={styles.submitButtonText}>Update</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    }, input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 18,
        color: '#333',
        minHeight: 48,
        textAlignVertical: 'center',
    },
    errorText: {
        color: '#F44336',
        fontSize: 14,
        marginTop: 8,
    },
    submitButton: {
        backgroundColor: '#163166',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
