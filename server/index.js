const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const votingDataFile = path.join(__dirname, "votingData.json");
const votersDataFile = path.join(__dirname, "votersData.json");

const app = express();

// Votes set up

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  next();
});

app.get("/votes", async (req, res) => {
  let data = JSON.parse(await fs.readFile(votingDataFile, "utf-8"));
  let totalVotes = data
    .map((party) => {
      return party.votes;
    })
    .reduce((acc, sum) => (acc += sum), 0);

  data = data.map((party) => {
    return {
      id: party.id,
      party: party.party,
      votes: party.votes,
      percentage: +((party.votes * 100) / totalVotes || 0).toFixed(0),
    };
  });
  res.json(data);
  return data;
  // console.log(data);
});

app.put("/votes/:id", async (req, res) => {
  let id = req.params.id;
  // let data = JSON.parse(await fs.readFile(votingDataFile, "utf-8")).pool;
  let data = JSON.parse(await fs.readFile(votingDataFile, "utf-8"));
  let updatedData = data.map((party) => {
    if (party.id == id) {
      return { ...party, votes: party.votes + 1 };
    } else return party;
  });
  await fs.writeFile(votingDataFile, JSON.stringify(updatedData));
  console.log(updatedData);
  res.json(updatedData);
  return updatedData;
});

app.get("/votes/:id", async (req, res) => {
  let id = req.params.id;
  let data = JSON.parse(await fs.readFile(votingDataFile, "utf-8")).pool;
  data = data.filter((party) => party.id == id);
  res.json(data);
  console.log(data);
});

// Voters set up

app.get("/voters", async (req, res) => {
  const data = JSON.parse(await fs.readFile(votersDataFile, "utf-8"));

  res.json(data);
  return data;
});

app.post("/voters", async (req, res) => {
  let data = JSON.parse(await fs.readFile(votersDataFile, "utf-8"));
  let ids = [];
  data.map((data) => {
    ids.push(data.idNum);
  });

  updatedData = [
    ...data,
    { username: req.body.username, idNum: +req.body.idNum },
  ];
  for (let i = 0; i < ids.length; i++) {
    if (req.body.idNum == ids[i]) {
      updatedData = data;
      console.log("Can not vote twice!");
    }
  }

  console.log(updatedData);
  await fs.writeFile(votersDataFile, JSON.stringify(updatedData));
  res.end();
});

app.listen(3000, () => console.log("Server is running..."));
