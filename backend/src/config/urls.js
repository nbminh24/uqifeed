const BASE_URL = process.env.BASE_URL || 'http://10.0.0.233:5000';

module.exports = {
    BASE_URL,
    getStaticUrl: (path) => `${BASE_URL}${path}`
};
