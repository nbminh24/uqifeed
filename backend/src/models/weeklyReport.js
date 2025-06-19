const { db, FieldValue } = require('../config/firebase');

class WeeklyReport {
    constructor({ userId, weekStart, weekEnd, bmi, height, weight, avgNutrition, analysis, score }) {
        this.userId = userId;
        this.weekStart = weekStart;
        this.weekEnd = weekEnd;
        this.bmi = bmi;
        this.height = height;
        this.weight = weight;
        this.avgNutrition = avgNutrition; // Weekly average nutrition data
        this.analysis = analysis; // Nutrition analysis and recommendations
        this.score = score; // Overall weekly nutrition score
        this.createdAt = FieldValue.serverTimestamp();
        this.updatedAt = FieldValue.serverTimestamp();
    }

    // Generate document ID in format: userId_YYYYMMDD (using weekStart)
    static generateId(userId, weekStart) {
        const date = new Date(weekStart);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${userId}_${year}${month}${day}`;
    }

    // Save or update weekly report
    async save() {
        const docId = WeeklyReport.generateId(this.userId, this.weekStart);
        const reportRef = db.collection('weeklyReports').doc(docId);

        const data = {
            userId: this.userId,
            weekStart: this.weekStart,
            weekEnd: this.weekEnd,
            bmi: this.bmi,
            height: this.height,
            weight: this.weight,
            avgNutrition: this.avgNutrition,
            analysis: this.analysis,
            score: this.score,
            updatedAt: FieldValue.serverTimestamp()
        };

        // For new documents, add createdAt
        const doc = await reportRef.get();
        if (!doc.exists) {
            data.createdAt = FieldValue.serverTimestamp();
        }

        await reportRef.set(data, { merge: true });
        return docId;
    }

    // Get weekly report by userId and weekStart
    static async getByWeek(userId, weekStart) {
        const docId = WeeklyReport.generateId(userId, weekStart);
        const doc = await db.collection('weeklyReports').doc(docId).get();

        if (!doc.exists) {
            return null;
        }

        return doc.data();
    }

    // Get weekly reports history within date range
    static async getHistory(userId, startDate, endDate) {
        const startId = WeeklyReport.generateId(userId, startDate);
        const endId = WeeklyReport.generateId(userId, endDate);

        const snapshot = await db.collection('weeklyReports')
            .where('userId', '==', userId)
            .orderBy('__name__')
            .startAt(startId)
            .endAt(endId)
            .get();

        return snapshot.docs.map(doc => doc.data());
    }

    // Calculate BMI and category
    static calculateBMIInfo(weight, height) {
        if (!weight || !height || height <= 0) {
            return { bmi: null, category: null };
        }

        const heightInMeters = height / 100; // Convert cm to meters
        const bmi = weight / (heightInMeters * heightInMeters);

        let category;
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';

        return {
            bmi: Math.round(bmi * 10) / 10, // Round to 1 decimal place
            category
        };
    }
}

module.exports = WeeklyReport;
