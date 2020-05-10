// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))


// // Routes
// // =============================================================

const db = JSON.parse(fs.readFileSync("db/db.json"));

// // Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  res.json(db)
});

let nextId = 1

app.post("/api/notes", function(req, res) {
  const note = req.body

  // Generate a unique ID
  const canUseId = function(id) {
    for (i=0; i<db.length; i++) {
      if (db[i].id === id) {
        return false
      }
    }
    return true
  }
  
  while (canUseId(nextId) === false) {
    nextId++
  }
  
  note.id = nextId
  db.push(note)

  fs.writeFile("db/db.json", JSON.stringify(db),function (err){
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully wrote database to file.");
    }
  });

  console.log(db)

  res.json(db)
});

app.delete("/api/notes/:id", function(req, res) {
  const nid = req.params.id
  const index = db.findIndex(function (note) {
    console.log(note.id, nid, note.id == nid)
    return note.id == nid
  })

  if ( index >= 0 ){
    db.splice(index, 1)
  }

  res.json(db)
});



// app.get("/add", function(req, res) {
//   res.sendFile(path.join(__dirname, "add.html"));
// });

// // Displays all characters
// app.get("/api/characters", function(req, res) {
//   return res.json(characters);
// });

// // Displays a single character, or returns false
// app.get("/api/characters/:character", function(req, res) {
//   var chosen = req.params.character;

//   console.log(chosen);

//   for (var i = 0; i < characters.length; i++) {
//     if (chosen === characters[i].routeName) {
//       return res.json(characters[i]);
//     }
//   }

//   return res.json(false);
// });

// // Create New Characters - takes in JSON input
// app.post("/api/characters", function(req, res) {
//   // req.body hosts is equal to the JSON post sent from the user
//   // This works because of our body parsing middleware
//   var newCharacter = req.body;

//   // Using a RegEx Pattern to remove spaces from newCharacter
//   // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
//   newCharacter.routeName = newCharacter.name.replace(/\s+/g, "").toLowerCase();

//   console.log(newCharacter);

//   characters.push(newCharacter);

//   res.json(newCharacter);
// });

// // Starts the server to begin listening
// // =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

