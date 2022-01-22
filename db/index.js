const  mongoose = require("mongoose");
 
exports.connect  = ()=> {
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        }).then((res)=>{
            console.log(`MongoDB started on url ${process.env.MONGODB_URL}`);
        }).catch((err)=>{
            console.log(`DBError ${err}`);
        })
};