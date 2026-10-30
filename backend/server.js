const dns = require("dns");
dns.setServers(["8.8.8.8"]); // tells node.js to go to google dns reslver instad of default dns resolver

require("dotenv").config();  //imports dotenv and reads .env file,parses and automatically attaches them to node.js global process .env object
 
const Incident = require("./models/Incident");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); //Cross-Origin Resource Sharing (CORS)


const app = express();

app.use(cors({  //registering middleware to enable Cross-Origin Resource Sharing (CORS) for all incoming requests
  origin: "http://localhost:5173"
}));

const PORT = process.env.PORT || 5000;



app.use(express.json()); //registering middleware to parse incoming JSON request bodies


//used for test if the server is turned on and responding to network requests.
app.get("/",(req,res) => {  //route handler for GET request to root path
    res.send("IncidentTrack backend is running!");  //response method
});

app.post("/api/incidents", async(req,res) => { //route handler for POST request to /api/incidents path
    try{
        const incident = await Incident.create(req.body); //incident.create() method creates a new incident document in the MongoDB collection using the data from the request body
        res.status(201).json(incident);
    } catch(error){
        res.status(400).json({
            message: error.message,
        });
    }
});



app.get("/api/incidents", async (req, res) => { //route handler for GET request to /api/incidents path
  try {
    const { search, status, severity} = req.query; //destructuring assignment to extract search, status, and severity query parameters from the request object
    const filter = {}; //initialize an empty filter object to store the query parameters

    if(search){
      filter.title = {
        $regex: search, //$regex operator allows for pattern matching in MongoDB queries
        $options: "i", //$options: "i" makes the search case-insensitive
      };
    }

    if(status){
      filter.status = status; 
    }

    if(severity){
      filter.severity = severity;
    }
    const incidents = await Incident.find(filter).sort({ createdAt: -1 });

    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve incidents",
    });
  }
});


//provide the numbers for your dashboard cards
app.get("/api/incidents/stats",async(req,res) =>{
  try{
    const [total,open,highSeverity, resolved] = await Promise.all([
      Incident.countDocuments(), //count total number of incidents
      Incident.countDocuments({ status: "Open" }), //count number of incidents with status "Open"
      Incident.countDocuments({ severity: { $in: ["High", "Critical"] } }), //count number of incidents with severity "High" or "Critical"
      Incident.countDocuments({ status: "Resolved" }), //count number of incidents with status "Resolved"
    ]);

    res.status(200).json({ total, open, highSeverity, resolved });
  }catch(error){
    res.status(500).json({
      message: "Failed to retrieve incident statistics",
    })
  }
})

//retrieving a single incident by its ID
app.get("/api/incidents/:id", async (req, res) => { //route handler for GET request to /api/incidents/:id path
  try {
    const incident = await Incident.findById(req.params.id); //incident.findById() method retrieves a single incident document from the MongoDB collection based on the provided ID in the request parameters
    if (!incident) {
      return res.status(404).json({ 
        message: "Incident not found" 
    });
    }
    res.status(200).json(incident);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve incident",
    });
  }
});


//update an existing incident's title,description,severity or status without creating a new incident

app.patch("/api/incidents/:id", async (req, res) => {
  try {
    const updates = { ...req.body }; //shallow copy of the request body object to avoid mutating the original object

    if (updates.status === "Resolved") {
      updates.resolvedAt = new Date(); //if the status is updated to "Resolved", set the resolvedAt field to the current date and time
    } else if (updates.status) {
      updates.resolvedAt = null;
    }

    const incident = await Incident.findByIdAndUpdate( //incident.findByIdAndUpdate() method updates an existing incident document in the MongoDB collection based on the provided ID in the request parameters
      req.params.id,
      updates, //updates object containing the fields to be updated
      {
        new: true,         //{ new: true } ensures Mongoose returns the newly updated document 
        runValidators: true, //{ runValidators: true } ensures that the update operation respects the schema's validation rules
      }
    );

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    res.status(200).json(incident);    // Send the updated document back to the user
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});


//delete an incident by its ID
app.delete("/api/incidents/:id", async(req,res) =>{
  try{
    const incident = await Incident.findByIdAndDelete(req.params.id);

    if(!incident){
      return res.status(404).json({ message: "Incident not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete incident",
    });
  }
})

//connecting to MongoDB using mongoose.connect() method
mongoose.connect(process.env.MONGODB_URI) //returns a promise
.then(() => {              //js promises success path
    console.log("MONGODB connected succesfully");

    app.listen(PORT, () =>{ //server control method
        console.log(`server running on port ${PORT}`);
    });
})

.catch((error) => {  // js promises failure path
    console.error("MongoDB conencrion failed:",error.message);
    process.exit(1);
});