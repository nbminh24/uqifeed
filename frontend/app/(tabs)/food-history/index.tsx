import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Platform,
    Animated,
    StatusBar,
    Modal,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const SAFE_AREA_TOP = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ?? 0;

interface SettingItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
    hasArrow?: boolean;
    value?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    title,
    onPress,
    hasArrow = true,
    value,
}) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
        >
            <Animated.View style={[styles.settingItem, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.settingStart}>
                    <Ionicons name={icon} size={24} color="#163166" style={styles.settingIcon} />
                    <ThemedText style={styles.settingTitle}>{title}</ThemedText>
                </View>
                <View style={styles.settingEnd}>
                    {value && <ThemedText style={styles.settingValue}>{value}</ThemedText>}
                    {hasArrow && <Ionicons name="chevron-forward" size={20} color="#999" />}
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function SettingsScreen() {
    return (
        <ThemedView style={styles.container}>
            <View style={{ paddingTop: SAFE_AREA_TOP }}>
                <View style={styles.header}>
                    <ThemedText style={styles.headerTitle}>Settings</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>Customize your experience</ThemedText>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Account</ThemedText>
                    <SettingItem icon="person-outline" title="Edit Profile" onPress={() => router.push('/edit-profile')} />
                    <SettingItem icon="notifications-outline" title="Notifications" onPress={() => { }} />
                    <SettingItem icon="lock-closed-outline" title="Privacy" onPress={() => { }} />
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Nutrition</ThemedText>
                    <SettingItem icon="fitness-outline" title="Goals" onPress={() => { }} />
                    <SettingItem icon="barbell-outline" title="Daily Targets" onPress={() => { }} />
                    <SettingItem icon="restaurant-outline" title="Meal Preferences" onPress={() => { }} />
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>App</ThemedText>
                    <SettingItem icon="language-outline" title="Language" value="English" onPress={() => { }} />
                    <SettingItem icon="help-circle-outline" title="Help & Support" onPress={() => { }} />
                    <SettingItem icon="information-circle-outline" title="About" onPress={() => { }} />
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    activeOpacity={0.8}
                    onPress={() => { }}
                >
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
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 3,
                shadowOpacity: 0.05,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#163166',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        opacity: 0.8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 16,
    },
    section: {
        backgroundColor: '#FFFFFF',
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#163166',
        marginHorizontal: 16,
        marginVertical: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        backgroundColor: '#FFFFFF',
    },
    settingStart: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: 12,
        opacity: 0.9,
    },
    settingTitle: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    settingEnd: {
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
        borderRadius: 16,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#FF6B6B',
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 8,
                shadowOpacity: 0.2,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
