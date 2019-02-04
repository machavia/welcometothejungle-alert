'use strict';
const fs = require('fs');

module.exports = class Job {

	constructor( storagePath ) {
		this.path = storagePath
		if( !fs.existsSync(  storagePath) ) {
			fs.writeFileSync( storagePath, JSON.stringify( {} ), 'utf8');
		}

		this.registry = JSON.parse( fs.readFileSync( storagePath, 'utf8') );
		this.newJobs = []
	}

	add( title, company, link ) {
		if( !title || !company || !link ) {
			throw Error ('Missing params')
		}

		this.registry[link] = {
			'title' : title,
			'company' : company,
			'link' : link,
			'time' : Date.now(),
		}
	}

	save() {
		fs.writeFileSync( this.path, JSON.stringify( this.registry ), 'utf8');
	}

	handleJobs( list ) {

		let newJobs = []

		for( let job of list ) {

			if (this.registry[job['link']]) continue

			this.add(job['title'], job['company'], job['link'] )
			newJobs.push(job)
		}

		if( newJobs.length > 0 )  {
			this.save()
			this.newJobs.push( ...newJobs );
		}

		return newJobs

	}


}
