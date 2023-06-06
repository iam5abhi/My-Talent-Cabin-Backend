const mongoose = require('mongoose');
const bcrypt = require("bcrypt");



const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/ // Email format validation using regex
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 20
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        minlength: 5,
        validate: {
            validator: function (Cpassword) {
                return Cpassword === this.password;
            },
            message: "Your password and confirmation password do not match",
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
    next();
});



adminSchema.methods.comparepassword = async function (password) { return await bcrypt.compare(password, this.password) }

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin