var express = require('express');
var router = express.Router();
var Comment=require('../controllers/comment');
var Reply=require('../controllers/reply');
router.get('/get/:id',Comment.get);
router.post('/add/',Comment.add);
router.post('/delete/',Comment.del);
router.get('/getReply/:id',Reply.get);
router.post('/addReply/',Reply.add);
router.post('/deleteReply/',Reply.del);


module.exports = router;