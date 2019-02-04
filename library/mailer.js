'use strict';
const nodemailer = require('nodemailer');

module.exports = class Mailer {

	constructor( mailConfig) {
		this.from = mailConfig.from
		this.to = mailConfig.to

		const smtpConfig = {
			host: mailConfig.host,
			port: mailConfig.port,
			secure: false, // upgrade later with STARTTLS
			auth: {
				user: mailConfig.username,
				pass: mailConfig.password
			}
		};
		this.transporter = nodemailer.createTransport( smtpConfig )
		this.transporter.verify(function(error, success) {
			if (error) {
				throw Error(error);
			}
		});

	}

	buildMessageBody( jobs ) {
		this.message = "Hi,\n\n"
		this.message += "Here is the new jobs added on your job board:\n"

		for( let job of jobs) {
			this.message += job.title + ' - ' + job.company + "\n"
			this.message += job.link + "\n\n"
		}

		this.message += "Hope this helps\n"
		this.message += "The machines that works for you =)"
	}


	sendMail() {
		var message = {
			from: this.from,
			to: this.to,
			subject: "New Jobs on WTTJ",
			text: this.message
		};

		this.transporter.sendMail(message, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	}

}