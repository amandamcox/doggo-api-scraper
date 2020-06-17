const axios = require('axios')
const fs = require('fs')
const path = require('path')

const breeds = JSON.parse(fs.readFileSync('breedData.json', 'utf8'))

const downloadImages = async () => {
	for (breed of breeds) {
		const imagePath = path.resolve(__dirname, 'images', `${breed.name}.jpg`)
		const writer = fs.createWriteStream(imagePath)

		const res = await axios({
			method: 'get',
			url: breed.imageUrl,
			responseType: 'stream'
		})
		console.log(`Downloaded ${breed.name} image`)

		res.data.pipe(writer)
	}
}

downloadImages()
