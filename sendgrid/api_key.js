require("dotenv").config({  path:"./config/.env"  });
const sgMail = require("@sendgrid/mail");
const apiid = process.env.API_KEY;
sgMail.setApiKey(apiid);

const sendWelcomemail = (email,name) => {

    const msg = {
        to: email,
        from: 'vishwashdwivedi26@gmail.com',
        subject: 'A WELCOME NOTE !',
        html: `<h1> Holla ${name} ! </h1> <br> <h1> WELCOME TO THE TASK MANAGER ! </h1> <br> <h2><i> We welcome you to our fully-deplyed and working task manager application which provides you full functionality to manage your daily tasks !... Hope so you would love the your expereince with us! ...<br> All the best ! </i></h2>`
    
    };
    
    sgMail.send(msg).catch((e) => console.log(e));

}

const sendByemail = (email,name) => {

    const msg = {
        to: email,
        from: 'vishwashdwivedi26@gmail.com',
        subject: 'A BYE NOTE !',
        html: `<h1> Holla ${name} ! </h1> <br> <h1> A WARM BYE FROM THE TASK MANAGER ! </h1> <br> <h2><i> !Hope so , You are not satisfied with our services , Do give us your precious reviews so that we can prove oursleves worthfull in futher user's expereinces... <br> THANK YOU ! </i></h2>`
    
    };
    
    sgMail.send(msg).catch((e) => console.log(e));

}


module.exports = {
    sendWelcomemail,
    sendByemail
}