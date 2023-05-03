const express = require('express')
//require('./db/mongoose')

const auth = require('../middleware/auth')
const Task = require("../models/task");
const User = require("../models/user");
const router = new express.Router()





/*Create a task api endpoint*/
router.post('/tasks', auth,async (req,res) =>{
  //  const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        user_id:req.user._id
    })

    try{
        await task.save()
        res.send(task)
    } catch (e){
        res.status(400).send(e)
    }

})


/*Get all tasks' data
* GET /tasks?completed=false for incomplete tasks
* GET /tasks?limit=10&skip=0 ->skip for skip results or change page number
* GET /tasks?sortBy=createdAt:asc
*
* */
router.get('/tasks',auth,async (req,res)=>{

    const match = {}
    const sort ={}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] ==='desc' ? -1 : 1
    }
    try{
        //const tasks = await Task.find({})


        await req.user.populate({
            path:  'userTasks',
            match:match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort

            }
        }).execPopulate()

        res.send(req.user.userTasks)
    } catch (e){
        res.status(500).send(e)
    }


})

/*Get single task's' data*/
router.get('/tasks/:id',auth, async (req,res)=>{
    const _id = req.params.id

    try {

        const task = await Task.findOne({_id , user_id:req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e){
        res.status(500).send(e)
    }
})



/*update a task api endpoint*/

router.patch('/tasks/:id', auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if( !isValid){
        return res.status(400).send({error:'Invalid updates'})
    }
    try {
       // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true } )

       // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id:req.params.id,user_id:req.user._id})

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e){
        res.status(400).send(e)
    }
})


router.delete('/tasks/:id',auth, async (req,res) => {
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
         const task = await Task.findOneAndDelete({_id:req.params.id,user_id:req.user._id})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e){
        res.status(500).send()
    }
})


module.exports = router