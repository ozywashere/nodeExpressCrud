import Tour from '../models/tourModel.js';
import connectDB from '../config/connectDB.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));


  console.log(tours)
//import data into database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded')
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete all data from database

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfully deleted')
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
  connectDB();
} else if (process.argv[2] === '--delete') {
  deleteData();
  connectDB();
}
