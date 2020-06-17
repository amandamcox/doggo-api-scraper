# Scraper for Dog Data API
This scraper does 3 things:
- `getBreedData.js` scrapes the AKC website to find all breed names, breed data, and copies the URL for the breed image
- `getImages.js` requests all the breed images and downloads them locally
- `uploadImages.js` uploads all the breed images to S3 and writes the `finalBreedData.json` file with all the data and the new S3 image URL

## Installation
1. Clone the git repo
2. Install dependencies
```
npm install
```
3. Add a `.env` file with your  **AWS_KEY**, **AWS_SECRET**, and **AWS_BUCKET**
4. Run each file in order above
5. Your data should be written locally in a file called `finalBreedData.json`

## Usage
This scraper was built specifically for use in my other project, [Find Yo Doggo](https://github.com/amandamcox/find-yo-doggo)
