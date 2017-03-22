var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  instruction: String,
  attachment: String, 
  attachment_type: String, 
  objects_to_annotate: Schema.Types.Mixed, 
  with_labels: Boolean,
  callback_url: String, 
  created_at: Date,
  completed: Boolean,
  user_id: Schema.Types.ObjectId,
  annotations: Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now },
});

var Task = mongoose.model('task', schema);

module.exports = Task;