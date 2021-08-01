//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.4mdyc.mongodb.net/wikiDB",
  {
    useNewUrlParser: true,
  }
);

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

// ALL ARTICLES

app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, articles) => {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;
    const newArticle = new Article({
      title: articleTitle,
      content: articleContent,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

// SPECIFIC ARTICLES

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.findOne({ title: articleTitle }, (err, article) => {
      if (!err) {
        res.send(article);
      } else {
        res.send(err);
      }
    });
  })
  .put((req, res) => {
    const articleTitle = req.params.articleTitle;
    const newArticleTitle = req.body.title;
    const newArticleContent = req.body.content;
    Article.update(
      { title: articleTitle },
      { title: newArticleTitle, content: newArticleContent },
      { overwrite: true },
      (err, article) => {
        if (!err) {
          res.send("Successfully updated (put) the article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    const articleTitle = req.params.articleTitle;
    const newArticle = req.body;
    Article.update(
      { title: articleTitle },
      { $set: newArticle },
      (err, article) => {
        if (!err) {
          res.send("Successfully updated (patch) the article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.deleteOne({ title: articleTitle }, (err, article) => {
      if (!err) {
        res.send(article);
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
