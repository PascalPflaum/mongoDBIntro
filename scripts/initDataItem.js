const app = require('../index');

const alphabet = 'ABCDEFGHIJ'.split('');

const items = [];

alphabet.forEach((letterA)=> {
    alphabet.forEach((letterB)=> {
        alphabet.forEach((letterC)=> {
            alphabet.forEach((letterD)=> {
                alphabet.forEach((letterE)=> {
                    items.push(new app.ItemModel({
                        name: 'Item ' + letterA + letterB + letterC + letterD + letterE,
                        description: 'Description ' + letterA + letterB + letterC + letterD + letterE,
                        onStock: alphabet.indexOf(letterC) + alphabet.indexOf(letterD) + alphabet.indexOf(letterE)
                    }))
                });
            });
        });
    });
});

setTimeout(function () {
    Promise.all(items.map((item)=> {
        return item.save()
    })).then(()=> {
        console.log('saved');
    }).catch((e)=> {
        console.error(e);
    });
}, 10000);
