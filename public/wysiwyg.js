tinymce.init({
    selector: '#newArticle',
    menubar: false,
    plugins: 'autoresize lists save emoticons wordcount',
    autoresize_bottom_margin: 50,
    toolbar: 'undo redo | styleselect | forecolor | bold italic underline | numlist bullist | emoticons | wordcount',
    images_file_types: 'jpeg,jpg,png,gif'
    });

function getNewArticleContent() {
    const newArticleContent = tinymce.get("newArticle").getContent();
    console.log(newArticleContent);

    //const heading = str.split("</h1>");
    //console.log(heading);

};

//store as a string in the database - innerHTML