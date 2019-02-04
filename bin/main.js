'use strict';

const config = require("../config")
const Job = require( '../library/job');
const Scraper = require( '../library/scraper');
const Mailer = require( '../library/mailer');

const JobOb = new Job(config.path);
const MailerOb = new Mailer(config.mailer)

let promises = []

for( let url of config.searches ) {
	const ScraperOb = new Scraper( JobOb, config.jobsPerPage )
	url = url.replace( '&page=1', '&page=[PAGE]');
	promises.push( ScraperOb.scrap( url ) );
}

Promise.all( promises )
	.catch((e) => {
		throw Error( e )
	})
	.then((res) => {
		if( JobOb.newJobs.length > 0 ) {
			MailerOb.buildMessageBody(JobOb.newJobs)
			MailerOb.sendMail()
		}
	});
