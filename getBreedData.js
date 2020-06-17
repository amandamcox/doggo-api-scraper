const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const fs = require('fs')
const url = 'https://www.akc.org/'

const getHtml = async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(url)
	await page.click(
		'body > div.page-home.bgc-white.cmw > div.homepage-hero-breed-search > div > form > div > div > div.selectize-input.items.not-full.has-options'
	)
	const html = await page.content()
	await browser.close()
	return html
}

const getBreeds = async () => {
	const html = await getHtml()
	const $ = cheerio.load(html)
	const breeds = []
	$(
		'body > div.page-home.bgc-white.cmw > div.homepage-hero-breed-search > div > form > div > div > div.selectize-dropdown.single.custom-select__select > div.selectize-dropdown-content > div.option'
	).each(function (i, elem) {
		breeds.push({
			breed: $(this).text(),
			url: $(this).attr('data-value')
		})
	})
	return breeds
}

const getBreedInfo = async () => {
	const breeds = getBreeds()
	const fullBreedInfo = []
	const browser = await puppeteer.launch()
	for (breed of breeds) {
		const page = await browser.newPage()
		page.setDefaultNavigationTimeout(0)
		page.setDefaultTimeout(0)
		console.log(`Attempting to visit ${breed.url}`)
		await page.goto(breed.url)
		const html = await page.content()
		console.log(`${breed.breed} data received`)
		await page.close()
		const $ = cheerio.load(html)
		const temperament = $(
			'#panel-overview > div > div > div.panel-flex__aside > ul > li.attribute-list__row.attribute-list__row--has-large > span.attribute-list__description.attribute-list__text.attribute-list__text--lg.mb4.bpm-mb5.pb0.d-block'
		).text()
		const height = $(
			'#panel-overview > div > div > div.panel-flex__aside > ul > li:nth-child(3) > span.attribute-list__description.attribute-list__text'
		).text()
		const weight = $(
			'#panel-overview > div > div > div.panel-flex__aside > ul > li:nth-child(4) > span.attribute-list__description.attribute-list__text'
		).text()
		const lifeEx = $(
			'#panel-overview > div > div > div.panel-flex__aside > ul > li:nth-child(5) > span.attribute-list__description.attribute-list__text'
		).text()
		const size = $(
			'#panel-overview > div > div > div.panel-flex__aside > ul > li:nth-child(6) > span.attribute-list__description.attribute-list__text > a'
		).text()
		const imageUrl = $(
			'#slick-slide00 > div.basic-slider__inner > div > img'
		)
			.first()
			.attr('data-src')
		fullBreedInfo.push({
			name: breed.breed,
			temperament,
			height,
			weight,
			lifeEx,
			size,
			imageUrl
		})
		console.log(`${breed.breed} data pushed`)
	}
	if (fullBreedInfo.length === breeds.length) {
		await browser.close()
		return fullBreedInfo
	}
}

const createJSON = async () => {
	const breeds = await getBreedInfo()
	fs.writeFile('breedData.json', JSON.stringify(breeds), err => {
		if (err) return console.log(err)
	})
}

createJSON()
