const express = require("express");
const router = express.Router();

const testDao = require("../modules/test-dao.js");

router.get("/", async function(req, res) {

    // res.locals.title = “My route title!“;
    // res.locals.allTestData = await testDao.retrieveAllTestData();

    res.render("home");
});

router.get("/login", async function(req, res) {
    res.render("login");
});

router.get("/newaccount", async function(req, res) {
    res.render("newaccount");
});

router.get("/accountdetails", async function(req, res) {
    res.render("accountdetails");
});

router.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username);
    console.log(password);

    res.redirect("/");
});

router.get("/home", async function(req, res) {
    res.locals.articles = await testDao.retrieveAllArticles();
    //const sort = req.query.sort; 

    res.render("home");
}); 

module.exports = router;