// GET /comments - list all comments
// POST /comments - create new comment
// GET /comments/:id - get one particular comment
// PATCH /comments/:id - update one particular comment
// DELETE /comments/:id - destroy one particular comment
import express from 'express';
import { v4 as uuid } from 'uuid';
import methodOverride from 'method-override';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.listen('8000', () => {
    console.log("Listening on port 8000");
})

let comments = [
    {
        id: uuid(),
        username: "Todd",
        comment: "LOL that is so funny",

    },
    {
        id: uuid(),
        username: "Skyler",
        comment: "I like to go birdwatching with my dog"
    },
    {
        id: uuid(),
        username: "Sk8erboi",
        comment: "Plz delete your account Todd"
    },
    {
        id: uuid(),
        username: "onlysayswoof",
        comment: "woof woof"
    }
]

// index
app.get('/comments', (req, res) => {
    res.render('comments/index', { comments });
})

// create
app.post('/comments', (req, res) => {
    const { username, comment } = req.body
    comments.push({id: uuid(), username: username, comment: comment});
    res.redirect('/comments');
})

app.get('/comments/new', (req, res) => {
    res.render('comments/new');
})

//show
app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id == id);
    res.render('comments/show', { comment });
})

// update
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    const newComment = req.body;
    const oldComment = comments.find(c => c.id == id);
    oldComment.comment = newComment.comment;
    res.redirect('/comments');
})

app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id == id);
    res.render('comments/edit', { comment });
})

// destroy
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    // add comments into new array except for the deleted one
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
})