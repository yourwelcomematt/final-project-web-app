const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

const testDao = require("../modules/dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");


router.get("/", async function(req, res) {
    res.locals.articles = await testDao.retrieveAllArticles(); 
    res.render("home");
}); 


router.get("/my-articles", verifyAuthenticated, async function(req, res) {
    res.locals.articles = await testDao.retrieveArticlesByAuthorId(user); 
    res.render("my-articles");
});


router.get("/read-article", async function(req, res) {
    res.render("read-article");
});

router.get("/create-article", async function(req, res) {
    res.render("create-article");
});

router.post("/create-article", async function(req, res) {

    const title = req.body.articleTitle;
    const imageSource = req.body.articleImage;
    const content = req.body.newArticleContent;
    
    const newArticle = {title: title, content: content, imageSource: imageSource /*userID: logged in user*/}; 
    const newArticleID = await testDao.createNewArticle(newArticle);
    console.log(newArticleID);
    //get ID of newly created article

    res.redirect("/");
}); 


router.get("/create-account", async function(req, res) {
    res.render("create-account");
});

router.post("/create-account", async function(req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const dob = req.body.dob;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const description = req.body.description;
    const imageSource = req.body.avatar;

    if (password == confirmPassword) {
        const authToken = uuid();
        const newUser = {fname: fname, lname: lname, username: username, dob: dob, password: password, description: description, imageSource: imageSource, authToken: authToken};
        await testDao.createUser(newUser);
        res.cookie("authToken", authToken);
        res.locals.user = newUser;
        res.redirect("/");
    } else {
        res.redirect("/create-account");
    }
});


router.get("/usernames", async function(req, res) {
    const usernames = await testDao.retrieveAllUsernames();
    res.json(usernames);
});


router.get("/account-details", verifyAuthenticated, async function(req, res) {
    res.render("account-details");
});


router.get("/articles", async function(req, res){
    const sortBy = req.query.sortBy;
    const articles = await testDao.retrieveArticlesBySort(sortBy);
    res.json(articles);
});

module.exports = router;