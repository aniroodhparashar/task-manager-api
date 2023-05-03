const mongoose = require('mongoose')
const validator = require("validator");


/*Defining task model*/


const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true

    },
    completed:{
        type:Boolean,
        default: false
    },
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true

})

// const Task = mongoose.model('Task',{
//     description:{
//         type:String,
//         trim:true,
//         required:true
//
//     },
//     completed:{
//         type:Boolean,
//         default: false
//     },
//     user_id:{
//         type:mongoose.SchemaTypes.ObjectId,
//         required:true,
//         ref:'User'
//     }
// })
const Task = mongoose.model('Task',taskSchema)

module.exports = Task