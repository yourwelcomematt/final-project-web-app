const express = require("express");
const router = express.Router();

const testDao = require("../modules/test-dao.js");
const wysiwyg = require("../public/wysiwyg.js");

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

    const title = req.body.articleTitle;
    const imageSource = req.body.articleImage;
    //const content = await wysiwyg.getNewArticleContent();
    
    console.log(title);
    console.log(imageSource);
    //console.log(content);

    const newArticle = {title: title, content: content, imageSource: imageSource /*userID: logged in user*/};
    await testDao.createNewArticle(newArticle);
    res.redirect("/");
});

//insert into articles (title, postTime, content, imageSource, userID) values ()`);

router.get("/login", async function(req, res) {
    res.render("login");
});


router.get("/new-account", async function(req, res) {
    res.render("new-account");
});

router.post("/new-account", async function(req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const dob = req.body.dob;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const description = req.body.description;
    const imageSource = req.body.avatar;

    if (password == confirmPassword) {
        const newUser = {fname: fname, lname: lname, username: username, dob: dob, password: password, description: description, imageSource: imageSource};
        await testDao.createUser(newUser);
        res.redirect("/");
    } else {
        res.redirect("/new-account");
    }
});


router.get("/usernames", async function(req, res) {
    const usernames = await testDao.retrieveAllUsernames();
    res.json(usernames);
});


router.get("/account-details", async function(req, res) {
    //Change user id input later, this is hardcoded for now//
    const userinfo = await testDao.retrieveUserById(2);
    res.locals.user = userinfo;
    res.render("account-details");
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