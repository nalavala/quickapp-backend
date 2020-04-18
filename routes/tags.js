var express = require('express');
var router = express.Router();
const Tag = require('./../models/Tag');
const Shortcut = require('./../models/Shortcut');

router.get('/', async function (req, res, next) {
    let tags = await Tag.find().sort({"createdAt" : -1});
    let result = {
        tags
    }
    res.send(result);
});

router.post('/', async function (req, res, next) {
    let value = req.body.value;

    let tag = new Tag({
        value: value,
    });
    await tag.save();
    tag["id"] = tag._id;
    res.send(tag);
});


router.delete('/', async function (req, res, next) {

    await Tag.deleteMany();
    res.send("success");
});

router.post('/search', async function (req, res, next) {

    let searchText = req.body.searchText;
    let tags = await Tag.find({"value" : { $regex : new RegExp("^" +searchText,'i')}});

    let result = {
        tags
    };
    res.send(result);
});


router.get('/filter', async function (req, res, next) {
    let result = await Shortcut.aggregate([
        {
            "$unwind": "$tags"
        },
        {
            "$group": {
                "_id": '$tags',
                "count": {"$sum": 1}
            }
        },
    ]).sort({"createdAt" : -1});

    res.send(result);
});

router.post('/getShortcutsByTag', async function (req, res, next) {
    let tagId = req.body.tag;
    let shortcuts = await Shortcut.find(
        {
            "tags": tagId
        }
    ).sort({"createdAt" : -1});

    let results = {};
    shortcuts.forEach(shortcut => {
        shortcut["id"] = shortcut._id;
        results[shortcut.id] = shortcut;
    });

    let result = {
        shortcuts: results
    }
    res.send(result);
});

module.exports = router;
