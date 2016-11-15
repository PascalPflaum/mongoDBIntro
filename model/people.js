const logger = require('../helper/logger');
const modelName = 'people';

/**
 *
 * @param mongoDB
 * @return UserModel
 */
export default module.exports = function (mongoDB) {

    const peopleSchema = new mongoDB.Schema({
            name: {
                unique: true,
                type: String
            },
            skills: mongoDB.Schema.Types.Mixed
        },
        {
            timestamps: true,
            collection: modelName
        });




    peopleSchema.statics.findBySkillsMR = (searchedSkills, maxHits = 10) => {

        return PoepleModel.mapReduce({
            map: require('./mapReduce/' + modelName + '/findBySkills/map.js'),
            reduce: require('./mapReduce/' + modelName + '/findBySkills/reduce.js'),
            scope: {
                searchedSkills,
                maximumScore: getMaximumScore(searchedSkills)
            }
        }, (err, models, stats) => {
            logger.info(stats);
        })
            .then(sortByValue)
            .then(getTop(maxHits));
    };





    peopleSchema.statics.findBySkillsAggregateNative = (searchedSkills, maxHits = 10) => {

        // NATIVE DRIVER
        // Pro : Possible to pass options as second object
        // Pro : Early available new mongoDB features
        // Con : Callback only AND not posible to es6-promisify
        // Con : Hard to Build because of many arrays and objects nested

        return new Promise(function (resolve, reject) {

            PoepleModel.collection.aggregate([
                    {
                        $match: {
                            $or: Object.keys(searchedSkills).map((key)=> {
                                const obj = {};
                                obj['skills.' + key] = {$gt: 0};
                                return obj;
                            })
                        }
                    },
                    {
                        $project: {
                            score: {
                                $divide: [
                                    {
                                        $sum: Object.keys(searchedSkills).map((key) => {
                                            return {$multiply: [searchedSkills[key], '$skills.' + key]}
                                        })
                                    },
                                    getMaximumScore(searchedSkills)
                                ]
                            }
                        }
                    }, {
                        $sort: {
                            score: -1 //descending
                        }
                    }, {
                        $limit: maxHits
                    },
                ], (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                }
            );
        });
    };





    peopleSchema.statics.findBySkillsAggregateMongoose = (searchedSkills, maxHits = 10) => {

        // NATIVE DRIVER
        // Pro : Promises
        // Pro : Chainable in JS with method calls
        // Pro : typical mongoose abstraction like query -score in sort
        // Pro : Docu : http://mongoosejs.com/docs/api.html#aggregate_Aggregate
        // Con : Relative new
        // Con : Additional abstraction
        // Con : buggy ... e.g. explain not working
        return PoepleModel.aggregate()
            .match({
                $or: Object.keys(searchedSkills).map((key)=> {
                    const obj = {};
                    obj['skills.' + key] = {$gt: 0};
                    return obj;
                })
            })
            .project({
                score: {
                    $divide: [
                        {
                            $sum: Object.keys(searchedSkills).map((key) => {
                                return {$multiply: [searchedSkills[key], '$skills.' + key]}
                            })
                        },
                        getMaximumScore(searchedSkills)
                    ]
                }
            })
            .sort('-score')
            .limit(maxHits);
    };

    //build model based on scheme
    const PoepleModel = mongoDB.model(modelName, peopleSchema);

    return PoepleModel;

};

const getMaximumScore = (searchedSkills) => {
    return Object.values(searchedSkills).reduce((a, b) => {
        return a + b;
    }, 0);
};

const sortByValue = (results)=> {
    return results.sort((a, b) => {
        return b.value - a.value;
    });
};

const getTop = (maxHits) => {
    return (results) => {
        return results.slice(0, maxHits - 1);
    };
};