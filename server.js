require("@babel/polyfill");

require("@babel/register")({
  ignore: [/\/(build|node_modules)\//],
  presets: ["@babel/preset-env"],
});

var express = require("express");
var ParseServer = require("parse-server").ParseServer;
var path = require("path");

const GraphQLHTTP = require("express-graphql").graphqlHTTP;
const { schema } = require("./graphql/schema");

const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
var app = express();

// Serve static assets from the /public folder
app.use("/public", express.static(path.join(__dirname, "/public")));

app.get("/", function(req, res) {
  res.status(200).send("Make sure to star!");
});

var port = process.env.PORT || 1337;
var httpServer = require("http").createServer(app);
httpServer.listen(port, function() {
  console.log("parse-server-example running on port " + port + ".");
});

// The root provides a resolver function for each API endpoint

fetch("http://assets.aloompa.com.s3.amazonaws.com/rappers/hiphopfest.json")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    const appsHandler = {
      getAppsName() {
        return data.apps[0].name;
      },
      getAppsId() {
        return data.apps[0].id;
      },
      getApps() {
        return data.apps.map((singleApp) => {
          return singleApp;
        });
      },
      getAppById(id) {
        let appsArray = data.apps.map((singleApp) => {
          if (singleApp.id === id) {
            return singleApp;
          }
        });
        appsArray = appsArray.filter((appNotNull) => appNotNull != null);
        return appsArray[0];
      },
    };

    const stagesHandler = {
      getStages() {
        return data.stages.map((singleStage) => {
          return singleStage;
        });
      },

      getStageById(id) {
        let stagesArray = data.stages.map((singleStage) => {
          if (singleStage.id === id) {
            return singleStage;
          }
        });
        stagesArray = stagesArray.filter(
          (stageNotNull) => stageNotNull != null
        );
        return stagesArray[0];
      },

      getStageByName(name) {
        let stagesArray = data.stages.map((singleStage) => {
          if (singleStage.name.includes(name)) {
            return singleStage;
          }
        });
        stagesArray = stagesArray.filter(
          (stageNotNull) => stageNotNull != null
        );
        return stagesArray;
      },
      getStagesByEventId(eventId) {
        let eventsArray = data.events.map((event) => {
          if (event.id === eventId) {
            return event;
          }
        });

        eventsArray = eventsArray.filter((event) => event != undefined);

        const stageId = eventsArray[0].stageId;

        let stagesArray = data.stages.map((stage) => {
          if (stage.id === stageId) {
            return stage;
          }
        });
        stagesArray = stagesArray.filter((stage) => stage != undefined);

        return stagesArray[0];
      },
      addStage(name) {
        const allData = data;
        const singleStage = {
          id: uuidv4(),
          name: name,
        };
        allData.events = eventsHandler.getEvents();
        allData.apps = appsHandler.getApps();
        let stagesArray = data.stages;
        stagesArray = stagesArray.concat(singleStage);
        allData.stages = stagesArray;

        return allData;
      },

      editStage(stageId, name) {
        const allData = data;
        allData.events = eventsHandler.getEvents();
        allData.apps = appsHandler.getApps();
        let stagesArray = data.stages.map((stage) => {
          if (stage.id === stageId) {
            stage.name = name;
          }
          return stage;
        });
        allData.stages = stagesArray;

        return allData;
      },

      removeStage(id) {
        const allData = data;

        allData.events = eventsHandler.getEvents();

        allData.apps = appsHandler.getApps();
        let stagesArray = data.stages.filter((stage) => stage.id != id);
        allData.stages = stagesArray;

        return allData;
      },
    };
    const eventsHandler = {
      getEventById(id) {
        let eventsArray = data.events.map((singleEvent) => {
          if (singleEvent.id === id) {
            return singleEvent;
          }
        });
        eventsArray = eventsArray.filter(
          (eventNotNull) => eventNotNull != null
        );
        return eventsArray[0];
      },
      getEvents() {
        return data.events.map((singleEvent) => {
          return singleEvent;
        });
      },
      getEventByName(name) {
        let eventsArray = data.events.map((singleEvent) => {
          if (singleEvent.name.includes(name)) {
            return singleEvent;
          }
        });
        eventsArray = eventsArray.filter(
          (eventNotNull) => eventNotNull != null
        );
        return eventsArray;
      },
      getEventsByDate(start, end) {
        const eventsArray = data.events.map((event) => {
          if (event.startsAt <= start && event.endsAt >= end) {
            return event;
          }
        });
        return eventsArray.filter((event) => event != null);
      },
      getEventsByAppId(appId) {
        const eventsArray = data.events.map((event) => {
          if (event.appId === appId) {
            return event;
          }
        });

        return eventsArray.filter((event) => event != null);
      },

      getEventsByStageId(stageId) {
        let eventsArray = data.events.map((singleEvent) => {
          if (singleEvent.stageId === stageId) {
            return singleEvent;
          }
        });

        return eventsArray.filter((event) => event != undefined);
      },

      getEventsByStageId(stageId) {
        let eventsArray = data.events.map((singleEvent) => {
          if (singleEvent.stageId === stageId) {
            return singleEvent;
          }
        });

        return eventsArray.filter((event) => event != undefined);
      },

      addEvent(appId, stageId, name, description, image, startsAt, endsAt) {
        const allData = data;
        const singleEvent = {
          id: uuidv4(),
          appId: appId,
          stageId: stageId,
          name: name,
          description: description,
          image: image,
          startsAt: startsAt,
          endsAt: endsAt,
        };

        allData.stages = stagesHandler.getStages();
        allData.apps = appsHandler.getApps();
        let eventsArray = data.events;
        eventsArray = eventsArray.concat(singleEvent);
        allData.events = eventsArray;

        return allData;
      },
      editEvent(
        eventId,
        appId,
        stageId,
        name,
        description,
        image,
        startsAt,
        endsAt
      ) {
        const allData = data;
        allData.stages = stagesHandler.getStages();
        allData.apps = appsHandler.getApps();
        let eventsArray = data.events.map((event) => {
          if (event.id === eventId) {
            event.appId = appId;
            event.stageId = stageId;
            event.name = name;
            event.description = description;
            event.image = image;
            event.startsAt = startsAt;
            event.endsAt = endsAt;
          }
          return event;
        });
        allData.events = eventsArray;
        return allData;
      },

      removeEvent(id) {
        const allData = data;

        allData.stages = stagesHandler.getStages();

        allData.apps = appsHandler.getApps();
        let eventsArray = data.events.filter((event) => event.id != id);
        allData.events = eventsArray;

        return allData;
      },
    };

    var rootResolver = {
      data: () => data,

      getAllApps: () => {
        return appsHandler.getApps();
      },

      getAllStages: () => {
        return stagesHandler.getStages();
      },

      getAllEvents: () => {
        return eventsHandler.getEvents();
      },

      getAppById: (args) => {
        const appId = args.id;
        return appsHandler.getAppById(appId);
      },

      getStageById: (args) => {
        const stageId = args.id;
        return stagesHandler.getStageById(stageId);
      },

      getEventById: (args) => {
        const eventId = args.id;
        return eventsHandler.getEventById(eventId);
      },

      getStageByName: (args) => {
        const stageName = args.name;
        return stagesHandler.getStageByName(stageName);
      },

      getEventByName: (args) => {
        const eventName = args.name;
        return eventsHandler.getEventByName(eventName);
      },

      getEventsByDate: (args) => {
        const start = args.startsAt;
        const end = args.endsAt;
        return eventsHandler.getEventsByDate(start, end);
      },

      getEventsByAppId: (args) => {
        const appId = args.appId;
        return eventsHandler.getEventsByAppId(appId);
      },

      getStagesByEventId: (args) => {
        const eventId = args.eventId;

        return stagesHandler.getStagesByEventId(eventId);
      },

      getEventsByStageId: (args) => {
        const stageId = args.stageId;

        return eventsHandler.getEventsByStageId(stageId);
      },

      editStage: (args) => {
        const id = args.id;
        const name = args.name;
        return stagesHandler.editStage(id, name);
      },

      addStage: (args) => {
        const name = args.name;
        return stagesHandler.addStage(name);
      },
      removeStage: (args) => {
        const id = args.id;
        return stagesHandler.removeStage(id);
      },

      addEvent: (args) => {
        const appId = args.appId;
        const stageId = args.stageId;
        const name = args.name;
        const description = args.description;
        const image = args.image;
        const startsAt = args.startsAt;
        const endsAt = args.endsAt;
        return eventsHandler.addEvent(
          appId,
          stageId,
          name,
          description,
          image,
          startsAt,
          endsAt
        );
      },

      editEvent: (args) => {
        const id = args.id;
        const appId = args.appId;
        const stageId = args.stageId;
        const name = args.name;
        const description = args.description;
        const image = args.image;
        const startsAt = args.startsAt;
        const endsAt = args.endsAt;

        return eventsHandler.editEvent(
          id,
          appId,
          stageId,
          name,
          description,
          image,
          startsAt,
          endsAt
        );
      },
      removeEvent: (args) => {
        const id = args.id;
        return eventsHandler.removeEvent(id);
      },
    };

    app.use(
      "/graphql",
      GraphQLHTTP((request) => {
        return {
          rootValue: rootResolver,
          graphiql: true,
          pretty: true,
          schema: schema,
          context: { sessionToken: request.headers["x-parse-session-token"] },
        };
      })
    );
  });

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
