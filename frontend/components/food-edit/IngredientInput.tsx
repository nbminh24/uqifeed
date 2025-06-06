import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface IngredientInputProps {
    index: number;
    name: string;
    amount: string | number;
    error?: string;
    onChangeName: (value: string) => void;
    onChangeAmount: (value: string) => void;
    onRemove: () => void;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
    index,
    name,
    amount,
    error,
    onChangeName,
    onChangeAmount,
    onRemove
}) => {
    return (
        <View style={styles.ingredientRow}>
            <View style={styles.ingredientInputs}>
                <View style={styles.nameContainer}>
                    <TextInput
                        style={[
                            styles.input,
                            styles.ingredientName,
                            error && styles.inputError
                        ]}
                        value={name}
                        onChangeText={onChangeName}
                        placeholder="Ingredient name"
                    />
                    {error && (
                        <ThemedText style={styles.errorText}>
                            {error}
                        </ThemedText>
                    )}
                </View>
                <View style={styles.amountContainer}>
                    <TextInput
                        style={[
                            styles.input,
                            styles.ingredientAmount,
                            error && styles.inputError
                        ]}
                        value={String(amount)}
                        onChangeText={onChangeAmount}
                        placeholder="Amount"
                        keyboardType="decimal-pad"
                    />
                </View>
            </View>
            <TouchableOpacity
                onPress={onRemove}
                style={styles.removeButton}
            >
                <Ionicons name="remove-circle" size={24} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    ingredientInputs: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 8,
    },
    nameContainer: {
        flex: 2,
        marginRight: 8,
    },
    amountContainer: {
        flex: 1,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 16,
    },
    ingredientName: {
        flex: 1,
    },
    ingredientAmount: {
        flex: 1,
    },
    inputError: {
        borderColor: '#FF4D4F',
        borderWidth: 1,
    },
    errorText: {
        color: '#FF4D4F',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
    },
    removeButton: {
        padding: 8,
        marginTop: 8,
    },
});
