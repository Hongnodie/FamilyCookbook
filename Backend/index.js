// DATABASE (NO INTERACTION) CLOUD SERVER (MongoDB) PLUS(&) EXPRESS (NPM)
// 0-BEFORE ALL, INIT THE PROGRAMME WITH COMMAND: "npm init -y"

// DEPENDENCIES INCLUDE - graphql, mongoose, express, apollo-server-express (and be sure to remove apollo-server due to suggested conflict)
// INSTRUCTION GIVEN HERE: https://www.apollographql.com/docs/apollo-server/integrations/middleware/#swapping-out-apollo-server
// 1-RUN COMMAND: (optional) "npm uninstall apollo-server" and "npm install apollo-server-express graphql" 
const { ApolloServer, gql } = require('apollo-server-express');

// 2-APOLLO SETUP
// Example by apollo official guidebook at https://www.apollographql.com/docs/apollo-server/getting-started/#step-3-define-your-graphql-schema
// 2.1-DEFINE SCHEMA FOR GQL SERVER (GQL IS NOT A LANGUAGE BUT A SERVER THAT FOLLOWS CERTAIN LANGUAGE LOGIC)

const typeDefs = gql`
    #   This line is comment

    type User {
        _id: String!
        selfid: String!
        username: String!
    }

    #   "Query" is a special term in gql as it defines <function name>(accepted variables) : <return object example> -- alias as "context"
    #   "[User]" tells apollo that the return value is [ one or multiple instance of User ]
    type Query {
        allUser: [User]
    }

    #   "Mutation" is also special as it creates <function name>(accepted variables: types) : <return object>
    #   "$" in apollo indicate variable, detail at https://www.apollographql.com/tutorials/lift-off-part3/query-building-in-apollo-studio
    type Mutation {
        changeUsernameBySelfid(selfid: String!, newUsername: String!): User
    }
`;

// 2.2-DEFINE SOME DATASET - BUT HERE WE INTRODUCE IT INTO MONGODB
// TARGET IS TO BRING THE DATA TO THE CLOUD
// Since _id is a special term in mongoDB and not self defined, "_id" is renamed as "selfid"
// const users = [
//     { selfid: 'idforuser1', username: 'user1' },
//     { selfid: 'idforuser2', username: 'user2' }
// ];
// MongoDB requires that we need to scheme it first beforing using a model, guide here https://mongoosejs.com/docs/guide.html

// 2.2.1-SCHEME DATABASE FIRST (Same as what you tell to the apollo server in above)
// Example by mongodb official guidebook at https://mongoosejs.com/docs/guide.html#definition
// OF COURSE INSTALL "mongoose" npm package with command "npm i mongoose"
const mongoose = require('mongoose');
// MULTIPLE WAYS OF CALLING FOR "SCHEMA" AVAILABLE: mongoose.Schema() OR {Schema}=mongoose + Schema() as suggested here https://mongoosejs.com/docs/schematypes.html#objectids
const userSchema = new mongoose.Schema({
    // Details of various type definition see https://mongoosejs.com/docs/schematypes.html
    // TODO: gives full list of available types accepted by mongoDB
    selfid: {  
        type: String, 
        required: true,
        unique: true,
    },
    username: {
        type: String,
        default: undefined,
        alias: "nameOfUser",
    },
})

// 2.2.2-FILL SCHEMA TO THE MODEL
// "User" is going to be the name in mongoDB cloud
const userModel = mongoose.model('User', userSchema);
// After this, mongoDB is operatable by calling for "userModel"(self-named)

// 2.2.3-SEND LOCAL MODEL TO THE CLOUD DATABASE SERVER AND STAY CONNECTED
// Example by mongoose official guidebook at https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
// Name database(db)  as "apollo-template"
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apollo-template', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    // 2.2.4-SEED THE CLOUD DATABASE
    // Terminology "seed" means put data (requires to be json object) to the place where you try to find it
    .then( async () => {
        // since unique is true delete all the existing data to avoid err
        // Full list of query found here https://mongoosejs.com/docs/api/query.html
        await userModel.deleteMany({});
        
        const userSavedResponse = await userModel.insertMany([
            { selfid: 'idforuser1', username: 'user1' },
            { selfid: 'idforuser2', username: 'user2' }
        ]);
        // console.log(userSavedResponse);
    });

// 2.3-DEFINE WHAT ACTION IS EACH NAMED FUNCTION EXACTLY DOING
// Tell the resolver to find the data from cloud database
// List of operators (e.g. "$set") for mongoDB given here https://www.mongodb.com/docs/manual/reference/operator/update/
const resolvers = {
    Query: {
        allUser: async () => {
            return userModel.find({});
        },
    },
    Mutation: {
        changeUsernameBySelfid: async ( parent, { selfid, newUsername }) => {
          const changedUsername = await userModel.findOneAndUpdate({ selfid }, { $set: { username: newUsername } }, { new: true });
          return changedUsername;
        },
    }
};

// 3-START THE SERVER
// 3.1-INTRODUCE THE PREREQUISITE FOR GQL SERVER
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

// 3.2-INTRODUCE EXPRESS
// 3.2.1-Introduce the npm with COMMAND "npm i express"
const express = require('express');
const app = express();
// 3.2.2-Include any middleware (e.g extension that applies before express routing to enable specific purpose like using res.params/body or parsing json header)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// 3.2.3-Define routing
app.get('/', (req, res) => {
    console.log("Oh the routing is working");
  });

// 3.3-START THE SERVER
// 3.3.1-Make sure to await server start first then the followings
// Example given here (focus on the last few lines of code) https://www.apollographql.com/docs/apollo-server/integrations/middleware/#example
const startApolloServer = async () => {
    await server.start();
    server.applyMiddleware({ app });

    // Setup the opening gate (define that by default 5000)
    const PORT = process.env.PORT || 5000;
    // if no need for seeding in 2.2.3, mongoDB connection is put here and wrap the below like this: .then(()=>{app.listen(...)}) 
    // Activate the service "listen" to the request should be the last step
    app.listen(PORT, () => {
        // console.log(server);
        console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
      })
}
// 3.3.2-Call the async function to start the server
startApolloServer();

// RUN COMMAND: "node index.js" (STOP BY USING "Ctrl"+"C" THEN RESPOND "y", ENTER) to start

 