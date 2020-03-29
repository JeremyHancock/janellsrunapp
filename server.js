const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const firebase = require('firebase');
const admin = require('firebase-admin');

const serviceAccount = require('./janellsrunapp-firebase-adminsdk-9bjxc-0966de04c2.json');
const firebaseConfig = require('./janellsRunApp-8cb921de9407.json');

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://janellsrunapp.firebaseio.com'
});

const db = admin.firestore();
const auth = admin.auth();

races = [];

app.listen(PORT, function () {
  console.log("Server listening on PORT " + PORT);
});

app.get('/usercredentials', async function (req, res) {
  response = await signin(req);
  res.send(response);
  return res.statusCode;
});

app.post('/usercredentials', async function (req, res) {
  response = await signup(req);
  res.send(response);
  return res.statusCode;
});

app.post('/reset', async function (req, res) {
  response = await reset(req);
  res.send(response);
  return res.statusCode;
});

app.get('/runs', async function (req, res) {
  runs = await getRuns(req.query.user);
  res.send(runs);
  return res.statusCode;
});

app.post('/runs', async function (req, res) {
  postResponse = await postRun(req);
  res.send(postResponse);
  return res.statusCode;
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
  password = creds.query.password;
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(response => {
        if (response.user.email.toLowerCase() === email) {
          if (response.user.emailVerified) {
            console.log('signed in as', email)
            resolve(true);
          } else {
            var user = firebase.auth().currentUser;
            user.sendEmailVerification().then(() => {
              console.log('Email sent to ', email);
              resolve('email sent');
            }).catch(error => {
              console.log(error.code);
              resolve(error.code);
            });
          }
        } else {
          resolve('problem')
        }
      })
      .catch(error => {
        console.log(error.code)
        resolve(error.code)
      });
  });
};

function signup(creds) {
  const email = creds.body.email;
  const password = creds.body.password;
  return new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(response => {
        if (response) {
          var user = firebase.auth().currentUser;
          user.sendEmailVerification().then(() => {
            console.log('Email sent to ', email);
            resolve('email sent');
          }).catch(error => {
            console.log(error.code);
            resolve(error.code);
          });
        }
      })
      .catch(error => {
        console.log(error.code);
        resolve(error.code);
      });
  });
};

function reset(request) {
  return new Promise((resolve, reject) =>{
    email = request.body.email
    const user = auth.getUserByEmail(email);
    if (user) {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          resolve("sent");
        })
        .catch(error => {
          console.log(error.code);
          resolve(error.code);
        });
    } else {
      resolve("no user found")
    };
  });
};

function getRuns(user) {
  if (user && user !== (undefined || 'undefined')) {
    return new Promise((resolve, reject) => {
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
    });
  };
};

function postRun(run) {
  return new Promise((resolve, reject) =>{
    if (run.body.user !== undefined) {
      db.collection(run.body.user + '.runs').doc(run.body.id).set(run.body)
        .then(response => {
          if (response) {
            resolve("success");
            console.log('postRun hit', run.body.raceName);
          }
        }).catch(err => {
          console.log('Error posting race', err);
          resolve(err);
        })
    };
  })
};

function updateRun(run) {
  if (run.body !== undefined) {
    console.log('updateRun was hit', run.body);
  };
};

function deleteRun(run) {
  if (run.body !== undefined) {
    console.log('deleteRun was hit', run.body);
  };
};