var express = require('express');
var app = express();
var PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const admin = require('firebase-admin');
let serviceAccount = require('./janellsrunapp-firebase-adminsdk-9bjxc-0966de04c2.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://janellsrunapp.firebaseio.com'
});
let db = admin.firestore();
let auth = admin.auth();

races = [];
credentialsVerified = false;

app.listen(PORT, function () {
  console.log("Server listening on PORT " + PORT);
});

app.get('/usercredentials', async function (req, res) {
  authorized = await signin(req)
  authorized !== true ? authorized = false : null;
  res.send(authorized);
});

app.post('/usercredentials', async function (req, res) {
  authorized = await signup(req);
  authorized !== true ? authorized = false : null;
  res.send(authorized);
});

app.get('/runs', async function (req, res) {
  runs = await getRuns(req.query.user);
  res.send(runs);
  return res.statusCode;
});

app.post('/runs', function (req, res) {
  postRun(req);
  res.send(res.statusMessage);
});

app.put('/runs', async function (req, res) {
  runs = await updateRun(req.query);
  res.send(runs);
  return res.statusCode;
});

app.delete('/runs', async function (req, res) {
  runs = await deleteRun(req.query);
  res.send(runs);
  return res.statusCode;
});

function signin(creds) {
  email = creds.query.email.toLowerCase();
  // getRuns();
  return new Promise(function (resolve, reject) {
    authUser = auth.getUserByEmail(email)
      .then((userRecord) => {
        if (userRecord.email.toLowerCase() === email) {
          console.log('signed in as', email)
          resolve(true);
        }
      })
      .catch(function (error) {
        console.log(error)
        resolve('an error occurred', error);
      });
  });
};

function signup(creds) {
  return new Promise(function (resolve, reject) {
    authUser = auth.createUser({
      email: creds.body.email,
      emailVerified: false,
      password: creds.body.password
    })
      .then((userRecord) => {
        if (userRecord) {
          console.log('user created for', creds.body.email)
          resolve(true);
        }
      })
      .catch(function (error) {
        console.log(error)
        resolve(error);
      });
  });
}

function getRuns(user) {
  console.log('user', user)
  if (user && user !== (undefined || 'undefined')) {
    return new Promise(function (resolve, reject) {
      console.log('getRuns hit by', user)
      db.collection(user + '.runs').get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            resolve(null);
          }
          else {
            this.races = [];
            snapshot.forEach(doc => {
              raceDetails = doc.data();
              this.races.push(raceDetails);
            });
            resolve(this.races)
          }
        })
        .catch(err => {
          console.log('Error getting documents', err);
          resolve(err);
        });
    })
  }
};

function postRun(run) {
  if (run.body.user !== undefined) {
    db.collection(run.body.user + '.runs').doc(run.body.id).set(run.body);
    console.log('postRun hit', run.body.raceName);
  }
};

function updateRun(run) {
  if (run.body !== undefined) {
    console.log('updateRun was hit', run.body);
  }
};

function deleteRun(run) {
  if (run.body !== undefined) {
    console.log('deleteRun was hit', run.body);
  }
};