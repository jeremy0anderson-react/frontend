const {Schema, model} = require('mongoose');


const convoSchema = new Schema({
   participants: [{
      type: Schema.Types.ObjectId,
      ref: "User"
   }]
})


const Conversation = model('Conversation', convoSchema);


module.exports = Conversation;