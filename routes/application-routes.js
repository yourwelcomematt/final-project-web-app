const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const jimp = require("jimp");

const testDao = require("../modules/dao.js");
const userDao = require("../modules/users-dao.js");
const multer = require("../modules/multer-uploader.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

router.get("/", async function(req, res) {
    const articles = await testDao.retrieveAllArticles(); 
    
    var usersArray = new Array(); 
    for (let i = 0; i < articles.length; i++){
    usersArray[i] = await testDao.retrieveUserById(articles[i].userID); 
    articles[i].username = usersArray[i].username;
    }; 
    res.locals.articles = articles;
    res.render("home");
}); 

router.get("/my-articles", verifyAuthenticated, async function(req, res) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.articles = await testDao.retrieveArticlesByAuthorId(user.id); 
    res.render("my-articles");
});

router.post("/createComment", async function(req, res) {
    const content = req.body.commentInput; 
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken); 
    const articleID = req.body.articleID;
    console.log(articleID);
    const comment = {content: content, commenterID: user.id, articleID: articleID, parentID: null}; 
    await testDao.createComment(comment);
});

router.get("/create-article", verifyAuthenticated, async function(req, res) {
    res.render("create-article");
});

router.post("/create-article", multer.upload.single("articleImage"), verifyAuthenticated, async function(req, res) {

    const title = req.body.articleTitle;
    let imageSource = null;
    const content = req.body.newArticleContent;

    if (req.file !== undefined) {
        const imageFile = req.file;
        const oldFileName = imageFile.path;
        const newFileName = `./public/imageUploads/${imageFile.originalname}`;
        fs.renameSync(oldFileName, newFileName);

        const resizedImage = await jimp.read(newFileName);
        resizedImage.resize(800, jimp.AUTO); // arbitrary size
        await resizedImage.write(`./public/imagesResized/${imageFile.originalname}`);

        imageSource = imageFile.originalname;
    }
    
    // create article in database
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const newArticle = {title: title, content: content, imageSource: imageSource, userID: user.id, username: user.username}; 
    await testDao.createNewArticle(newArticle);

    const newArticleID = await testDao.retrieveNewArticleID();

    res.redirect(`/read-article?articleID=${newArticleID}`);
}); 

router.get("/edit-article", verifyAuthenticated, async function(req, res) {

    const editedArticleID = req.query.articleID;
    const article = await testDao.retrieveArticleById(editedArticleID); 
    res.locals.article = article;
    
    res.render("edit-article");

});

router.post("/edit-article", multer.upload.single("articleImage"), verifyAuthenticated, async function(req, res) {

    const id = req.body.hiddenIDbox;
    const article = await testDao.retrieveArticleById(id); 

    const title = req.body.articleTitle;
    let imageSource = article.imageSource;
    const content = req.body.editedArticleContent;
    const deleteCheckbox = req.body.deleteImageButton;

    if (deleteCheckbox == "on") {
        imageSource = null;
    }

    if (req.file !== undefined) {
        const imageFile = req.file;
        const oldFileName = imageFile.path;
        const newFileName = `./public/imageUploads/${imageFile.originalname}`;
        fs.renameSync(oldFileName, newFileName);

        const resizedImage = await jimp.read(newFileName);
        resizedImage.resize(800, jimp.AUTO); // arbitrary size
        await resizedImage.write(`./public/imagesResized/${imageFile.originalname}`);

        imageSource = imageFile.originalname;
    }
    
    await testDao.editArticle(id, title, content, imageSource);

    res.redirect(`/read-article?articleID=${id}`);
});


router.get('/read-article', async function (req, res) {

    const articleID = req.query.articleID;
    
    const article = await testDao.retrieveArticleById(articleID); 
    res.locals.article = article;

    // Initialise user so we can check if userID = authorID: if so display edit article button
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user;
    
    //console.log(article.imageSource)
    const comments = await testDao.retrieveCommentsByArticleId(articleID); 
    var usersArray = new Array(); 
    for (let i = 0; i < comments.length; i++){
        usersArray[i] = await testDao.retrieveUserById(comments[i].commenterID);
        comments[i].username = usersArray[i].username;
    }
    res.locals.comments = comments; 
    res.render("read-article");
  });

router.post("/delete-article", verifyAuthenticated, async function (req, res) {

    const id = req.body.hiddenIDbox;
    await testDao.deleteArticleById(id);
    res.redirect("./my-articles?message=Successfully deleted your article!");
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

router.get("/my-sorted-articles", verifyAuthenticated, async function(req, res){
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const sortBy = req.query.sortBy; 
    const articles = await testDao.retrieveMyArticlesBySort(user.id, sortBy);
    res.json(articles);
});


router.get("/edituser", verifyAuthenticated, async function(req, res) {
    res.render("edituser");
});


router.post("/edituser", verifyAuthenticated, async function(req, res) {

    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);

    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const dob = req.body.dob;
    const description = req.body.description;
    var imageSource = req.body.avatar;

    if (imageSource == null || imageSource == undefined) {
        var imageSource = user.imageSource;
    }
    
    await testDao.editUser(user.id, fname, lname, username, dob, description, imageSource);
    res.redirect("account-details");
});


router.post("/deleteuser", async function(req, res) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    await testDao.deleteUserById(user.id);
    res.redirect("./login?message=Successfully deleted account!");
});

module.exports = router;