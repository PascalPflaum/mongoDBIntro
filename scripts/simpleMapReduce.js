const app = require('../index');
const logger = require('../helper/logger');

// app.ItemModel.getNumberOfAllItemsInStock()
// app.ItemModel.getNumberOfAllItemsInStockBadReference(6)
// app.ItemModel.getNumberOfAllItemsInStockIntroduceScope(7)
//app.ItemModel.getNumberOfAllItemsInStockIntroduceFinalize(6)
// app.ItemModel.getNumberOfAllItemsInStockIntroduceQuery(6)
// app.ItemModel.getNumberOfAllItemsInStockIntroduceOut(6)
 app.ItemModel.getNumberOfAllItemsInStockIntroduceJSMode(6)
    .then((data) => {
        logger.info({data});
    })
    .catch((e)=> {
        logger.error(e);
    })