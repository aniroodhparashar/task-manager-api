//CRUD operations

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID  = mongodb.ObjectId

const  { MongoClient, ObjectId} = require('mongodb')

const id = new ObjectId()

// console.log(id.id.length)
// console.log(id.toHexString().length)
// //console.log(id.getTimestamp())

const connectionURL = 'mongodb://0.0.0.0:27017'
const databaseName ='task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true },(error,client) =>{
    if(error) {
        return console.log('Unable to connect to the database!')
    }

    const db = client.db(databaseName)
    //
    // db.collection('users').insertOne({
    //     _id:id,
    //     name:'ABCD',
    //     age:24
    // },(error, result) => {
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }
    //
    //     console.log(result.ops)
    //
    // })

    // db.collection('users').insertMany([
    //     {
    //         name:'Mani',
    //         age:28
    //     }, {
    //         name:'Tada',
    //         age:2
    //     }
    // ], (error, result) =>{
    //
    //     if(error){
    //         return console.log('Unable to insert documents')
    //     }
    //
    //     console.log('hello')
    //     console.log(result.ops)
    // })


    // db.collection('task').insertMany([
    //     {
    //         description:'1st task',
    //         completed:0
    //     }, {
    //         description:'2nd task',
    //         completed:1
    //     }, {
    //         description:'3rd task',
    //         completed:1
    //     }
    // ], (error, result) =>{
    //
    //     if(error){
    //         return console.log('Unable to insert documents')
    //     }
    //
    //     console.log('hello')
    //     console.log(result.ops)
    // })


    /*Select query equivalent*/

    // db.collection('users').findOne( {_id :new ObjectId("641c4c34d8f25b415af0033c")}, (error,user)=>{
    //
    //     if(error){
    //         return console.log('unable to fetch')
    //     }
    //
    //     console.log(user)
    // })

    // db.collection('users').find({age:31}  ).toArray((error,users)=>{
    //     console.log(users)
    // })


    //
    //
    // db.collection('task').findOne( {_id :new ObjectId("641c4db0122251418c39b3c0")}, (error,task)=>{
    //
    //     if(error){
    //         return console.log('unable to fetch')
    //     }
    //
    //     console.log(task)
    // })
    //
    // db.collection('task').find({completed:1}  ).toArray((error,tasks)=>{
    //     console.log(tasks)
    // })

    /*Update documents*/


   // db.collection('users').updateOne( {
   //      _id:new ObjectId('641c32e9cadd463ff5e836b2')
   //  },{
   //      $inc:{
   //           age:2
   //      }
   //  }).then( (result)=>{
   //      console.log(result)
   //  }).catch((error) =>{
   //      console.log(error)
   //  })



    // db.collection('task').updateMany( {
    //     completed:false
    // },{
    //
    //     $set:{
    //         completed:true,
    //
    //     }
    // }).then( (result)=>{
    //     console.log(result.modifiedCount)
    // }).catch((error)=>{
    //     console.log(error)
    // })


    db.collection('task').deleteMany({
        completed:true
    }).then((result) =>{
        console.log(result)
    }).catch((error) =>{
        console.log(error)
    })

})
