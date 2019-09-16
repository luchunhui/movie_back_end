const mongoose = require('mongoose');
// 获得db对象
db = mongoose.connection;
// 启动db链接
mongoose.connect('mongodb://localhost:27017/data');

const Schema = mongoose.Schema;

const movieSchema = new Schema({}, {
  strict: false
});

const teleplaySchame = new Schema({}, {
  strict: false
})
const Movie = mongoose.model('Movie',movieSchema);
const Teleplay = mongoose.model('Teleplay',teleplaySchame);


module.exports = {
  Movie,
  Teleplay
};