require('dotenv').config();
const express = require('express'),
    app = express(),
    cors = require('cors'),
   {Server} = require('socket.io'),
   multer = require("multer");

const storage=multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads')
    },
    filename: (req, file, cb)=>{
        cb(null, file.fieldname+"-"+Date.now())
    }
})
const upload = multer({storage});
const {Image} = require('./models');

// app.get('/uploads', (req, res)=>{
//     Image.find({}, (err, items)=>{
//         if (err){
//             console.log(err);
//             res.status(500).json(err);
//         }
//         console.log(items);
//         res.status(200).json(items);
//     })
// })
// app.post('/uploads', upload.single('image'), (req, res, next)=>{
//     let obj = {
//         name: req.body.name,
//         desc: req.body.desc,
//         img: {
//             data: fs.readFileSync(path.join(__dirname, './uploads', req.file.filename)),
//             contentType: 'image/png'
//         }
//     };
//     console.log(req.body)
//     Image.create(obj, (err, item)=>{
//         if (err) console.log(err);
//         res.redirect('/uploads');
//     })
// })

const {ApolloServer} = require('apollo-server-express'),
    httpServer = require('http').createServer(app),
    path = require('path'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    SessionStore = require('connect-mongodb-session')(session),
    io = new Server(httpServer, {
        cors: {
            origin: ['https://studio.apollographql.com', 'http://localhost:3000', 'http://localhost:8080', 'https://jeremyjs.dev']
        }
        
    });
const sessionConfig = session({
    secret:process.env.SESSION_SECRET,
    name: "sid",
    cookie:{
        maxAge:6000*60*24,
        secure:process.env.NODE_ENV==="production"
    },
    resave:false,
    saveUninitialized:false,
    store:new SessionStore({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/test_local_db',
        collection: "sessions"
    })
});
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);


const {authMiddleware} = require("./utils/auth");
const jwt = require("jsonwebtoken");
const fs = require("fs");

io.use(wrap(sessionConfig))

const startApolloServer = async (typeDefs, resolvers) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        cache: "bounded",
        csrfPrevention:true,
        introspection:true,
        
        context: authMiddleware
    });
    await server.start();
    // Middleware
    
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, './client/build')));
    app.use(sessionConfig);
    server.applyMiddleware({
        app,
        cors: {
           origin: ['https://studio.apollographql.com', 'http://localhost:3000', 'http://localhost:8080', 'https://jeremyjs.dev'],
           }
    });

    await new Promise(resolve => {
        httpServer.listen(4000, resolve);
        console.log("listening on port: 8080");
    })
}

app.set('io', io);
    io.on('connection', (socket)=>{
        const sReq = socket.request;
        // console.log(socket.handshake);
        if (!socket.handshake.query.token){
            console.log('No token');
        }
        if (socket.handshake.query.token){
            let token = socket.handshake.query.token.split(' ')[1];
            try {
                const data= jwt.verify(token, process.env.JWT_SECRET, {maxAge: process.env.JWT_EXP})
                sReq.session.user = data.payload;
                socket.userId = data.payload._id;
            } catch (e){
                console.log(e);
            }
            console.log(sReq.session.user);
        }
        socket.on('name', (name)=>{
            sReq.session.name = name;
            socket.broadcast.emit('name', name);
        })
       
        socket.on('message', (message)=>{
            io.emit('message', message);
        })
        
        socket.on('disconnect', (reason)=>{
            console.log(reason);
            socket.removeAllListeners();
        })
    });


//serve index from react app on all routes
// app.get('/graphql', (req, res, next)=>{
//     return next();
// })
app.get('/*', (req, res, next)=>{
    if (process.env.NODE_ENV === "development") next();
    else res.sendFile(path.join(__dirname, "./client/build/index.html"))
});
const {typeDefs} = require('./schema');
const {resolvers} = require('./schema');


//connect to database and then start the apollo server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test_local_db');
mongoose.connection.once('open', async () => {

    await startApolloServer(typeDefs, resolvers);
})