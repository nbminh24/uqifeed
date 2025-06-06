import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface SettingItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
    hasArrow?: boolean;
    value?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, onPress, hasArrow = true, value }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
        <View style={styles.settingItemLeft}>
            <Ionicons name={icon} size={24} color="#163166" style={styles.settingIcon} />
            <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        </View>
        <View style={styles.settingItemRight}>
            {value && <ThemedText style={styles.settingValue}>{value}</ThemedText>}
            {hasArrow && <Ionicons name="chevron-forward" size={20} color="#999" />}
        </View>
    </TouchableOpacity>
);

export default function SettingsScreen() {
    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Account</ThemedText>                    <SettingItem
                        icon="person-outline"
                        title="Hồ sơ dinh dưỡng"
                        onPress={() => router.push('/food-history/edit-profile')}
                    />
                    <SettingItem
                        icon="notifications-outline"
                        title="Notifications"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon="lock-closed-outline"
                        title="Privacy"
                        onPress={() => { }}
                    />
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Nutrition</ThemedText>
                    <SettingItem
                        icon="fitness-outline"
                        title="Goals"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon="barbell-outline"
                        title="Daily Targets"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon="restaurant-outline"
                        title="Meal Preferences"
                        onPress={() => { }}
                    />
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>App</ThemedText>
                    <SettingItem
                        icon="language-outline"
                        title="Language"
                        value="English"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon="help-circle-outline"
                        title="Help & Support"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon="information-circle-outline"
                        title="About"
                        onPress={() => { }}
                    />
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={() => { }}>
                    <ThemedText style={styles.logoutText}>Log Out</ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        backgroundColor: '#FFFFFF',
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginHorizontal: 16,
        marginVertical: 12,
        textTransform: 'uppercase',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E1E4E8',
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: 12,
    },
    settingTitle: {
        fontSize: 16,
        color: '#333',
    },
    settingItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 16,
        color: '#666',
        marginRight: 8,
    },
    logoutButton: {
        marginVertical: 24,
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        alignItems: 'center',
    }, logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    }
});
