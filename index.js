import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
 
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var tracksList = [];



const options = {
    method: 'GET',
    url: 'https://spotify23.p.rapidapi.com/recommendations/',
    params: {
      limit: '50',
      seed_genres: 'pop'
    },
    headers: {
      'x-rapidapi-key': '0eb77712b3mshfeb36b8de4fafecp171096jsn3d9b5741b96e',
      'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
};

const searchOptions = {
    method: 'GET',
    url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
    headers: {
      'x-rapidapi-key': '0eb77712b3mshfeb36b8de4fafecp171096jsn3d9b5741b96e',
      'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    }
};



app.get("/", async (req, res) => {
    tracksList = [];

    try{
        const response = await axios.request(options);
        
        response.data.tracks.forEach(track => {
            let trackDetail = 
            {
                title : track.name,
                artist: track.artists.map(artist => artist.name).join(", "),
                image : track.album.images[0].url,

            };  
        tracksList.push(trackDetail);
        });
    }catch(e){
        console.log(e);
    }
   
    res.render("index.ejs", {tracks: tracksList});
});

app.get("/search",(req, res) => {
    res.render("search.ejs");
});

app.post("/result", async(req, res)=> {
    tracksList = [];
    searchOptions.params = {q: req.body.q};

    try{

        const response = await axios.request(searchOptions);
        response.data.data.forEach(track => {
            let trackDetail = {
                title : track.title,
                artist: track.artist.name,
                image : track.album.cover_big,
            };

            tracksList.push(trackDetail);
        });

        res.render("search.ejs", {tracks: tracksList});
    }catch(e){
        console.log(e);
    }
});




app.listen(port, ()=>{
    console.log(`Server is now running at ${port}.`);
});
