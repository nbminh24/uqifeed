import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Platform, ActivityIndicator, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { Profile, Gender, ActivityLevel, WeightGoal, DietType } from '@/types/profile';
import { getProfile, updateProfile } from '@/services/profileService';
import { router } from 'expo-router';
import { isValidDate } from '@/services/dateUtils';

// Cập nhật DEFAULT_PROFILE
const DEFAULT_PROFILE: Profile = {
    id: '',
    userId: '',
    gender: 'Male',
    birthday: new Date().toISOString(),
    height: null,
    currentWeight: null,
    targetWeight: null,
    target_time: new Date().toISOString(),
    activityLevel: 'Moderately active',
    goal: 'Maintain weight',
    dietType: 'Balanced'
};

export default function EditProfileScreen() {
    const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
    const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
    const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const loadProfile = async () => {
        try {
            setLoadError(null);
            const data = await getProfile();
            console.log('Profile data:', data); // Debug log

            if (data) {
                // Ensure all numeric values are properly parsed
                const numericHeight = data.height !== undefined ? Number(data.height) : null;
                const numericCurrentWeight = data.currentWeight !== undefined ? Number(data.currentWeight) : null;
                const numericTargetWeight = data.targetWeight !== undefined ? Number(data.targetWeight) : null;

                // Update profile with validated data
                setProfile({
                    ...data,
                    height: numericHeight,
                    currentWeight: numericCurrentWeight,
                    targetWeight: numericTargetWeight,
                    // Ensure dates are valid ISO strings
                    birthday: isValidDate(new Date(data.birthday)) ? data.birthday : new Date().toISOString(),
                    target_time: isValidDate(new Date(data.target_time)) ? data.target_time : new Date().toISOString(),
                });
            }
        } catch (err) {
            console.error('[EditProfile] Load Error:', err);
            setLoadError('Could not load profile data');
        } finally {
            setIsInitialLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const formatDisplayDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isValidDate(date)) {
                return format(date, 'dd/MM/yyyy');
            }
            return 'Select date';
        } catch (error) {
            console.error('[EditProfile] Date format error:', error);
            return 'Select date';
        }
    };

    const validateInput = (input: string | null, field: string) => {
        if (input === null || input === '') {
            return `${field} is required`;
        }
        const number = Number(input);
        if (isNaN(number)) {
            return `${field} must be a number`;
        }
        if (number <= 0) {
            return `${field} must be greater than 0`;
        }
        return null;
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // Validate height
        const heightError = validateInput(profile.height?.toString(), 'Height');
        if (heightError) newErrors.height = heightError;

        // Validate current weight
        const currentWeightError = validateInput(profile.currentWeight?.toString(), 'Current weight');
        if (currentWeightError) newErrors.currentWeight = currentWeightError;

        // Validate target weight
        const targetWeightError = validateInput(profile.targetWeight?.toString(), 'Target weight');
        if (targetWeightError) newErrors.targetWeight = targetWeightError;

        // Validate date fields
        if (!isValidDate(new Date(profile.birthday))) {
            newErrors.birthday = 'Invalid birthday';
        }

        if (!isValidDate(new Date(profile.target_time))) {
            newErrors.target_time = 'Invalid target date';
        }

        // Additional validation
        const currentDate = new Date();
        const birthday = new Date(profile.birthday);
        const targetDate = new Date(profile.target_time);

        if (birthday >= currentDate) {
            newErrors.birthday = 'Birthday cannot be in the future';
        }

        if (targetDate <= currentDate) {
            newErrors.target_time = 'Target date must be in the future';
        }

        // Validate reasonable ranges
        const height = Number(profile.height);
        if (height && (height < 100 || height > 250)) {
            newErrors.height = 'Height should be between 100cm and 250cm';
        }

        const weight = Number(profile.targetWeight);
        if (weight !== null && profile.currentWeight) {
            const minWeight = profile.currentWeight * 0.5;
            const maxWeight = profile.currentWeight * 1.5;
            if (weight < minWeight || weight > maxWeight) {
                newErrors.targetWeight = 'Target weight should be within ±50% of current weight';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        try {
            setIsLoading(true);
            await updateProfile(profile);
            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (err) {
            console.error('[EditProfile] Save Error:', err);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitialLoading) {
        return (
            <ThemedView style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#163166" />
                <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
            </ThemedView>
        );
    }

    if (loadError) {
        return (
            <ThemedView style={[styles.container, styles.centered]}>
                <ThemedText style={styles.errorMessage}>{loadError}</ThemedText>
                <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
                    <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#163166" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Hồ sơ dinh dưỡng</ThemedText>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                    disabled={isLoading}
                >
                    <ThemedText style={styles.saveButtonText}>
                        {isLoading ? 'Đang lưu...' : 'Lưu'}
                    </ThemedText>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Thông tin cơ bản</ThemedText>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Giới tính</ThemedText>
                        <Picker
                            selectedValue={profile.gender}
                            onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value as Gender }))}
                            style={styles.picker}
                        >
                            <Picker.Item label="Nam" value="Male" />
                            <Picker.Item label="Nữ" value="Female" />
                        </Picker>
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Ngày sinh</ThemedText>
                        <TouchableOpacity
                            style={[styles.dateInput, errors.birthday && styles.inputError]}
                            onPress={() => setShowBirthdayPicker(true)}
                        >
                            <ThemedText>{formatDisplayDate(profile.birthday)}</ThemedText>
                        </TouchableOpacity>
                        {errors.birthday && <ThemedText style={styles.errorText}>{errors.birthday}</ThemedText>}
                        {showBirthdayPicker && (
                            <DateTimePicker
                                value={new Date(profile.birthday)}
                                mode="date"
                                onChange={(event, date) => {
                                    setShowBirthdayPicker(false);
                                    if (date && event.type !== 'dismissed') {
                                        setProfile(prev => ({ ...prev, birthday: date.toISOString() }));
                                    }
                                }}
                            />
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Chiều cao (cm)</ThemedText>
                        <TextInput
                            style={[styles.input, errors.height && styles.inputError]}
                            value={profile.height?.toString() || ''}
                            onChangeText={(value) => setProfile(prev => ({ ...prev, height: value ? Number(value) : null }))}
                            keyboardType="numeric"
                            placeholder="VD: 170"
                        />
                        {errors.height && <ThemedText style={styles.errorText}>{errors.height}</ThemedText>}
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Cân nặng & Mục tiêu</ThemedText>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Cân nặng hiện tại (kg)</ThemedText>
                        <TextInput
                            style={[styles.input, errors.currentWeight && styles.inputError]}
                            value={profile.currentWeight?.toString() || ''}
                            onChangeText={(value) => setProfile(prev => ({ ...prev, currentWeight: value ? Number(value) : null }))}
                            keyboardType="numeric"
                            placeholder="VD: 65"
                        />
                        {errors.currentWeight && <ThemedText style={styles.errorText}>{errors.currentWeight}</ThemedText>}
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Cân nặng mong muốn (kg)</ThemedText>
                        <TextInput
                            style={[styles.input, errors.targetWeight && styles.inputError]}
                            value={profile.targetWeight?.toString() || ''}
                            onChangeText={(value) => setProfile(prev => ({ ...prev, targetWeight: value ? Number(value) : null }))}
                            keyboardType="numeric"
                            placeholder="VD: 60"
                        />
                        {errors.targetWeight && <ThemedText style={styles.errorText}>{errors.targetWeight}</ThemedText>}
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Thời gian để đạt mục tiêu</ThemedText>
                        <TouchableOpacity
                            style={[styles.dateInput, errors.target_time && styles.inputError]}
                            onPress={() => setShowTargetDatePicker(true)}
                        >
                            <ThemedText>{formatDisplayDate(profile.target_time)}</ThemedText>
                        </TouchableOpacity>
                        {errors.target_time && <ThemedText style={styles.errorText}>{errors.target_time}</ThemedText>}
                        {showTargetDatePicker && (
                            <DateTimePicker
                                value={new Date(profile.target_time)}
                                mode="date"
                                minimumDate={new Date()}
                                onChange={(event, date) => {
                                    setShowTargetDatePicker(false);
                                    if (date && event.type !== 'dismissed') {
                                        setProfile(prev => ({ ...prev, target_time: date.toISOString() }));
                                    }
                                }}
                            />
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Hoạt động & Mục tiêu</ThemedText>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Mức độ vận động</ThemedText>
                        <Picker
                            selectedValue={profile.activityLevel}
                            onValueChange={(value) => setProfile(prev => ({ ...prev, activityLevel: value as ActivityLevel }))}
                            style={styles.picker}
                        >
                            <Picker.Item label="Ít vận động" value="Sedentary" />
                            <Picker.Item label="Vận động nhẹ" value="Lightly active" />
                            <Picker.Item label="Vận động vừa phải" value="Moderately active" />
                            <Picker.Item label="Vận động nhiều" value="Very active" />
                            <Picker.Item label="Vận động rất nhiều" value="Extra active" />
                        </Picker>
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Mục tiêu</ThemedText>
                        <Picker
                            selectedValue={profile.goal}
                            onValueChange={(value) => setProfile(prev => ({ ...prev, goal: value as WeightGoal }))}
                            style={styles.picker}
                        >
                            <Picker.Item label="Giảm cân" value="Lose weight" />
                            <Picker.Item label="Giữ cân" value="Maintain weight" />
                            <Picker.Item label="Tăng cân" value="Gain weight" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Chế độ ăn</ThemedText>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Loại chế độ ăn</ThemedText>
                        <Picker
                            selectedValue={profile.dietType}
                            onValueChange={(value) => setProfile(prev => ({ ...prev, dietType: value as DietType }))}
                            style={styles.picker}
                        >
                            <Picker.Item label="Cân bằng" value="Balanced" />
                            <Picker.Item label="Ăn chay" value="Vegetarian" />
                            <Picker.Item label="Thuần chay" value="Vegan" />
                            <Picker.Item label="Paleo" value="Paleo" />
                            <Picker.Item label="Keto" value="Keto" />
                            <Picker.Item label="Giàu protein" value="High Protein" />
                            <Picker.Item label="Ít carb" value="Low Carb" />
                            <Picker.Item label="Tiêu chuẩn" value="Standard" />
                        </Picker>
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#E1E4E8',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#163166',
    },
    backButton: {
        padding: 8,
        margin: 0,
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#163166',
        borderRadius: 8,
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: '#FFFFFF',
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#163166',
        marginVertical: 8,
    },
    inputGroup: {
        marginVertical: 8,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    input: {
        borderColor: '#E1E4E8',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
    },
    dateInput: {
        borderColor: '#E1E4E8',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    picker: {
        borderColor: '#E1E4E8',
        borderRadius: 8,
    },
    inputError: {
        borderColor: '#FF4D4F',
        borderWidth: 1,
    },
    errorText: {
        color: '#FF4D4F',
        fontSize: 12,
        marginTop: 4,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginVertical: 16,
    },
    errorMessage: {
        fontSize: 16,
        color: '#FF4D4F',
        marginVertical: 16,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    retryButton: {
        backgroundColor: '#163166',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 16,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
