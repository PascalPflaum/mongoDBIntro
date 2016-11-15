const logger = require('../helper/logger');
const modelName = 'item';

/**
 *
 * @param mongoDB
 * @return UserModel
 */
export default module.exports = function (mongoDB) {

    const itemSchema = new mongoDB.Schema({
            name: {
                unique: true,
                type: String
            },
            description: String,
            onStock: Number
        },
        {
            timestamps: true,
            collection: modelName
        });




    itemSchema.statics.getNumberOfAllItemsInStock = () => {
        return ItemModel.mapReduce({
            map: function () {
                emit('all', this.onStock)
            },
            reduce: function (all, onStocks) {
                return Array.sum(onStocks);
            }
        });
    };




    itemSchema.statics.getNumberOfAllItemsInStockBadReference = (groupByFirstLetters = 0) => {
        return ItemModel.mapReduce({
            map: function () {
                emit(this.name.substr(0, groupByFirstLetters), this.onStock)
            },
            reduce: function (all, onStocks) {
                return Array.sum(onStocks);
            }
        });
    };




    itemSchema.statics.getNumberOfAllItemsInStockIntroduceScope = (groupByFirstLetters = 0) => {
        return ItemModel.mapReduce({
            map: function () {
                emit(this.name.substr(0, groupByFirstLetters), this.onStock)
            },
            reduce: function (all, onStocks) {
                return Array.sum(onStocks);
            },
            scope: {
                groupByFirstLetters
            }
        });
    };




    itemSchema.statics.getNumberOfAllItemsInStockIntroduceFinalize = (groupByFirstLetters = 0) => {
        return ItemModel.mapReduce({
            map: function () {
                emit(this.name.substr(0, groupByFirstLetters), this.onStock)
            },
            reduce: function (all, onStocks) {
                return Array.sum(onStocks);
            },
            finalize: function (key, value) {
                return key + 'x: ' + value;
            },
            scope: {
                groupByFirstLetters
            }
        }, (err, models, stats) => {
            logger.info(stats);
        });
    };




    itemSchema.statics.getNumberOfAllItemsInStockIntroduceQuery = (groupByFirstLetters = 0) => {
        return ItemModel.mapReduce({
                query: {
                    onStock: {'$gt': 0}
                },
                map: function () {
                    emit(this.name.substr(0, groupByFirstLetters), this.onStock)
                },
                reduce: function (all, onStocks) {
                    return Array.sum(onStocks);
                },
                finalize: function (key, value) {
                    return key + ': ' + value;
                },
                scope: {
                    groupByFirstLetters
                }
            }
            , (err, models, stats) => {
                logger.info(stats);
            });
    };




    itemSchema.statics.getNumberOfAllItemsInStockIntroduceOut = (groupByFirstLetters = 0) => {
        return ItemModel.mapReduce({
            map: function () {
                emit(this.name.substr(0, groupByFirstLetters), this.onStock)
            },
            reduce: function (all, onStocks) {
                return Array.sum(onStocks);
            },
            finalize: function (key, value) {
                return key + 'x: ' + value;
            },
            scope: {
                groupByFirstLetters
            },
            out: {
                replace: 'itemSum'
            }
        }, (err, models, stats) => {
            logger.info(stats);
        });
    };




    itemSchema.statics.getNumberOfAllItemsInStockIntroduceJSMode = (groupByFirstLetters = 0) => {
        return ItemModel.mapReduce({
            map: function () {
                emit(this.name.substr(0, groupByFirstLetters), this.onStock)
            },
            reduce: function (all, onStocks) {
                return Array.sum(onStocks);
            },
            finalize: function (key, value) {
                return key + ': ' + value;
            },
            scope: {
                groupByFirstLetters
            },
            out: {
                replace: 'itemSum'
            },
            jsMode: true
        }, (err, models, stats) => {
            logger.info(stats);
        });
    };

    //build model based on scheme
    const ItemModel = mongoDB.model(modelName, itemSchema);

    return ItemModel;

};