
var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');

var postsDir = __dirname + '/../posts/';
fs.readdir(postsDir, function(error, directoryContents){
	if (error){
		throw new Error(error);
	}

	var posts = directoryContents.map(function(filename){
		var postName = filename.replace('.md', '');
		var contents = fs.readFileSync(postsDir + filename, {encoding: 'utf-8'});
		var metaData = contents.split("---")[1];
		var postContents = contents.split("---")[2];
		console.log(postContents);

		var dataSplitTitle = metaData.split("\n")[1];
		// console.log(dataSplitTitle);
		var postTitle = dataSplitTitle.split(":")[1];
		// console.log(postTitle);

		var dataSplitAuthor = metaData.split("\n")[2];
		// console.log(dataSplitAuthor);
		var postAuthor = dataSplitAuthor.split(":")[1];

		var dataSplitDate = metaData.split("\n")[3];
		// console.log(dataSplitAuthor);
		var postDate = dataSplitDate.split(":")[1];

		return {postName: postName, postTitle: postTitle, postAuthor: postAuthor, postDate: postDate, postContents: postContents};
	});

	router.get('/', function(request, response){
		response.render('index', {posts: posts, title: 'all posts'})
	});

	posts.forEach(function(post){
		router.get('/' + post.postName, function(request, response){
			response.render('post', {postTitle: post.postTitle, postAuthor: post.postAuthor, postDate: post.postDate, postContents: post.postContents});
		});
	});
});

module.exports = router;

