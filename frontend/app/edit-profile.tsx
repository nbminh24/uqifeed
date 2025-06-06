import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Platform, ActivityIndicator, Alert, Modal } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Profile, Gender, ActivityLevel, WeightGoal, DietType } from '@/types/profile';
import { getProfile, updateProfile } from '@/services/profileService';
import { router } from 'expo-router';
import { isValidDate } from '@/services/dateUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    dietType: 'Balanced',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

const handleAuthError = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/(auth)/login' as any);
};

export default function EditProfileScreen() {
    const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showGenderPicker, setShowGenderPicker] = useState(false);
    const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
    const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
    const [showActivityPicker, setShowActivityPicker] = useState(false);
    const [showGoalPicker, setShowGoalPicker] = useState(false);
    const [showDietPicker, setShowDietPicker] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const handleError = async (error: Error) => {
        console.error('[EditProfile] Error:', error);
        const errorMessage = error.message || 'Không thể thực hiện thao tác. Vui lòng thử lại.';

        if (errorMessage.includes('đăng nhập') || errorMessage.includes('hết hạn')) {
            await handleAuthError();
        } else {
            Alert.alert('Lỗi', errorMessage);
        }
    };

    const loadProfile = async () => {
        try {
            setLoadError(null);
            const data = await getProfile();
            setProfile(data);
        } catch (error: any) {
            handleError(error);
            setLoadError(error.message || 'Không thể tải thông tin. Vui lòng thử lại.');
        } finally {
            setIsInitialLoading(false);
        }
    };

    const handleSave = async () => {
        const validationErrors: Record<string, string> = {};

        // Validation logic
        if (!profile.gender) {
            validationErrors.gender = 'Vui lòng chọn giới tính';
        }

        if (!profile.birthday || !isValidDate(new Date(profile.birthday))) {
            validationErrors.birthday = 'Vui lòng chọn ngày sinh hợp lệ';
        }

        if (profile.height !== null) {
            if (profile.height < 100 || profile.height > 250) {
                validationErrors.height = 'Chiều cao phải từ 100cm đến 250cm';
            }
        } else {
            validationErrors.height = 'Vui lòng nhập chiều cao';
        }

        if (profile.currentWeight !== null) {
            if (profile.currentWeight < 30 || profile.currentWeight > 300) {
                validationErrors.currentWeight = 'Cân nặng phải từ 30kg đến 300kg';
            }
        } else {
            validationErrors.currentWeight = 'Vui lòng nhập cân nặng hiện tại';
        }

        if (profile.targetWeight !== null) {
            if (profile.targetWeight < 30 || profile.targetWeight > 300) {
                validationErrors.targetWeight = 'Cân nặng mục tiêu phải từ 30kg đến 300kg';
            }
        } else {
            validationErrors.targetWeight = 'Vui lòng nhập cân nặng mục tiêu';
        }

        if (!profile.target_time || !isValidDate(new Date(profile.target_time))) {
            validationErrors.target_time = 'Vui lòng chọn ngày mục tiêu hợp lệ';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            Alert.alert('Lỗi', 'Vui lòng kiểm tra lại thông tin');
            return;
        }

        try {
            setIsLoading(true);
            await updateProfile(profile);
            Alert.alert('Thành công', 'Đã cập nhật thông tin thành công');
            router.back();
        } catch (error: any) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDisplayDate = (date: string) => {
        try {
            return format(new Date(date), 'dd/MM/yyyy');
        } catch {
            return 'Invalid date';
        }
    };

    const validateInput = (value: number | null, field: string): string | null => {
        if (!value) {
            return `${field} là bắt buộc`;
        }
        if (isNaN(value)) {
            return `${field} phải là số`;
        }
        if (value <= 0) {
            return `${field} phải lớn hơn 0`;
        }
        return null;
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // Height validation
        const heightError = validateInput(profile.height, 'Chiều cao');
        if (heightError) newErrors.height = heightError;
        else if (profile.height !== null && (profile.height < 100 || profile.height > 250)) {
            newErrors.height = 'Chiều cao phải từ 100cm đến 250cm';
        }

        // Weight validations
        const currentWeightError = validateInput(profile.currentWeight, 'Cân nặng hiện tại');
        if (currentWeightError) newErrors.currentWeight = currentWeightError;

        const targetWeightError = validateInput(profile.targetWeight, 'Cân nặng mục tiêu');
        if (targetWeightError) newErrors.targetWeight = targetWeightError;

        // Date validations
        const birthday = new Date(profile.birthday);
        const targetDate = new Date(profile.target_time);
        const currentDate = new Date();

        if (!isValidDate(birthday)) {
            newErrors.birthday = 'Ngày sinh không hợp lệ';
        } else if (birthday >= currentDate) {
            newErrors.birthday = 'Ngày sinh không thể là tương lai';
        }

        if (!isValidDate(targetDate)) {
            newErrors.target_time = 'Ngày mục tiêu không hợp lệ';
        } else if (targetDate <= currentDate) {
            newErrors.target_time = 'Ngày mục tiêu phải là tương lai';
        }

        // Weight range validation
        if (profile.targetWeight && profile.currentWeight) {
            const minWeight = profile.currentWeight * 0.5;
            const maxWeight = profile.currentWeight * 1.5;
            if (profile.targetWeight < minWeight || profile.targetWeight > maxWeight) {
                newErrors.targetWeight = 'Cân nặng mục tiêu nên trong khoảng ±50% cân nặng hiện tại';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getActivityLevelLabel = (value: ActivityLevel) => {
        switch (value) {
            case 'Sedentary': return 'Ít vận động (hầu như không vận động)';
            case 'Lightly active': return 'Nhẹ nhàng (1-3 lần/tuần)';
            case 'Moderately active': return 'Vừa phải (3-5 lần/tuần)';
            case 'Very active': return 'Tích cực (6-7 lần/tuần)';
            case 'Extra active': return 'Rất tích cực (nhiều lần/ngày)';
            default: return value;
        }
    };

    const getGenderLabel = (value: Gender) => {
        switch (value) {
            case 'Male': return 'Nam';
            case 'Female': return 'Nữ';
            default: return value;
        }
    };

    const getWeightGoalLabel = (value: WeightGoal) => {
        switch (value) {
            case 'Lose weight': return 'Giảm cân';
            case 'Maintain weight': return 'Giữ cân';
            case 'Gain weight': return 'Tăng cân';
            default: return value;
        }
    }; const getDietTypeLabel = (value: DietType) => {
        switch (value) {
            case 'Balanced': return 'Cân bằng (đủ chất)';
            case 'Vegetarian': return 'Chay (có trứng sữa)';
            case 'Vegan': return 'Thuần chay';
            case 'Low-carb': return 'Ít carb';
            case 'Keto': return 'Keto';
            default: return value;
        }
    };

    if (isInitialLoading) {
        return (
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <ThemedView style={[styles.container, styles.centered]}>
                    <ActivityIndicator size="large" color="#163166" />
                    <ThemedText style={styles.loadingText}>Đang tải thông tin...</ThemedText>
                </ThemedView>
            </SafeAreaView>
        );
    }

    if (loadError) {
        return (
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <ThemedView style={[styles.container, styles.centered]}>
                    <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
                    <ThemedText style={styles.errorMessage}>{loadError}</ThemedText>
                    <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
                        <ThemedText style={styles.retryButtonText}>Thử lại</ThemedText>
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
                    <ThemedText style={styles.headerTitle}>Thông tin cá nhân</ThemedText>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollViewContent}
                >
                    {/* Basic Information Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Thông tin cơ bản</ThemedText>

                        {/* Gender Selection */}
                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Giới tính</ThemedText>
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPress={() => setShowGenderPicker(true)}
                            >
                                <ThemedText style={styles.selectButtonText}>
                                    {getGenderLabel(profile.gender)}
                                </ThemedText>
                                <MaterialIcons name="arrow-drop-down" size={24} color="#163166" />
                            </TouchableOpacity>
                        </View>

                        {/* Birthday Selection */}
                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Ngày sinh</ThemedText>
                            <TouchableOpacity
                                style={[styles.dateInput, errors.birthday && styles.inputError]}
                                onPress={() => setShowBirthdayPicker(true)}>
                                <ThemedText>{formatDisplayDate(profile.birthday)}</ThemedText>
                            </TouchableOpacity>
                            {errors.birthday && (
                                <ThemedText style={styles.errorText}>{errors.birthday}</ThemedText>
                            )}
                        </View>

                        {/* Height Input */}
                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Chiều cao (cm)</ThemedText>
                            <TextInput
                                style={[styles.input, errors.height && styles.inputError]}
                                value={profile.height?.toString() || ''}
                                onChangeText={(value) => setProfile(prev => ({ ...prev, height: value ? Number(value) : null }))}
                                keyboardType="numeric"
                                placeholder="170"
                                placeholderTextColor="#A0A0A0"
                            />
                            {errors.height && (
                                <ThemedText style={styles.errorText}>{errors.height}</ThemedText>
                            )}
                        </View>
                    </View>

                    {/* Weight Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Mục tiêu cân nặng</ThemedText>

                        {/* Current Weight Input */}
                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Cân nặng hiện tại (kg)</ThemedText>
                            <TextInput
                                style={[styles.input, errors.currentWeight && styles.inputError]}
                                value={profile.currentWeight?.toString() || ''}
                                onChangeText={(value) => setProfile(prev => ({ ...prev, currentWeight: value ? Number(value) : null }))}
                                keyboardType="numeric"
                                placeholder="70"
                                placeholderTextColor="#A0A0A0"
                            />
                            {errors.currentWeight && (
                                <ThemedText style={styles.errorText}>{errors.currentWeight}</ThemedText>
                            )}
                        </View>

                        {/* Target Weight Input */}
                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Cân nặng mục tiêu (kg)</ThemedText>
                            <TextInput
                                style={[styles.input, errors.targetWeight && styles.inputError]}
                                value={profile.targetWeight?.toString() || ''}
                                onChangeText={(value) => setProfile(prev => ({ ...prev, targetWeight: value ? Number(value) : null }))}
                                keyboardType="numeric"
                                placeholder="65"
                                placeholderTextColor="#A0A0A0"
                            />
                            {errors.targetWeight && (
                                <ThemedText style={styles.errorText}>{errors.targetWeight}</ThemedText>
                            )}
                        </View>

                        {/* Target Date Selection */}
                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Ngày mục tiêu</ThemedText>
                            <TouchableOpacity
                                style={[styles.dateInput, errors.target_time && styles.inputError]}
                                onPress={() => setShowTargetDatePicker(true)}>
                                <ThemedText>{formatDisplayDate(profile.target_time)}</ThemedText>
                            </TouchableOpacity>
                            {errors.target_time && (
                                <ThemedText style={styles.errorText}>{errors.target_time}</ThemedText>
                            )}
                        </View>
                    </View>

                    {/* Activity & Goals Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Hoạt động & Mục tiêu</ThemedText>

                        {/* Activity Level Selection */}
                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Mức độ hoạt động</ThemedText>
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPress={() => setShowActivityPicker(true)}
                            >
                                <ThemedText style={styles.selectButtonText}>
                                    {getActivityLevelLabel(profile.activityLevel)}
                                </ThemedText>
                                <MaterialIcons name="arrow-drop-down" size={24} color="#163166" />
                            </TouchableOpacity>
                        </View>

                        {/* Weight Goal Selection */}
                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Mục tiêu cân nặng</ThemedText>
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPress={() => setShowGoalPicker(true)}
                            >
                                <ThemedText style={styles.selectButtonText}>
                                    {getWeightGoalLabel(profile.goal)}
                                </ThemedText>
                                <MaterialIcons name="arrow-drop-down" size={24} color="#163166" />
                            </TouchableOpacity>
                        </View>

                        {/* Diet Type Selection */}
                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>Loại chế độ ăn</ThemedText>
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPress={() => setShowDietPicker(true)}
                            >
                                <ThemedText style={styles.selectButtonText}>
                                    {getDietTypeLabel(profile.dietType)}
                                </ThemedText>
                                <MaterialIcons name="arrow-drop-down" size={24} color="#163166" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isLoading}>
                        <ThemedText style={styles.saveButtonText}>
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </ThemedText>
                    </TouchableOpacity>
                </ScrollView>

                {/* Date Pickers */}
                {showBirthdayPicker && (
                    <DateTimePicker
                        value={new Date(profile.birthday)}
                        mode="date"
                        maximumDate={new Date()}
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

                {/* Modal Pickers */}
                <Modal
                    visible={showGenderPicker}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <ThemedText style={styles.modalTitle}>Chọn giới tính</ThemedText>
                                <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                                    <MaterialIcons name="close" size={24} color="#163166" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                {[
                                    { label: 'Nam', value: 'Male' },
                                    { label: 'Nữ', value: 'Female' }
                                ].map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={[
                                            styles.modalItem,
                                            profile.gender === item.value && styles.modalItemSelected
                                        ]}
                                        onPress={() => {
                                            setProfile(prev => ({ ...prev, gender: item.value as Gender }));
                                            setShowGenderPicker(false);
                                        }}
                                    >
                                        <ThemedText style={[
                                            styles.modalItemText,
                                            profile.gender === item.value && styles.modalItemTextSelected
                                        ]}>
                                            {item.label}
                                        </ThemedText>
                                        {profile.gender === item.value && (
                                            <MaterialIcons name="check" size={24} color="#163166" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showActivityPicker}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <ThemedText style={styles.modalTitle}>Chọn mức độ hoạt động</ThemedText>
                                <TouchableOpacity onPress={() => setShowActivityPicker(false)}>
                                    <MaterialIcons name="close" size={24} color="#163166" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                {[
                                    { label: 'Ít vận động (hầu như không vận động)', value: 'Sedentary' },
                                    { label: 'Nhẹ nhàng (1-3 lần/tuần)', value: 'Lightly active' },
                                    { label: 'Vừa phải (3-5 lần/tuần)', value: 'Moderately active' },
                                    { label: 'Tích cực (6-7 lần/tuần)', value: 'Very active' },
                                    { label: 'Rất tích cực (nhiều lần/ngày)', value: 'Extra active' }
                                ].map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={[
                                            styles.modalItem,
                                            profile.activityLevel === item.value && styles.modalItemSelected
                                        ]}
                                        onPress={() => {
                                            setProfile(prev => ({ ...prev, activityLevel: item.value as ActivityLevel }));
                                            setShowActivityPicker(false);
                                        }}
                                    >
                                        <ThemedText style={[
                                            styles.modalItemText,
                                            profile.activityLevel === item.value && styles.modalItemTextSelected
                                        ]}>
                                            {item.label}
                                        </ThemedText>
                                        {profile.activityLevel === item.value && (
                                            <MaterialIcons name="check" size={24} color="#163166" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showGoalPicker}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <ThemedText style={styles.modalTitle}>Chọn mục tiêu cân nặng</ThemedText>
                                <TouchableOpacity onPress={() => setShowGoalPicker(false)}>
                                    <MaterialIcons name="close" size={24} color="#163166" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                {[
                                    { label: 'Giảm cân', value: 'Lose weight' },
                                    { label: 'Giữ cân', value: 'Maintain weight' },
                                    { label: 'Tăng cân', value: 'Gain weight' }
                                ].map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={[
                                            styles.modalItem,
                                            profile.goal === item.value && styles.modalItemSelected
                                        ]}
                                        onPress={() => {
                                            setProfile(prev => ({ ...prev, goal: item.value as WeightGoal }));
                                            setShowGoalPicker(false);
                                        }}
                                    >
                                        <ThemedText style={[
                                            styles.modalItemText,
                                            profile.goal === item.value && styles.modalItemTextSelected
                                        ]}>
                                            {item.label}
                                        </ThemedText>
                                        {profile.goal === item.value && (
                                            <MaterialIcons name="check" size={24} color="#163166" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showDietPicker}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <ThemedText style={styles.modalTitle}>Chọn loại chế độ ăn</ThemedText>
                                <TouchableOpacity onPress={() => setShowDietPicker(false)}>
                                    <MaterialIcons name="close" size={24} color="#163166" />
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                {[{ label: 'Cân bằng (đủ chất)', value: 'Balanced' },
                                { label: 'Chay (có trứng sữa)', value: 'Vegetarian' },
                                { label: 'Thuần chay', value: 'Vegan' },
                                { label: 'Ít carb', value: 'Low-carb' },
                                { label: 'Keto', value: 'Keto' }
                                ].map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={[
                                            styles.modalItem,
                                            profile.dietType === item.value && styles.modalItemSelected
                                        ]}
                                        onPress={() => {
                                            setProfile(prev => ({ ...prev, dietType: item.value as DietType }));
                                            setShowDietPicker(false);
                                        }}
                                    >
                                        <ThemedText style={[
                                            styles.modalItemText,
                                            profile.dietType === item.value && styles.modalItemTextSelected
                                        ]}>
                                            {item.label}
                                        </ThemedText>
                                        {profile.dietType === item.value && (
                                            <MaterialIcons name="check" size={24} color="#163166" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
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
        shadowOffset: { height: 2, width: 0 },
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
    backButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 16,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#163166',
        marginBottom: 16,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4A4A4A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333333',
    },
    dateInput: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
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
    dropdownContainer: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dropdown: {
        height: 50,
        width: '100%',
        backgroundColor: 'transparent',
    },
    dropdownIcon: {
        position: 'absolute',
        right: 10,
        top: 13,
        pointerEvents: 'none',
    },
    saveButton: {
        backgroundColor: '#163166',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { height: 2, width: 0 },
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
    errorMessage: {
        color: '#FF3B30',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 32,
        fontSize: 16,
    },
    retryButton: {
        backgroundColor: '#163166',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666666',
    },
    selectButton: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectButtonText: {
        fontSize: 16,
        color: '#333333',
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        minHeight: 300,
        width: '100%',
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#163166',
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalItemSelected: {
        backgroundColor: '#F0F7FF',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333333',
    },
    modalItemTextSelected: {
        color: '#163166',
        fontWeight: '600',
    },
});
