var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    description: { type: String, required: true},
    numberOfCalories: { type: Number, required: true},
    dateTime: { type: Date, required: true}
});

/**
  * Meal with a reference to the user, a text description ,
  * a number of calories, and the date and time when the meal
  * took place. */
module.exports = mongoose.model('Meal', MealSchema);
