const express = require('express')
//require('./db/mongoose')
const User = require("../models/user");
const auth = require('../middleware/auth')

const multer = require('multer')
const sharp = require('sharp')

const { sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')

const router = new express.Router()



/*Create a user api endpoint*/

/*Sign up API*/
router.post('/users',async (req,res) =>{
    const user = new User(req.body)

    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()

        res.send({ user,token })

    } catch (e) {
        res.status(400).send(e)

    }

    // user.save().then( ()=> {
    //         res.send(user)
    //     }
    // ).catch((e)=>{
    //     res.status(400).send(e)
    // })
})


/*Login API*/
router.post('/users/login',async (req,res) =>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user,token })
    }catch (e) {
        res.status(400).send()
    }
})

/*Logout API*/

router.post('/users/logout',auth,async (req,res) => {
        try{
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token
            })

            await req.user.save()

            res.send()
        }catch (e) {

            res.status(500).send()
            
        }
})


/*Logout All devices API*/

router.post('/users/logoutall',auth,async (req,res) => {
    try{

        req.user.tokens = []



        await req.user.save()

        res.send()
    }catch (e) {

        res.status(500).send()

    }
})




/*Get all users' data*/
// router.get('/users',auth, async (req,res)=>{
//
//     try{
//         const users = await   User.find({})
//         res.send(users)
//     } catch (e){
//         res.status(500).send(e)
//     }
//
// })

/*Get logged in user's data*/
router.get('/users/me',auth, async (req,res)=>{

   res.send(req.user)

})

/*Get single user's data*/

router.get('/users/:id', async (req,res)=>{
    const _id = req.params.id

    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch (e){
        res.status(500).send()
    }


})

/*Update/patch a user api endpoint*/

router.patch('/users/me', auth,async (req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if( !isValid){
        return res.status(400).send({error:'Invalid updates'})
    }
    try {
        //const user = await User.findById(req.user._id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()



        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true } )

        // if(!user){
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth,async (req,res) => {
    try{
        await req.user.remove()
        sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e){
        res.status(500).send()
    }
})

const upload = multer({
   // dest:'avatar',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image with .jpg,.jpeg or.png format. '))
        }

        cb(undefined, true)

    }
})




router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res) => {

    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

    req.user.avatar= buffer
    await req.user.save()
    res.send()
},(error, req, res, next) =>{
    res.status(400).send( {error:error.message})
})

router.delete('/users/me/avatar',auth,async (req,res) => {
    req.user.avatar= undefined
    await req.user.save()
    res.send()
},(error, req, res, next) =>{
    res.status(400).send( {error:error.message})
})
router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }catch (e) {
        res.status(404).send()
    }

})

module.exports = router