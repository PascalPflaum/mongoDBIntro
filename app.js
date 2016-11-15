const config = require('./config');
const getModel = require('./helper/mongoDB')(config.mongoDB);

const ItemModel = getModel('item');
const PeopleModel = getModel('people');

export default module.exports = {
    ItemModel,
    PeopleModel
};