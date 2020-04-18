const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema(
    {
      value: {
        type: Schema.Types.String,
      }
    },
    {
        timestamps: true
    }
);
tagSchema.index({value: 'text'});
module.exports = mongoose.model('Tag', tagSchema);
