const {User, Message} = require("../models");
const {sign, verify} = require('jsonwebtoken');
// const Product = require('../models/Products');
require('dotenv').config();
const resolvers = {
    Query:{
        async users(_, args, context, info){
            console.log(_);
            return await User.find({})},
        async user(_,args, context){let user = await User.findOne({_id:args._id}); if (user) return user; return null},
        async verifyUser(_,args,context,info){
            if (context.user){
                return await User.findOne({_id: context.user._id});
            }
            else return null
        },
        async messages(){
            let messages =  await Message.find({}).populate('participants');
            console.log(messages);
            return {
                messages
            }
        }
    },
    Mutation:{
        //User MGMT//////////////
        async register(_,args,context,info){
            let toCreate = {...args};
            let user = await User.create(toCreate);
            let payload = {
                email: user.email,
                _id: user._id,
            }
            const token = await sign({payload}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXP});
            return {
                _id: user._id,
                token
            }
        },
        async login(_,args,context,info){
            let user = await User.findOne({email: args.email});
            if (user){
                let valid = await user.validatePassword(args.password);
                if (valid) {
                    let payload = {
                        email: user.email,
                        _id: user._id
                    }
                    const token = await sign({payload}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXP});
                    return {
                        _id: user._id,
                        token
                    };
                }
            }
        },
        async editUser(_,args,context,info){
            if (!context.user) throw new Error("Invalid token. Please sign in to make changes.")
            let update = await User.findOneAndUpdate({_id:context.user._id}, args, {
                returnOriginal:false
            }).catch(e=>{
                throw new Error(e);
            });
            const payload = {
                _id: update._id,
                email: update._email
            }
            const token = await sign({payload}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXP});
            return {
                token,
                updatedUser: update
            }
        },
        async deleteUser(_,args,context, info){
            if (!context.user) throw new Error("Invalid or no user. Please sign in to make changes.");
            let user = await User.findOneAndDelete({...args});
            if (user){
                return {
                    deleted:true,
                    user
                }
            } else return {
                deleted: false,
                user:null
            }
        },
        //End User MGMT//////////////
        //Message MGMT///////////////
        async createMessage(_,args, context ,info){
            if (!context.user) throw new Error("Sign in to send a message");
            let message = await Message.create({
                participants: [context.user._id,args.id],
                message: args.message
            });
            console.log(message);
            return {
                message
            };
            
        }
        
        
        //End Message MGMT///////////////
    }
}
module.exports=resolvers;