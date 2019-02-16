const express = require('express');
const router = express.Router();

const {BlogPosts} = require('./models');

//const morgan = require('morgan');
//const bodyParser = require('body-parser');
//const jsonParser = bodyParser.json();
//const app = express();
//app.use(morgan('common'));

BlogPosts.create('This is How We Do IT','Getting Fresh With That Content', 'jazzyfresh');
BlogPosts.create('Dark Money', 'Oligarchs running wild in the US', 'Jane Meyers');
BlogPosts.create('It', 'The Story of a Clown Trying to Make Friends', 'Stephen King');

router.get("/", (req, res) => {
    res.json(BlogPosts.get());
});

router.post("/", (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    console.log(requiredFields);
    for (let i=0; i< requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});

router.put("/:id", (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'id'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \` ${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message =`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post item \`${req.params.id}\``);
    BlogPosts.update({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        id: req.params.id
    });
    res.status(204).end();
});

router.delete("/:id", (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted shopping list item \`${req.params.ID}\``);
    res.status(204).end();
});

module.exports = router;
//app.listen(process.env.PORT || 8080, () => {
  //  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
//});