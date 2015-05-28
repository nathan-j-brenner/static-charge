
var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');
var moment = require('moment');

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
	for(var i=0; i<posts.length; i++){
		if (i!=0){
			posts[i].next = posts[i-1].postName
			posts[i].nextURL = "./"+posts[i].next
		}
		if(i<posts.length-1){
			posts[i].previous = posts[i+1].postName
			posts[i].previousURL= "./" + posts[i].previous
		}
	};

	//creates index.html for this blog site
	router.get('/', function(request, response){
		response.render('index', {posts: posts, title: 'Jaded posts'})
	});
	//creates each separate page for every blog post
	posts.forEach(function(post){
		router.get('/' + post.postName, function(request, response){
			response.render('post', {postTitle: post.postTitle, postAuthor: post.postAuthor, postDate: post.postDate, postContents: post.postContents});
		});
	});
});

module.exports = router;

