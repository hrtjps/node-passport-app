var express = require('express');
var app = express();

const model = require('../models/Item');

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

// SHOW LIST OF USERS
app.get("/", ensureAuthenticated ,function(req, res, next) {
  let itemList = [];
  model.find({}, function (err, items) {
    if (err) {
      res.render("index", {
        title: "Item List",
        data: []
      });
    } else {
      for (let item of items) {
        itemList.push({
          id: item._id,
          name: item.name,
          description: item.description,
        });
      }
      res.render("index", {
        title: "Item List",
        data: itemList
      });
    }
  });
})

app.get("/add",ensureAuthenticated, function(req, res, next) {
  res.render("add", {
    title: "Add New Item",
    name: "",
    description: "",
    field1: "",
    field2: "",
    field3: "",
  });
});
// ADD NEW USER POST ACTION
app.post("/add", ensureAuthenticated, function(req, res, next) {
  req.assert("name", "Title is required").notEmpty(); //Validate name
  req.assert("description", "Description is required").notEmpty(); //Validate age
  var errors = req.validationErrors();
  if (!errors) {
    var item = {
      name: req.sanitize("name").escape().trim(),
      description: req.sanitize("description").escape().trim(),
      field1: req.sanitize("field1").escape().trim(),
      field2: req.sanitize("field2").escape().trim(),
      field3: req.sanitize("field3").escape().trim(),
    };
    model.create(new model({...item}), function (err, result) {
      if (err) {
        req.flash('error', err)
        res.render('add', {
            title: 'Add New Item',
            name: item.name,
            description: item.description,
            field1: item.field1,
            field2: item.field2,
            field3: item.field3,
        })
      } else {
        req.flash('success', 'Item added successfully!')
        res.render('add', {
            title: 'Add New Item',
            name: '',
            description: '',
            field1: "",
            field2: "",
            field3: "",
        })
      }
    });
  } else {
    var error_msg = "";
    errors.forEach(function(error) {
      error_msg += error.msg + "<br>";
    });
    req.flash("error", error_msg);
    res.render("add", {
      title: "Add New Item",
      name: req.body.name,
      description: req.body.description,
      field1: req.body.field1,
      field2: req.body.field2,
      field3: req.body.field3,
    });
  }
});

app.get("/edit/(:id)",ensureAuthenticated, function(req, res, next) {
  model.findById(req.params.id, function (err, info) {
    if (err) {
      next(err);
    } else {  
      res.render("edit", {
        title: "Edit Item",
        name: info.name,
        description: info.description,
        field1: info.field1,
        field2: info.field2,
        field3: info.field3,
        id: info._id
      });
      
    }
  })
});

app.get("/show/(:id)",ensureAuthenticated, function(req, res, next) {
  model.findById(req.params.id, function (err, info) {
    if (err) {
      next(err);
    } else {  
      res.render("show", {
        title: "Detail info of Item",
        name: info.name,
        description: info.description,
        field1: info.field1,
        field2: info.field2,
        field3: info.field3,
        id: info._id
      });
    }
  })
});

app.put("/edit/(:id)",ensureAuthenticated, function(req, res, next) {
  req.assert("name", "Title is required").notEmpty(); //Validate name
  req.assert("description", "Description is required").notEmpty(); //Validate age
  var errors = req.validationErrors();
  if (!errors) {
    var item = {
      name: req.sanitize("name").escape().trim(),
      description: req.sanitize("description").escape().trim(),
      field1: req.sanitize("field1").escape().trim(),
      field2: req.sanitize("field2").escape().trim(),
      field3: req.sanitize("field3").escape().trim(),
    };
    
    model.findByIdAndUpdate(req.params.id, item, function (err, result) {
      if (err) {
        req.flash('error', err)
        res.render('Edit', {
            title: 'Edit Item',
            id: req.params.id,
            name: item.name,
            field1: item.field1,
            field2: item.field2,
            field3: item.field3,
            description: item.description
        })
      } else {
        console.log(result);
        req.flash('success', 'Item updated successfully!')
        res.render('edit', {
            title: 'Edit Item',
            id: req.params.id,
            name: item.name,
            field1: item.field1,
            field2: item.field2,
            field3: item.field3,
            description: item.description
        })
      }
    });
  } else {
    var error_msg = "";
    errors.forEach(function(error) {
      error_msg += error.msg + "<br>";
    });
    req.flash("error", error_msg);
    res.render("edit", {
      title: "Edit Item",
      id: req.params.id,
      name: req.body.name,
      field1: req.body.field1,
      field2: req.body.field2,
      field3: req.body.field3,
      description: req.body.description,
    });
  }
});

app.delete("/delete/(:id)",ensureAuthenticated, function(req, res, next) {
  
  model.findByIdAndRemove(req.params.id, function (err, result) {
    if (err) {
      req.flash("error", err);
      res.redirect("/");
    } else {
      req.flash(
        "success",
        "Item deleted successfully! id = " + req.params.id
      );
      res.redirect("/");
    }
  });
})

module.exports = app;