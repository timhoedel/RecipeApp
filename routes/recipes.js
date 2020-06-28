var express = require('express');
var router = express.Router();
var Recipe = require('../models/recipe');
var middleware = require('../middleware/index');

//INDEX - show all recipes
router.get('/recipes', function(req, res) {
	//Get recipes from db
	Recipe.find({}, function(err, allRecipes) {
		if (err) {
			console.log(err);
		} else {
			res.render('recipes/index', { recipes: allRecipes });
		}
	});
});

//Create recipe
router.post('/recipes', middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var difficulty = req.body.difficulty;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newRecipe = { name: name, image: image, description: description, difficulty: difficulty, author: author };
	//Create new recipe and safe to db
	Recipe.create(newRecipe, function(err, newObject) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/recipes');
		}
	});
});

//New recipe Form
router.get('/recipes/new', middleware.isLoggedIn, function(req, res) {
	res.render('recipes/new');
});

//SHOW
//use populate exec to load comments into object before executing the callback
//Has to be above /new, or it will be called for anything after /
router.get('/recipes/:id', function(req, res) {
	const recipeId = req.params.id;
	Recipe.findById(recipeId).populate('comments').exec(function(err, foundObject) {
		if (err || !foundObject) {
			console.log(err);
			res.redirect('back');
		} else {
			res.render('recipes/show', { recipe: foundObject });
		}
	});
});

//EDIT Recipe
router.get('/recipes/:id/edit', middleware.checkRecipeOwner, function(req, res) {
	Recipe.findById(req.params.id, function(err, foundRecipe) {
		if (err) {
			console.log('Error finding recipe to edit: ' + err);
		} else {
			res.render('recipes/edit', { recipe: foundRecipe });
		}
	});
});

//UPDATE Recipe
router.put('/recipes/:id', middleware.checkRecipeOwner, function(req, res) {
	Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, foundRecipe) {
		if (err || !foundRecipe) {
			console.log(err);
			res.redirect('/recipes');
		} else {
			res.redirect('/recipes');
		}
	});
});

//DESTROY Recipe
router.delete('/recipes/:id', middleware.checkRecipeOwner, function(req, res) {
	Recipe.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/recipes');
		} else {
			res.redirect('/recipes');
		}
	});
});

module.exports = router;
