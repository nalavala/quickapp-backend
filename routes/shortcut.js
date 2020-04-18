var express = require('express');
var router = express.Router();
const Shortcut = require('./../models/Shortcut')

router.get('/', async function (req, res, next) {
    let shortcuts = await Shortcut.find().sort({"createdAt" : -1});
    let results = {};
    shortcuts.forEach(shortcut => {
        shortcut["id"] = shortcut._id;
        results[shortcut.id] = shortcut;
    });

    let result = {
        shortcuts: results
    };
    res.send(result);
});

router.post('/', async function (req, res, next) {
    let name = req.body.name;
    let url = req.body.url;
    let tags = req.body.tags || [];
    let id = req.body.id;
    let isFavourite = req.body.isFavourite || false;
    if (id) {
        let shortcut = await Shortcut.findOne({_id: id}).sort('name');
        shortcut.name = name;
        shortcut.url = url;
        shortcut.tags = tags;
        shortcut.isFavourite = isFavourite;
        let updatedShortcut = await shortcut.save();
        updatedShortcut["id"] = updatedShortcut._id;
        res.send(updatedShortcut);
    } else {
        let shortcut = new Shortcut({
            name: name,
            url: url,
            tags: tags,
            isFavourite : isFavourite
        });
        await shortcut.save();
        shortcut["id"] = shortcut._id;
        res.send(shortcut);
    }


});

router.put('/', async (req,res) => {
    let shortcut = {...req.body};
    let dbShortcut = await Shortcut.findOne({_id: shortcut._id});
    dbShortcut.name = shortcut.name;
    dbShortcut.url = shortcut.url;
    dbShortcut.tags = shortcut.tags;
    dbShortcut.isFavourite = shortcut.isFavourite;
    let updatedShortcut = await dbShortcut.save();
    res.send(updatedShortcut);
});


router.put('/favourite', async (req,res) => {
    let shortcutId = req.body.id;
    let dbShortcut = await Shortcut.findOne({_id: shortcutId});
    dbShortcut.isFavourite = true;
    let updatedShortcut = await dbShortcut.save();
    res.send(updatedShortcut);
});


router.delete('/:id', async function (req, res, next) {
    let shortcutId = req.params.id;
    console.log("asdfas" + shortcutId);
    if (!shortcutId) {
        return;
    }
    let deleteShortcut = await Shortcut.deleteOne({_id: shortcutId})
    let shortcuts = await Shortcut.find().sort('name');
    let results = {};
    shortcuts.forEach(shortcut => {
        shortcut["id"] = shortcut._id;
        results[shortcut.id] = shortcut;
    });

    let result = {
        shortcuts: results
    };
    res.send(result);
});

router.delete('/', async function (req, res, next) {
    await Shortcut.deleteMany();
    res.send("sucess");
});

router.post('/delete', async (req,res) => {
    let ids = req.body.ids|| [];
    if(ids.length > 0) {
       await Shortcut.deleteMany({_id : ids})
    }

    let shortcuts = await Shortcut.find().sort({"createdAt" : -1});
    let results = {};
    shortcuts.forEach(shortcut => {
        shortcut["id"] = shortcut._id;
        results[shortcut.id] = shortcut;
    });

    let result = {
        shortcuts: results
    };
    res.send(result);
});

router.put('/', async function (req, res, next) {
    let name = req.body.name;
    let url = req.body.url;
    let tags = req.body.tag || [];
    let id = req.body._id;
    let shortcut = await Shortcut.findOne({_id: id}).sort('name');
    shortcut.name = name;
    shortcut.url = url;
    shortcut.tags = tags;
    let updatedShortcut = await shortcut.save();
    updatedShortcut["id"] = updatedShortcut._id;
    res.send(updatedShortcut);
});

router.post('/search', async function (req, res, next) {

    let searchText = req.body.searchText;
    let shortcuts = await Shortcut.find({"name": {$regex: new RegExp(searchText, 'i')}}).sort({"createdAt" : -1});

    let results = {};
    shortcuts.forEach(shortcut => {
        shortcut["id"] = shortcut._id;
        results[shortcut.id] = shortcut;
    });

    let result = {
        shortcuts: results
    };
    res.send(result);
});
router.get('/favourites', async function (req, res, next) {

    let shortcuts = await Shortcut.find({"isFavourite": true}).sort({"createdAt" : -1});
    let results = {};
    shortcuts.forEach(shortcut => {
        shortcut["id"] = shortcut._id;
        results[shortcut.id] = shortcut;
    });

    let result = {
        shortcuts: results
    };
    res.send(result);
});


module.exports = router;
