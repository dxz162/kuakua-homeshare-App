var express = require("express");
var router  = express.Router();
var Property = require("../models/property");

// Index - show all properties
router.get('/', function (req, res) {
	// get all property from db
	// TODO: 这里需要判断登陆用户
	Property.find({}, function (err, allProperties) {
		if (err) {
			console.log(err);
		} else {
			res.render('properties/index', { propertyList: allProperties });
		}
	});
});

// CREATE - add new property to DB
router.post('/', function (req, res) {
	// get data from form, add data to propertyList arr
	var name = req.body.propertyName;
	var image = req.body.propertyImg;
	var description = req.body.propertyDesc;
	var newProperty = { name: name, image: image, description: description };
	// create a new property and save to DB
	Property.create(newProperty, function (err, newlyCreateed) {
		if (err) {
			// TODO: tell user to refill the form
			console.log("err~~",err);
		} else {
			res.redirect('/properties');
		}
	});
});

// NEW - show form to create new property
router.get('/new', function (req, res) {
	res.render('properties/new');
});


// SHOW - show more info about one property
router.get('/:id', function (req, res) {
	// find the property with provided ID
	Property.findById(req.params.id).exec(function (err, foundProperty) {
		if (err) {
			// TODO: tell user to refill the form
			console.log( err);
		} else {
			// render show template with that property
			res.render('properties/show', { property: foundProperty });
		}
	});
});

// exports
module.exports = router;
