const bcrypt = require('bcryptjs');
const User = require('../../models/users');
const jwt = require('jsonwebtoken')
const { transformUser } = require('./merge');

module.exports = {
    users: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthentificated')
        }
        try{
            const users = await User.find()
            return users.map(user => {
                return transformUser(user);
            })
        } catch(err) {
            throw err;
        }
    },
    createUser: async args => {
        try{
            const existingUser = await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User exists already.')
            }
            const hashed = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashed,
                description: args.userInput.description,
                age: +args.userInput.age,
                nickname: args.userInput.nickname
            })
            const result = await user.save();
            return { 
                ...result._doc, 
                password: null, 
                _id: result.id
            };
        } catch (err)  {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({email: email});
        if (!user){
            throw new Error('User does not exist !');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual){
            throw new Error('Password is incorrect !')
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1 }
    }
};