import { Seeder } from 'mongo-seeding';
import conf from '../../src/core/config'


const MONGO_URI = conf.get('MONGODB_URI') || 'mongodb://localhost:27017/hybrid'

const path = require('path');

const config = {
  database: MONGO_URI,
  inputPath: path.resolve(__dirname, './tools/seeder/data'),
  dropDatabase: true
}
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(path.resolve('./tools/seeder/data'));

const main = async () => {
  try {
    await seeder.import(collections)
    console.log('Seed complete!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

main();
