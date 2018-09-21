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
            // res.send("Scrape Complete");
            res.redirect("/");
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
    // Route for grabbing a specific Article by id, populate it with it's note
    app.put("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { "saved": true } })
            // ..and populate all of the notes associated with it
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    app.get("/saved", function (req, res) {
        db.Article.find({ "saved": true })
            .then(function (data) {
                var hbsObject = {
                    article: data
                }
                res.render("saved", hbsObject);
            })
    });
    // Route for saving a new Note to the db and associating it with a User
    app.post("/articles/:id", function (req, res) {
        // console.log(req.params.id);

        // Create a new Note in the db
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
            })
            .then(function (dbConnect) {
                // If the User was updated successfully, send it back to the client
                res.json(dbConnect);
            })
            .catch(function (err) {
                // If an error occurs, send it back to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        console.log("Getting article");
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });

    // // Route to get all User's and populate them with their notes
    // app.get("/api/articles/:id", function (req, res) {
    //     db.Article.findOne({ _id: req.params.id })
    //         // ..and populate all of the notes associated with it
    //         .populate("note")
    //         .then(function (data) {
    //             var hbsObject = {
    //                 note: data.note
    //             }
    //             console.log(hbsObject.note._id);
    //             res.render("saved", hbsObject);
    //         })
    //         .catch(function (err) {
    //             // If an error occurred, send it to the client
    //             res.json(err);
    //         });
    //     res.redirect("/saved");
    // });

    app.put("/remove/articles/:id", function (req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { "saved": false } })
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            console.log("Article removed from saved");
            res.redirect("/saved");
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    app.delete("/articles/:id", function(req, res) {
        var articleId = req.body.articleId;
        db.Note.deleteOne({_id: req.params.id})
        // .then(function(result) {
        //     return db.Article.findByIdAndRemove({ _id: articleId})
        // })
        .then(function(del) {
            res.json(del);
        }).catch(function(err) {
            res.json(err)
        })
    })
};

