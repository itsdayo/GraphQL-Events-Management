var { buildSchema } = require("graphql");
var graphql = require("graphql");
export const schema = graphql.buildSchema(`
  

type Stages  {
    id: String
    name: String
  }
  type Apps {
    id: String
    name: String
    
  }
  type Data  {
    apps: [Apps]
    stages: [Stages]
    events: [Events]
  }
  type Events {
    id: String
    appId: String
    stageId: String
    name: String
    description: String
    image: String
    startsAt: Int!
    endsAt: Int!
  }
  type Query {
    data: Data
    getAllApps: [Apps]
    getAllStages: [Stages]
    getAllEvents: [Events]
    getAppById(id:String!): Apps
    getStageById(id:String!): Stages
    getStageByName(name:String!): [Stages]
    getEventById(id:String!): Events
    getEventByName(name:String!): [Events]
    getEventsByDate(startsAt:Int! endsAt:Int!): [Events]
    getEventsByAppId(appId:String!): [Events]
    getStagesByEventId(eventId:String!): Stages
    getEventsByStageId(stageId:String!): [Events]
  }

  type Mutation {
    addStage(name:String!):Data
    editStage(id: String! name:String!):Data
    removeStage(id: String!):Data
    addEvent(appId:String! stageId:String! name: String! description: String! image:String! startsAt:Int! endsAt:Int!):Data
    editEvent(id:String! appId:String! stageId:String! name: String! description: String! image:String! startsAt:Int! endsAt:Int!):Data
    removeEvent(id: String!):Data
}
  
`);

