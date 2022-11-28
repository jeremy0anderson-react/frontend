const {Schema, model} = require('mongoose');

const imageSchema=new Schema({
   name: Schema.Types.String,
   desc: Schema.Types.String,
   img: {
      data: Schema.Types.Buffer,
      contentType: Schema.Types.String
   }
})

module.exports = model('Image', imageSchema);