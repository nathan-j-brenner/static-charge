
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

		//contents of a post without any of the metadata
		var postContents = contents.split("---")[2];

		var dataSplitTitle = metaData.split("\n")[1];
		var postTitle = dataSplitTitle.split(":")[1];

		var dataSplitAuthor = metaData.split("\n")[2];
		var postAuthor = dataSplitAuthor.split(":")[1];

		var dataSplitDate = metaData.split("\n")[3];
		var postDate = dataSplitDate.split(":")[1];

		return {postName: postName, postTitle: postTitle, postAuthor: postAuthor, postDate: postDate, postContents: marked(postContents)};
	});

	router.get('/', function(request, response){
		response.render('index', {posts: posts, title: 'Jaded posts'})
	});

	posts.forEach(function(post){
		router.get('/' + post.postName, function(request, response){
			response.render('post', {postTitle: post.postTitle, postAuthor: post.postAuthor, postDate: post.postDate, postContents: post.postContents});
		});
	});
});

module.exports = router;

