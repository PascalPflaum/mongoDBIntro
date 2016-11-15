const app = require('../index');

const alphabet = 'ABCDEFGHIJ'.split('');

const items = [];

alphabet.forEach((letterA)=> {
    alphabet.forEach((letterB)=> {
        alphabet.forEach((letterC)=> {
            alphabet.forEach((letterD)=> {
                // alphabet.forEach((letterE)=> {
                let lateast = new app.PeopleModel({
                    name: 'Person ' + letterA + letterB + letterC + letterD,
                    skills: {}
                });
                lateast.skills[letterA] = Math.random();
                lateast.skills[letterB] = Math.random();
                lateast.skills[letterC] = Math.random();
                lateast.skills[letterD] = Math.random();
                items.push(lateast);
                // });
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
