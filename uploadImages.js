const aws = require('aws-sdk')
const fs = require('fs')
require('dotenv').config()

const s3 = new aws.S3({
	accessKeyId: process.env.AWS_KEY,
	secretAccessKey: process.env.AWS_SECRET
})

const breeds = JSON.parse(fs.readFileSync('breedData.json', 'utf8'))
const newBreedData = []

const uploadImage = fileName => {
	const fileContent = fs.readFileSync(fileName)
	s3.putObject(
		{
			Bucket: process.env.AWS_BUCKET,
			ACL: 'public-read',
			Key: encodeURIComponent(fileName.slice(7)),
			Body: fileContent
		},
		(err, data) => {
			if (err) throw err
			console.log(`${fileName} was uploaded`)
		}
	)
}

const updateUrl = breedName => {
	const s3Url = `https://doggoapi.s3-us-west-2.amazonaws.com/${encodeURIComponent(
		breedName
	)}.jpg`
	const breedObject = breeds.find(breed => breed.name === breedName)
	breedObject.imageUrl = s3Url
	newBreedData.push(breedObject)
}

const uploadEachBreed = async () => {
	for (breed of breeds) {
		await uploadImage(`images/${breed.name}.jpg`)
		await updateUrl(breed.name)
	}
}

const createJSON = async () => {
	await uploadEachBreed()
	fs.writeFile(
		'finalBreedData.json',
		JSON.stringify(newBreedData, null, 4),
		err => {
			if (err) throw err
			console.log('Uploads are complete')
		}
	)
}

createJSON()
