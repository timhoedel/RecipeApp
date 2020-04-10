var Recipe = require("../models/recipe");
var Comment = require("../models/comment");

var middlewareObj = {
	checkRecipeOwner: function(req, res, next){
		//Check if user is logged in 
		if(req.isAuthenticated()){
			Recipe.findById(req.params.id, function(err, foundRecipe){
				if(err || !foundRecipe){
					res.redirect("back");
				} else {
					//Does the user own the recipe?
					if(foundRecipe.author.id.equals(req.user._id)) {
						next();
					} else {
						res.redirect("back");
					}
				}
			});
		} else {
			res.redirect("back");
		}
	},
	
	isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
			res.redirect("/login");
	},
	
	checkCommentOwner(req, res, next){
		//Check if user is logged in 
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err || !foundComment){
					res.redirect("back");
				} else {
					//Does the user own the recipe?
					if(foundComment.author.id.equals(req.user._id)) {
						next();
					} else {
						res.redirect("back");
					}
				}
			});
		} else {
			res.redirect("back");
		}
	}
};

module.exports = middlewareObj;
