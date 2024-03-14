const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const express = require('express');
const asyncHandler = require('../async_handler');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email_username,
    pass: process.env.email_key
  }
});

const emailSenderAddress = process.env.email_username


class EmailService {
	
	constructor() {
        this.router = express.Router();
        this.setRoutes();
    }
	
	setPost(path, handler, ...extraArgs) {
        this.router.post(path, asyncHandler(async (req, res) => handler(req, res, ...extraArgs)));
    }
	
	setRoutes() {
        this.setPost('/', this.sendEmail); // Binds this controller to function
    }
	
	 getRouter() {
        return this.router;
    }
	
	async sendEmail(req, res) {
		var mailOptions = {
				from: emailSenderAddress,
				to: req.body.user_email,
				subject: req.body.email_subject,
				text: req.body.email_body
			}; 
			
		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
			console.log(error);
		  } else {
			console.log('EmailService sent: ' + info.response);
		  }
		});
		res.sendStatus(200);
	}
}

module.exports = EmailService;