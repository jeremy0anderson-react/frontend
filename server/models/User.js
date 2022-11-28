const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    }
});

// set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

// compare the incoming password with the hashed password
userSchema.methods.validatePassword = async function (password) {
    return bcrypt.compareSync(password, this.password);
};
userSchema.pre('findOneAndUpdate', async function(next){
    console.log(this._update);
    try {
        if (this._update.password) {
            this._update.password = await bcrypt.hashSync(this._update.password, 10);
        }
        next();
    } catch(e){
        return next(e);
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;
