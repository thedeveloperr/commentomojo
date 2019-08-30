const { Model } = require('objection');
const { DBErrors } = require('objection-db-errors');

// Usually you want to map each model class's errors. Easiest way to do this
// is to create a common superclass for all your models.
class BaseModel extends DBErrors(Model) {

}

module.exports = {
  BaseModel
};
