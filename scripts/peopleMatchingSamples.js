const app = require('../index');
const logger = require('../helper/logger');

// app.PeopleModel.findBySkillsMR({A: 1, B: 0.8, C: 0.5})
// app.PeopleModel.findBySkillsAggregateNative({A: 1, B: 0.8, C: 0.5})
app.PeopleModel.findBySkillsAggregateMongoose({A: 1, B: 0.8, C: 0.5})
    .then((data) => {
        logger.info({data});
    })
    .catch((e)=> {
        logger.error(e);
    });