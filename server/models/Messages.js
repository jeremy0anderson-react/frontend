const {Schema, model}=require('mongoose');

const messageSchema=new Schema({
      participants: [{
         type: Schema.Types.ObjectId,
         ref: "User"
      }],
      // to: {
      //    type: Schema.Types.ObjectId,
      //    ref: "User"
      // },
      message: Schema.Types.String,
      },
   { toJSON:{
         virtuals:true,
         getters:true,
      }
   });

const Message = model('Message', messageSchema);

module.exports=Message;