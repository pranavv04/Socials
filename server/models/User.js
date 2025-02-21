const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    link: {
        type: String,
    },
    profilePicture: {
        type: String,
        required: true,
        default: 'https://imgs.search.brave.com/NdiLH8eEMYb8PyIspQb5ViI6PeTmrnRQBJtZvFzwKsw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbGF5/LWxoLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS96LXBwd0Y2Mi1G/dVhITU83cTIwcnJC/TVplT25IZngxdDlV/UGtVcXR5b3V1R1c3/V2JlVVpFQ215ZU5I/QXVzMkpjeHc9dzUy/Ni1oMjk2LXJ3'
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

// Hashing password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);  // Corrected order
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

// Comparing password while logging in
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
