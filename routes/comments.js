var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

// ===
// COMMENTS ROUTES
// ===

//Comments new
router.get("/recipes/:id/comments/new", middleware.isLoggedIn, function(req, res){
	//find recipe by id and pass it to template
	Recipe.findById(req.params.id, function(err, obj){
		if(err || !obj){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("comments/new", {recipe: obj});
		}
	});
});

//Comments create
router.post("/recipes/:id/comments", middleware.isLoggedIn, function(req, res){
	//lookup recipe by id
	Recipe.findById(req.params.id, function(err, obj){
		if(err || !obj){
			console.log(err);
			res.redirect("/recipes");
		}else {
			//create new comments
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else {
				//add username and id to comment
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				//save comment
				comment.save();
				//connect comment to recipe object
				obj.comments.push(comment);
				obj.save();
				//redirect to recipe show
				res.redirect("/recipes/" + obj._id);
				}
			});
		}
	});
});

//EDIT comment
router.get("/recipes/:id/comments/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err || !foundComment){
			res.redirect("back");
		} else {
			res.render("comments/edit", {recipe_id: req.params.id, comment: foundComment});
		}
	});
});

//Update comment
router.put("/recipes/:id/comments/:comment_id", middleware.checkCommentOwner, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/recipes/" + req.params.id);
		}
	});
});

//DESTROY comment
router.delete("/recipes/:id/comments/:comment_id", middleware.checkCommentOwner, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/recipes/" + req.params.id);
		}
	});
});

module.exports = router;