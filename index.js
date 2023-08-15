const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;
const multer = require("multer");
const cors = require("cors");
const session = require("express-session");
const pool = require('./app/utils/db.js')

var corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '10mb'}));
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    limit: '10mb',
    extended: true,
  })
);
app.use(
  session({
    secret: "your-secret-key",
    resave: false, // add this line to define the resave option
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

app.use("/api/auth", require("./app/routes/auth"));
app.use("/api/campaigns", require("./app/routes/campaigns"));
app.use("/api/users", require("./app/routes/users"));

app.use(express.static("public"));
app.use("/public/images", express.static("images"));
app.use("/api/report",require("./app/routes/report"));
app.use("/api/export",require("./app/routes/export"));

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    callBack(null, "./public/images");
  },
  filename: (req, file, callBack) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    callBack(null, name + "-" + Date.now() + "." + ext);
    // callBack(null, `nameOfImage_${file.originalname}`)
  },
});
// const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

app.post("/api/fileUpload", upload.single("file"), (req, res, next) => {
  console.log(req.file);
  const file = req.file;
  // if (!file) {
  //   const error = new Error("No file selected");
  //   error.httpStatusCode = 400;
  //   return next(error);
  // }
  res.status(200).json({ status: 200, file: file });
});

app.post("/api/image/:id", upload.single("file"), (req,res, next) => {
  
  const file = req.file;
  if(!file) {
    const error = new Error("No file selected");
    error.httpStatusCode = 400;
    return next(error);
  }
  
  const values = [
    req.file.filename,
    req.params.id
  ]; 

  var query = 'UPDATE campaigns SET image=$1 where id=$2';
  pool.query(query, values)
      .then(result => {
        return res.status(200).json({ status: 200, file: file });
      })
      .catch(err => {
        console.error('Error executing query', err.stack);
      });
})

// app.post("/api/image/:id", upload.single("file"), (req,res, next) => {
  
//   const file = req.file;
//   if(!file) {
//     const error = new Error("No file selected");
//     error.httpStatusCode = 400;
//     return next(error);
//   }
  
//   var jsonstring = `'{"screen" : "${req.file.filename}"}'`;
//   console.log(jsonstring);
//   const values = [
//     jsonstring,
//     req.params.id
//   ]; 

//   var query = 'UPDATE campaigns SET file = file || $1 where id=$2';
//   console.log(query);
//   pool.query(query, values)
//       .then(result => {
//         return res.status(200).json({ status: 200, file: file });
//       })
//       .catch(err => {
//         console.error('Error executing query', err.stack);
//       });
// })