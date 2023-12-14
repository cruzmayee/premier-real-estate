const express = require("express");
const app = express();

// const admin = require("firebase-admin");
// const serviceAccount = require ("./login-ffaac-firebase-adminsdk-d4a5z-f5cebb4f4d.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL:'https://login-ffaac-default-rtdb.firebaseio.com/'
// });

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.post('/signup', async (req, res)=>{
//     const user ={
//         email:req.body.email,
//         password:req.body.password
//     }
//     const userResponse = await admin.auth ().createUser({
//         email:user.email,
//         password: user.password,
//         emailVerified: false,
//         disabled: false
//     });
//     res.json(userResponse);
// })

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
   console.log(`Server is running at http://localhost:${PORT}`);
});