const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  field1: String,
  field2: String,
  field3: String,
});

const Item = mongoose.model('items', ItemSchema);

module.exports = Item;