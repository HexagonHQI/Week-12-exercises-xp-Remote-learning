const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Parser = require('rss-parser');

const app = express();
const parser = new Parser();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  try {
    let feed = await parser.parseURL('https://thefactfile.org/feed/');
    res.render('pages/index', { feed: feed.items });
  } catch (err) {
    res.status(500).send('Error fetching RSS feed');
  }
});

app.get('/search', (req, res) => {
  res.render('pages/search', { posts: [] });
});

app.post('/search/title', async (req, res) => {
  try {
    let feed = await parser.parseURL('https://thefactfile.org/feed/');
    const posts = feed.items.filter(item =>
      item.title.toLowerCase().includes(req.body.title.toLowerCase())
    );
    res.render('pages/search', { posts });
  } catch (err) {
    res.status(500).send('Error searching by title');
  }
});

app.post('/search/category', async (req, res) => {
  try {
    let feed = await parser.parseURL('https://thefactfile.org/feed/');
    const posts = feed.items.filter(item =>
      item.categories.some(category =>
        category.toLowerCase().includes(req.body.category.toLowerCase())
      )
    );
    res.render('pages/search', { posts });
  } catch (err) {
    res.status(500).send('Error searching by category');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
