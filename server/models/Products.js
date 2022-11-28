const {Schema, model} = require('mongoose');


const prodSchema = new Schema({
    title:{
        type:Schema.Types.String,
        required:true
    },
    price:{
        type: Schema.Types.Number,
        required:true
    },
    description:{
        type:Schema.Types.String,
        required:true
    }

})
prodSchema.virtual('').get(function(){
    let price = this.price.toString();
    price.replace(price.charAt(price.length-2),`.${price.charAt(price.length-2)}`)
    return`$${price}`;
})

const Product = model('products', prodSchema);

module.exports = Product;