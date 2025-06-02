import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FoodHeaderProps {
    title: string;
    date: string;
    useAsNavigationHeader?: boolean;
}

export const FoodHeader: React.FC<FoodHeaderProps> = ({ title, date, useAsNavigationHeader = false }) => {
    // Sử dụng kiểu khác nhau tùy vào vị trí hiển thị (trong header hoặc trong content)
    if (useAsNavigationHeader) {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerContentWrap}>
                    <Text style={styles.headerTitle} numberOfLines={3} ellipsizeMode="tail">
                        {title}
                    </Text>
                    <Text style={styles.headerDate}>
                        {date}
                    </Text>
                </View>
            </View>
        );
    }

    // Kiểu mặc định khi hiển thị trong nội dung
    return (
        <View style={styles.header}>
            <ThemedText type="title" style={styles.foodTitle}>{title}</ThemedText>
            <ThemedText style={styles.dateText}>{date}</ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFFFFF',
        padding: 12,
        paddingBottom: 8,
        alignItems: 'center',
    },
    foodTitle: {
        fontSize: 22,
        color: '#333',
        marginBottom: 2,
        textAlign: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },

    // Styles cho header navigation
    headerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10, // Tăng chiều cao của header
        height: 'auto', // Tự động điều chỉnh chiều cao theo nội dung
        marginLeft: 40, // Bù trừ cho nút back ở bên trái
    },
    headerTitle: {
        color: '#333',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center', // Căn giữa text
        flexWrap: 'wrap', // Cho phép text xuống dòng
        lineHeight: 22, // Tăng khoảng cách dòng
    },
    headerDate: {
        color: '#888',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 0, // Giảm khoảng cách giữa tên và thời gian
    },
    headerContentWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
