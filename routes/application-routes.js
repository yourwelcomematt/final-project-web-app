const express = require("express");
const router = express.Router();

const testDao = require("../modules/test-dao.js");

// router.get("/", async function(req, res) {

//     // res.locals.title = “My route title!“;
//     // res.locals.allTestData = await testDao.retrieveAllTestData();

//     res.render("home");
// });


router.get("/my-articles", async function(req, res) {
    res.render("my-articles");
});


router.get("/read-article", async function(req, res) {
    res.render("read-article");
});

router.get("/new-article", async function(req, res) {
    res.render("new-article");
});

router.post("/new-article", async function(req, res) {

    //get the data from the form input
    //split into title, content, image
    
    res.redirect("/read-article");
});

router.get("/login", async function(req, res) {
    res.render("login");
});


router.get("/newaccount", async function(req, res) {
    res.render("newaccount");
});


router.get("/accountdetails", async function(req, res) {
    //Change user id input later, this is hardcoded for now//
    const userinfo = await testDao.retrieveUserById(2);
    res.locals.user = userinfo;

    res.render("accountdetails");
});


router.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username);
    console.log(password);

    res.redirect("/");
});

router.get("/", async function(req, res) {
    res.locals.articles = await testDao.retrieveAllArticles(); 
    res.render("home");
}); 

router.get("/articles", async function(req, res){
    const sortBy = req.query.sortBy;
    const articles = await testDao.retrieveArticlesBySort(sortBy);
    res.json(articles);
});

module.exports = router;