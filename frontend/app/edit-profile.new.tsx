import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Platform, ActivityIndicator, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Profile, Gender, ActivityLevel, WeightGoal, DietType } from '@/types/profile';
import { getProfile, updateProfile } from '@/services/profileService';
import { router } from 'expo-router';
import { isValidDate } from '@/services/dateUtils';

const DEFAULT_PROFILE: Profile = {
    id: '',
    userId: '',
    gender: 'Male',
    birthday: new Date().toISOString(),
    height: 170,
    currentWeight: 70,
    targetWeight: 70,
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
            console.log('Profile data:', data);

            if (data) {
                setProfile({
                    ...data,
                    height: Number(data.height) || DEFAULT_PROFILE.height,
                    currentWeight: Number(data.currentWeight) || DEFAULT_PROFILE.currentWeight,
                    targetWeight: Number(data.targetWeight) || DEFAULT_PROFILE.targetWeight,
                    birthday: data.birthday || DEFAULT_PROFILE.birthday,
                    target_time: data.target_time || DEFAULT_PROFILE.target_time,
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

    const validateInput = (value: number, field: string): string | null => {
        if (!value) {
            return `${field} is required`;
        }
        if (isNaN(value)) {
            return `${field} must be a number`;
        }
        if (value <= 0) {
            return `${field} must be greater than 0`;
        }
        return null;
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // Height validation
        const heightError = validateInput(profile.height, 'Height');
        if (heightError) newErrors.height = heightError;
        else if (profile.height < 100 || profile.height > 250) {
            newErrors.height = 'Height should be between 100cm and 250cm';
        }

        // Weight validations
        const currentWeightError = validateInput(profile.currentWeight, 'Current weight');
        if (currentWeightError) newErrors.currentWeight = currentWeightError;

        const targetWeightError = validateInput(profile.targetWeight, 'Target weight');
        if (targetWeightError) newErrors.targetWeight = targetWeightError;

        // Date validations
        const birthday = new Date(profile.birthday);
        const targetDate = new Date(profile.target_time);
        const currentDate = new Date();

        if (!isValidDate(birthday)) {
            newErrors.birthday = 'Invalid birthday';
        } else if (birthday >= currentDate) {
            newErrors.birthday = 'Birthday cannot be in the future';
        }

        if (!isValidDate(targetDate)) {
            newErrors.target_time = 'Invalid target date';
        } else if (targetDate <= currentDate) {
            newErrors.target_time = 'Target date must be in the future';
        }

        // Weight range validation
        if (profile.targetWeight && profile.currentWeight) {
            const minWeight = profile.currentWeight * 0.5;
            const maxWeight = profile.currentWeight * 1.5;
            if (profile.targetWeight < minWeight || profile.targetWeight > maxWeight) {
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
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <ThemedView style={[styles.container, styles.centered]}>
                    <ActivityIndicator size="large" color="#163166" />
                    <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
                </ThemedView>
            </SafeAreaView>
        );
    }

    if (loadError) {
        return (
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <ThemedView style={[styles.container, styles.centered]}>
                    <ThemedText style={styles.errorMessage}>{loadError}</ThemedText>
                    <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
                        <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <ThemedView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#163166" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Hồ sơ dinh dưỡng</ThemedText>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Gender Selection */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Giới tính</ThemedText>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={profile.gender}
                                onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
                                style={styles.picker}>
                                <Picker.Item label="Nam" value="Male" />
                                <Picker.Item label="Nữ" value="Female" />
                                <Picker.Item label="Khác" value="Other" />
                            </Picker>
                        </View>
                    </View>

                    {/* Birthday Selection */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Ngày sinh</ThemedText>
                        <TouchableOpacity
                            style={[styles.input, errors.birthday && styles.inputError]}
                            onPress={() => setShowBirthdayPicker(true)}>
                            <ThemedText>{formatDisplayDate(profile.birthday)}</ThemedText>
                        </TouchableOpacity>
                        {errors.birthday && <ThemedText style={styles.errorText}>{errors.birthday}</ThemedText>}
                    </View>

                    {/* Height Input */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Chiều cao (cm)</ThemedText>
                        <TextInput
                            style={[styles.input, errors.height && styles.inputError]}
                            value={profile.height?.toString()}
                            onChangeText={(value) => setProfile(prev => ({ ...prev, height: Number(value) }))}
                            keyboardType="numeric"
                            placeholder="170"
                        />
                        {errors.height && <ThemedText style={styles.errorText}>{errors.height}</ThemedText>}
                    </View>

                    {/* Current Weight Input */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Cân nặng hiện tại (kg)</ThemedText>
                        <TextInput
                            style={[styles.input, errors.currentWeight && styles.inputError]}
                            value={profile.currentWeight?.toString()}
                            onChangeText={(value) => setProfile(prev => ({ ...prev, currentWeight: Number(value) }))}
                            keyboardType="numeric"
                            placeholder="70"
                        />
                        {errors.currentWeight && <ThemedText style={styles.errorText}>{errors.currentWeight}</ThemedText>}
                    </View>

                    {/* Target Weight Input */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Cân nặng mục tiêu (kg)</ThemedText>
                        <TextInput
                            style={[styles.input, errors.targetWeight && styles.inputError]}
                            value={profile.targetWeight?.toString()}
                            onChangeText={(value) => setProfile(prev => ({ ...prev, targetWeight: Number(value) }))}
                            keyboardType="numeric"
                            placeholder="65"
                        />
                        {errors.targetWeight && <ThemedText style={styles.errorText}>{errors.targetWeight}</ThemedText>}
                    </View>

                    {/* Target Date Selection */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Ngày mục tiêu</ThemedText>
                        <TouchableOpacity
                            style={[styles.input, errors.target_time && styles.inputError]}
                            onPress={() => setShowTargetDatePicker(true)}>
                            <ThemedText>{formatDisplayDate(profile.target_time)}</ThemedText>
                        </TouchableOpacity>
                        {errors.target_time && <ThemedText style={styles.errorText}>{errors.target_time}</ThemedText>}
                    </View>

                    {/* Activity Level Selection */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Mức độ vận động</ThemedText>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={profile.activityLevel}
                                onValueChange={(value) => setProfile(prev => ({ ...prev, activityLevel: value }))}
                                style={styles.picker}>
                                <Picker.Item label="Ít vận động" value="Sedentary" />
                                <Picker.Item label="Nhẹ nhàng" value="Lightly active" />
                                <Picker.Item label="Vừa phải" value="Moderately active" />
                                <Picker.Item label="Rất năng động" value="Very active" />
                                <Picker.Item label="Cực kỳ năng động" value="Extra active" />
                            </Picker>
                        </View>
                    </View>

                    {/* Weight Goal Selection */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Mục tiêu</ThemedText>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={profile.goal}
                                onValueChange={(value) => setProfile(prev => ({ ...prev, goal: value }))}
                                style={styles.picker}>
                                <Picker.Item label="Giảm cân" value="Lose weight" />
                                <Picker.Item label="Duy trì cân nặng" value="Maintain weight" />
                                <Picker.Item label="Tăng cân" value="Gain weight" />
                            </Picker>
                        </View>
                    </View>

                    {/* Diet Type Selection */}
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Chế độ ăn</ThemedText>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={profile.dietType}
                                onValueChange={(value) => setProfile(prev => ({ ...prev, dietType: value }))}
                                style={styles.picker}>
                                <Picker.Item label="Cân bằng" value="Balanced" />
                                <Picker.Item label="Ăn chay" value="Vegetarian" />
                                <Picker.Item label="Thuần chay" value="Vegan" />
                                <Picker.Item label="Ít carb" value="Low-carb" />
                                <Picker.Item label="Keto" value="Keto" />
                            </Picker>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isLoading}>
                        <ThemedText style={styles.saveButtonText}>
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </ThemedText>
                    </TouchableOpacity>
                </ScrollView>

                {showBirthdayPicker && (
                    <DateTimePicker
                        value={new Date(profile.birthday)}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowBirthdayPicker(false);
                            if (selectedDate && event.type !== 'dismissed') {
                                setProfile(prev => ({ ...prev, birthday: selectedDate.toISOString() }));
                            }
                        }}
                    />
                )}

                {showTargetDatePicker && (
                    <DateTimePicker
                        value={new Date(profile.target_time)}
                        mode="date"
                        minimumDate={new Date()}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowTargetDatePicker(false);
                            if (selectedDate && event.type !== 'dismissed') {
                                setProfile(prev => ({ ...prev, target_time: selectedDate.toISOString() }));
                            }
                        }}
                    />
                )}
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 16,
        color: '#163166',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: '#333',
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF5F5',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
    },
    pickerContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#163166',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginVertical: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        padding: 8,
    },
    errorMessage: {
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#163166',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
});
