import express from 'express'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const port = 3040;
const app = express();

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// DataBase Connection :)
// db name : BabyBlossom
// connection string : mongodb://localhost:27017/
mongoose.connect('mongodb://127.0.0.1:27017/BabyBlossom');
const db = mongoose.connection;
db.once('open',()=>{
    console.log("MongoDB Connected");
});
const userSchema = new mongoose.Schema({
    Rfname: { type: String, required: true },
    Remailadd: { type: String, required: true, unique: true },
    Rpassword: { type: String, required: true }
});

const users = mongoose.model("UserData",userSchema);

// Shows Web
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname,'Login.html'));
});


// Registration page :
app.post('/register', async (req, res) => {
    try {
        const { Rfname, Remailadd, Rpassword } = req.body;
        const user = new users({
            Rfname,
            Remailadd,  
            Rpassword
        });
        await user.save();
        console.log("Registration Successful");
        // Set username in local storage and redirect
        res.redirect(`/home?username=${encodeURIComponent(Rfname)}`);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send("Error Registering User. Can not use same Email address !!!");
    }
});


// Login page :
app.post('/login', async (req, res) => {
    try {
        const { Lemail, Lpassword } = req.body;

        const uMail = await users.findOne({ Remailadd: Lemail });

        if (!uMail) {
            return res.status(400).send("User not found. Please register first!");
        }
        if (uMail.Rpassword === Lpassword) {
            console.log("Login Successful");
            // Set username in local storage and redirect
            res.redirect(`/home?username=${encodeURIComponent(uMail.Rfname)}`);
        } else {
            return res.status(400).send("Incorrect password. Please try again!");
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("Error logging in. Please try again later.");
    }
});

//
app.get('/home', (req, res) => {
    res.sendFile(join(__dirname, 'Home.html'));
});


app.listen(port, () => {
    console.log(`Server satared on : http://localhost:${port}`)
});    