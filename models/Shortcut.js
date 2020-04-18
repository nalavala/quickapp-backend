const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shortcutSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
        },
        url: {
            type: Schema.Types.String,
        },
        isFavourite: {
            type: Schema.Types.Boolean,
            default : false
        },
        tags: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Tag'
            }
        ]
    },
    {
        timestamps: true
    }
);
shortcutSchema.index({name: 'text'});

module.exports = mongoose.model('Shortcut', shortcutSchema);
