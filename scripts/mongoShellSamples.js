//demonstrate difference between indexed and unindexed query
db.item.find({name: 'Item EAAA'}).explain('executionStats');
db.item.find({description: 'Description EAAA'}).explain('executionStats');
//Explanation -> https://docs.mongodb.com/v3.2/reference/explain-results/

//left sided case sensitive queries supported by indexing
db.item.find({name: {$regex: '^Item ABC[A-E]{1}'}}).explain('executionStats');

//find operation runnig on the index
db.item.find({name: {$regex: 'ABC[A-E]{1}'}}).explain('executionStats');
//high keys examined, low docs examined

//combined queries
db.item.find({onStock:{$gt:0}, name: {$regex: '^Item ABC[A-E]{1}'}}).explain('executionStats');
//executes regex index first, then scans docs

db.item.createIndex({onStock:1,name:1});
db.item.getIndexes();
db.item.find({onStock:{$not:{$gt:0}}, name: {$regex: '^Item ABC[A-E]{1}'}}).explain('executionStats');
db.item.dropIndex('onStock_1_name_1');

//index Types
//https://docs.mongodb.com/v3.2/indexes/#index-types

