# Welcome To The Jungle.co Scaper

wttj (**welcometothejungle**) is a great job board!

**For some reason the jobs are not sorted by date and there is no notification system.**

In order to keep me posted with the newly added jobs I decided to code a tiny bot.

Every time the bot is executed it will check all the jobs available on specific searches (see getting started). If there are new ones, you'll receive an email with the jobs title and a link to wttj.

## Getting Started

* Copy **config.json.example** as **config.json**
* Set your own STMP account configuration
* In the searches key, you can copy as many wttj searches as you want

Then:
```
npm install
node bin/main.js
```

### Prerequisites

* NodeJS >= 8
* SMTP server (Gmail account works fine)

## Deployment

Remember to add this script to your cron 


## Authors

**Machavia Pichet**

## License

This project is licensed under the MIT License

