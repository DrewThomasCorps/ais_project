const MongoClient = require('mongodb').MongoClient
const fs = require('fs')

let tileImageDirectory = './data/images/'
let tileImages = fs.readdirSync(tileImageDirectory);

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, {useUnifiedTopology: true});
client.connect().then(async client => {

    const database = client.db('AISTestData');
    database.collections().then(collections => {
        if (collections.find((collection) => {
            return collection.collectionName === 'aisdk_20201118';
        })) {
            database.dropCollection('aisdk_20201118').then();
        }
        database.createCollection('aisdk_20201118').then();
    })
    await Promise.all(tileImages.map(async (tileImage) => {
        let binaryImage = fs.readFileSync(tileImageDirectory + tileImage).toString('binary');
        await database.collection('mapviews').updateOne({filename: tileImage}, {$set: {image_file: binaryImage}});
    }));
    await client.close();
}).finally(async () => {
    await client.close();
})


