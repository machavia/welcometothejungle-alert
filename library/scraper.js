'use strict';
const puppeteer = require('puppeteer');


module.exports = class Scraper {

	constructor( JobOb, jobPerPage ) {
		this.jobOb = JobOb
		this.jobPerPage = jobPerPage
	}

	async scrap( targetUrl ) {
		const browser = await puppeteer.launch({headless: true});
		this.pageOb = await browser.newPage();
		let page = 0
		let jobs = 0

		do {
			page++;
			const url = targetUrl.replace( '[PAGE]', page)
			console.log( '->', url );
			jobs = await this.getPageJobs( url )
		}
		while ( jobs.length == this.jobPerPage )

		await browser.close();

	}

	async getPageJobs( url ) {


		await this.pageOb.goto(url, {waitUntil: 'networkidle0'});

		let pageExist = await this.pageOb.evaluate(() =>
			[...document.querySelectorAll('li.ais-Hits-item>a')].length,
		);

		if( pageExist == 0 ) {
			console.log( 'Page does not exit' );
			return Promise.resolve([]);
		}

		const links = this.pageOb.evaluate(() =>
			[...document.querySelectorAll('li.ais-Hits-item>a')].map(link => link.href),
		);

		const companies = this.pageOb.evaluate(() =>
			[...document.querySelectorAll('li.ais-Hits-item>a>div>header>h4>span>span')].map(e => e.textContent),
		);

		const titles = this.pageOb.evaluate(() =>
			[...document.querySelectorAll('li.ais-Hits-item>a>div>header>h3>span')].map(e => e.textContent ),
		);


		return Promise.all( [links,companies, titles])
			.catch((e) => {
				throw Error( e )
			})
			.then((res) => {

				if( res[0].length != res[1].length || res[0].length != res[2].length) {
					console.error( res );
					Promise.reject('Details not match with links ')
				}

				let merged = res[0].map(function(e, i) {
					return {'link' :e, 'company' : res[1][i], 'title' : res[2][i]};
				});

				let newj = this.jobOb.handleJobs( merged )
				console.log( 'Jobs Found (new/total) ' + newj.length + '/' + merged.length );
				return merged
			})

	}

}
