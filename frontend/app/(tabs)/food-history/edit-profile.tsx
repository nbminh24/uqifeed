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

const DEFAULT_PROFILE: Profile = {
    id: '',
    userId: '',
    gender: 'Male',
    birthday: new Date().toISOString(),
    height: 0,
    currentWeight: 0,
    targetWeight: 0,
    target_time: new Date().toISOString(),
    activityLevel: 'Moderately active',
    goal: 'Maintain weight',
    dietType: 'Balanced'
};

export default function EditProfileScreen() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
    const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getProfile();

            // Initialize default values for numeric fields if they're undefined
            if (data) {
                setProfile({
                    ...data,
                    birthday: isValidDate(data.birthday) ? data.birthday : new Date().toISOString(),
                    target_time: isValidDate(data.target_time) ? data.target_time : new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Lỗi', 'Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        try {
            setIsLoading(true);
            await updateProfile(profile);
            router.back();
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Lỗi', 'Không thể lưu hồ sơ. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !profile) {
        return (
            <ThemedView style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#163166" />
            </ThemedView>
        );
    }

    const formatDisplayDate = (date: string) => {
        try {
            if (!isValidDate(date)) return 'Chọn ngày';
            return format(new Date(date), 'dd/MM/yyyy');
        } catch (error) {
            return 'Chọn ngày';
        }
    };

    const handleHeightChange = (text: string) => {
        const height = parseFloat(text);
        if (!isNaN(height) && height >= 0) {
            setProfile({ ...profile, height });
        }
    };

    const handleCurrentWeightChange = (text: string) => {
        const weight = parseFloat(text);
        if (!isNaN(weight) && weight >= 0) {
            setProfile({ ...profile, currentWeight: weight });
        }
    };

    const handleTargetWeightChange = (text: string) => {
        const weight = parseFloat(text);
        if (!isNaN(weight) && weight >= 0) {
            setProfile({ ...profile, targetWeight: weight });
        }
    };

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
                    <ThemedText style={styles.saveButtonText}>Lưu</ThemedText>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Thông tin cơ bản</ThemedText>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Giới tính</ThemedText>
                        <Picker
                            selectedValue={profile.gender}
                            onValueChange={(value) => setProfile({ ...profile, gender: value as Gender })}
                            style={styles.picker}
                        >
                            <Picker.Item label="Nam" value="Male" />
                            <Picker.Item label="Nữ" value="Female" />
                        </Picker>
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Ngày sinh</ThemedText>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowBirthdayPicker(true)}
                        >
                            <ThemedText>{formatDisplayDate(profile.birthday)}</ThemedText>
                        </TouchableOpacity>
                        {showBirthdayPicker && Platform.OS === 'android' && (
                            <DateTimePicker
                                value={isValidDate(profile.birthday) ? new Date(profile.birthday) : new Date()}
                                mode="date"
                                onChange={(event, date) => {
                                    setShowBirthdayPicker(false);
                                    if (date && event.type !== 'dismissed') {
                                        setProfile({ ...profile, birthday: date.toISOString() });
                                    }
                                }}
                            />
                        )}
                        {Platform.OS === 'ios' && showBirthdayPicker && (
                            <View style={styles.datePickerContainer}>
                                <View style={styles.datePickerHeader}>
                                    <TouchableOpacity onPress={() => setShowBirthdayPicker(false)}>
                                        <ThemedText style={styles.datePickerCancel}>Hủy</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setShowBirthdayPicker(false)}>
                                        <ThemedText style={styles.datePickerDone}>Xong</ThemedText>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={isValidDate(profile.birthday) ? new Date(profile.birthday) : new Date()}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, date) => {
                                        if (date) {
                                            setProfile({ ...profile, birthday: date.toISOString() });
                                        }
                                    }}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Chiều cao (cm)</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={(profile.height || 0).toString()}
                            onChangeText={handleHeightChange}
                            keyboardType="numeric"
                            placeholder="0"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Mục tiêu</ThemedText>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Cân nặng hiện tại (kg)</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={(profile.currentWeight || 0).toString()}
                            onChangeText={handleCurrentWeightChange}
                            keyboardType="numeric"
                            placeholder="0"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Cân nặng mong muốn (kg)</ThemedText>
                        <TextInput
                            style={styles.input}
                            value={(profile.targetWeight || 0).toString()}
                            onChangeText={handleTargetWeightChange}
                            keyboardType="numeric"
                            placeholder="0"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Thời gian mong muốn đạt được</ThemedText>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowTargetDatePicker(true)}
                        >
                            <ThemedText>{formatDisplayDate(profile.target_time)}</ThemedText>
                        </TouchableOpacity>
                        {showTargetDatePicker && Platform.OS === 'android' && (
                            <DateTimePicker
                                value={isValidDate(profile.target_time) ? new Date(profile.target_time) : new Date()}
                                mode="date"
                                minimumDate={new Date()}
                                onChange={(event, date) => {
                                    setShowTargetDatePicker(false);
                                    if (date && event.type !== 'dismissed') {
                                        setProfile({ ...profile, target_time: date.toISOString() });
                                    }
                                }}
                            />
                        )}
                        {Platform.OS === 'ios' && showTargetDatePicker && (
                            <View style={styles.datePickerContainer}>
                                <View style={styles.datePickerHeader}>
                                    <TouchableOpacity onPress={() => setShowTargetDatePicker(false)}>
                                        <ThemedText style={styles.datePickerCancel}>Hủy</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setShowTargetDatePicker(false)}>
                                        <ThemedText style={styles.datePickerDone}>Xong</ThemedText>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={isValidDate(profile.target_time) ? new Date(profile.target_time) : new Date()}
                                    mode="date"
                                    display="spinner"
                                    minimumDate={new Date()}
                                    onChange={(event, date) => {
                                        if (date) {
                                            setProfile({ ...profile, target_time: date.toISOString() });
                                        }
                                    }}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Mức độ vận động</ThemedText>
                        <Picker
                            selectedValue={profile.activityLevel}
                            onValueChange={(value) => setProfile({ ...profile, activityLevel: value as ActivityLevel })}
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
                            onValueChange={(value) => setProfile({ ...profile, goal: value as WeightGoal })}
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
                            onValueChange={(value) => setProfile({ ...profile, dietType: value as DietType })}
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
    datePickerContainer: {
        backgroundColor: '#fff',
        paddingVertical: 20,
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomColor: '#E1E4E8',
    },
    datePickerCancel: {
        color: '#666',
        fontSize: 16,
    },
    datePickerDone: {
        color: '#163166',
        fontSize: 16,
        fontWeight: '600',
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
});
