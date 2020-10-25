const mongoose = require('mongoose');

const utilitySchema = mongoose.Schema({
  utilityImg: { type: String },
  utilityName: {type: String},
  electricityUsageKwh: {type: String},
  electricityUsageDollar: {type: String},
  gasUsageTherms: {type: String},
  gasUsageDollar : {type: String},
  highBilling: {type: String},
  oldEquipment : {type: String},
  userId: {type: String},
});

module.exports = mongoose.model('Utility', utilitySchema)
