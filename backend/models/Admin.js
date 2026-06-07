const mongoose = require('mongoose');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Simple SHA-256 hash (no extra deps needed)
adminSchema.statics.hashPassword = function (password) {
    return crypto.createHash('sha256').update(password + 'flipkart_admin_salt_2024').digest('hex');
};

adminSchema.statics.createDefault = async function () {
    const Admin = this;
    const exists = await Admin.findOne({ username: 'admin' });
    if (!exists) {
        await Admin.create({
            username: 'admin',
            passwordHash: Admin.hashPassword('admin123')
        });
        console.log('[Admin] Default admin created: username=admin, password=admin123');
    }
};

module.exports = mongoose.model('Admin', adminSchema);
