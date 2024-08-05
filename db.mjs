import mongoose from 'mongoose'
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
// Schema for the User model. Right now, comments and posts are arrays of references to User/Post documents


const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({ });

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);

// Schema for Post mode. Author is a reference to a User document, and comments is an array of references to Comment documents
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});
mongoose.model('Post', PostSchema);

// Schema for Comment mode. Author is a reference to a User document, and post is a reference to a Post document
const CommentSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});
mongoose.model('Comment', CommentSchema);


const ReportSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  reason: String
})
mongoose.model('Report', ReportSchema);

// ... (other functions like createUser)

export const db = {
};


mongoose.connect("mongodb://dp3229:XRMgUT6t@class-mongodb.cims.nyu.edu/dp3229")
