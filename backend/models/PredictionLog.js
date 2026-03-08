const mongoose = require('mongoose');

const predictionLogSchema = new mongoose.Schema(
  {
    kitchenId:            { type: String, required: true, index: true },
    expectedPeople:       { type: Number, required: true },
    predictedQuantity:    { type: Number, required: true },
    estimatedWaste:       { type: Number, default: 0 },
    surplusRisk:          { type: Boolean, default: false },
    donationRecommended:  { type: Boolean, default: false },
    eventMultiplier:      { type: Number, default: 1 },
    weatherMultiplier:    { type: Number, default: 1 },
    dayOfWeek:            { type: String, default: '' },
    weather:              { type: String, default: '' },
    events:               { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PredictionLog', predictionLogSchema);
