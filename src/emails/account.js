const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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';

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'parasharaniroodh@gmail.com',
        subject:'Thanks for signing up!',
        text:`Welcome to the app, ${name}. Start saving your tasks.`

    })
}


const sendCancellationEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'parasharaniroodh@gmail.com',
        subject:'Thanks for signing up!',
        text:`Hi , ${name}. Sorry to hear you cancelled the user account. Can you please tell us the reason for it so that we can improve.`

    })
}



module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
