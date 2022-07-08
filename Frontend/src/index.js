// FRONTEND PAGE BLOCK DESIGN (TO INTERACT WITH CLOUD DATA)
// ALL DEPENDENCIES INCLUDE "react react-dom react-router-dom @apollo/client react-scripts react-redux @reduxjs/toolkit"
// STAY IN THE START BY RUNNING COMMAND "npx create-react-app <react project folder name (i.e reactscript)>" as https://create-react-app.dev/docs/getting-started#quick-start
// COULD REMOVE SOME DEPENDENCIES BY COMMAND "npm uninstall web-vitals @testing-library/user-event @testing-library/react @testing-library/jest-dom"
// ALTERNATIVELY SCHEME THE FOLDER WITH PROVIDED TEMPLATES BY RUNNING COMMAND "npx create-react-app <project name> --template cra-template" https://create-react-app.dev/docs/custom-templates/

// 1-IMPORT FRAMEWORK(FUNCTIONS AND MODELS) OF REACT
// RUN COMMAND "npm i react react-dom"
// Built based on examples (here adopt the "counter-app") from https://reactjs.org/community/examples.html
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
// Import for 2.2.1
import { useQuery, gql } from '@apollo/client';
// Import for 2.3
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import for 3 (redux)
import { Provider } from 'react-redux';
import store from './reduxsystem/reduxsystem';

import OtherRouteBlock from './pageblock/block1-templated/OtherRouteBlock';
import MutationBlock from './pageblock/block2-mutation/MutationBlock';
import QueryMutationBlock from './pageblock/block3-querymutation/QueryMutationBlock';
import ChangeStateBlock from './pageblock/block4-reduxonstate/ChangeStateBlock';

// 2-DEFINE THE ROUTING (BLOCKS IN BLOCK)
// Guide here https://v5.reactrouter.com/web/guides/quick-start
// Easy understanding (roadmap) seen here https://www.apollographql.com/docs/react/caching/overview
// 2.1-Basic settings to tell apollo/client as required
// Examples at https://www.apollographql.com/docs/react/get-started#2-initialize-apolloclient
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});
// 2.2-React Unit block
// Fetch value from cloud DB and return a block of components (Alternatively // import ChildrenSection from "./components/childrenSection";)
// 2.2.1-Write context to be sent to cloud
// Example at https://www.apollographql.com/docs/react/get-started#4-fetch-data-with-usequery
const UserInfoQuery = gql`
  query Query {
    allUser {
      _id
      selfid
      username
    }
  }
`
// 2.2.2-Build this block
function UnitReactBlock() {
    const { loading, error, data } = useQuery(UserInfoQuery);
    // console.log(data);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
 
    // return <div>This did work</div>
    return (
      <div className="react-block">
        {/* {console.log(document.title)} */}
        <p>There are {data.allUser.length} users</p>
        {data.allUser.map(({ selfid, username }) => {
          return (
              <div key={selfid}> 
                <span> {selfid} 's {username}  </span> 
              </div>
          )})
        }
        <div><a href='/other'>To /other route</a></div>
        <div><a href='/mutation'>To /mutation route</a></div>
        <div><a href='/querymutation'>To /query&mutation route</a></div>
        <div><a href='/reduxonstate'>To /reduxedstate route</a></div>
      </div>
    )
}

// 2.3-Path definition - when blocks relates to routing (Alternatively // import App from "./App";)
// RUN COMMAND "npm i react-router-dom"
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Every <Uppercase? returns only one component, thus try to wrap with "<div></div>" if you want a multiple components of same level
function App() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
            <Routes>
                <Route 
                path="/" 
                element={<UnitReactBlock />} 
                />
                <Route 
                path="/other" 
                element={<OtherRouteBlock />} 
                />
                <Route 
                path="/mutation" 
                element={<MutationBlock />} 
                />
                <Route 
                path="/querymutation" 
                element={<QueryMutationBlock />} 
                />
                <Route 
                path="/reduxonstate" 
                element={<ChangeStateBlock />} 
                />
            </Routes>
        </BrowserRouter>
      </ApolloProvider>
    );
}

// Check how to wrap react here https://www.reactjstutorials.com/react-redux/15/redux-actions-reducers-store
// import { Provider } from 'react-redux';
// import store from './reduxsystem/reduxsystem';

// 4-START REACT - A ASYNC WATERFLOW TO PARSE SOME VARIABLES AS PROPERTIES
// strict-mode provides additional debugger, detail here https://reactjs.org/docs/strict-mode.html
const root = ReactDOM.createRoot(document.getElementById('locator'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// RUN COMMAND "npm start" to utilize the frontend