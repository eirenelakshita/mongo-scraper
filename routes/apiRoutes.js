var cheerio = require("cheerio");
var request = require("request");
var axios = require("axios");
var db = require("../models");

module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        axios.get("http://freakonomics.com/archive/").then(function (response) {
            var $ = cheerio.load(response.data);
            $("tr td").each(function (i, element) {
                var result = {};
                result.title = $(this)
                    .children("a")
                    .text();
                result.summary = $(this)
                    .text();
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        return res.json(err);
                    });
            });
            res.send("Scrape Complete");
        })
    });
    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    app.get("/", function (req, res) {
        db.Article.find({})
            .then(function (data) {
                var hbsObject = {
                    article: data
                }
                res.render("index", hbsObject);
            })
    });
};

