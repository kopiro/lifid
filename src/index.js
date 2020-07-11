const promptiCloud = require("./icloud");
const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb://${process.env.ME_CONFIG_MONGODB_ADMINUSERNAME}:${process.env.ME_CONFIG_MONGODB_ADMINPASSWORD}@db/admin?retryWrites=true`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function pullData() {
  console.log(`Fetching data on ${new Date().toISOString()}...`);

  promptiCloud().then((myCloud) => {
    const locationPromise = myCloud.Friends.getLocations();
    client.connect(async (err) => {
      if (err) throw err;

      const col = client.db("admin").collection("locations");
      const locations = (await locationPromise).map((e) => ({
        ...e,
        createdAt: new Date(),
      }));
      col.insertMany(locations, (err) => {
        if (err) throw err;

        console.log(`OK, added ${locations.length} locations`);
      });
    });
  });
}

pullData();
setInterval(pullData, 1000 * 60 * (process.env.PULL_INTERVAL_MIN || 10));
