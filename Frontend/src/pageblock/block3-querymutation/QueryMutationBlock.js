import { useQuery, useMutation, gql } from '@apollo/client';
import { useState, useEffect } from 'react';

// This function must be named with the first letter upperclass
// Example at https://www.apollographql.com/docs/react/data/mutations/
function QueryMutationBlock() {

  // Define gql statement (copy and paste from apollo)
  const GetUserSelfidQuery = gql`
    query Query {
      allUser {
        selfid
        username
      }
    }
  `
  const ChangeUsernameMutation = gql`
    mutation Mutation($selfid: String!, $newUsername: String!) {
      changeUsernameBySelfid(selfid: $selfid, newUsername: $newUsername) {
        selfid
        username
      }
    }
  `
  
  // Since both useQuery and useMutation can reutrn "data", and we can't define two data at the same time, Refetch or Polling or Subscription should work
  // See explaination at https://www.apollographql.com/docs/react/data/queries/#updating-cached-query-results
  let { loading, data, refetch } = useQuery(GetUserSelfidQuery);
  // console.log(data);

  // Init the key bridging variable between input and cloud DB response, and also shoulders the display-value responsibility
  const [idNameCombo, setidNameCombo] = useState({});

  // Check how the variable changes by using useEffect
  useEffect(() => {
    // console.log(`idNameCombo changed to ${JSON.stringify(idNameCombo)}`);
    // console.log(`${typeof(JSON.stringify(idNameCombo))}`)
  }, [idNameCombo]);
  
  // Put selfid to the idNameCombo.selfid variable, make sure it's async
  const handleSelectChange = async (event) => {
    // console.log(event.target.value);
    event.preventDefault();
    // As parsed through <option>
    setidNameCombo({...idNameCombo, selfid: event.target.value });
    // console.log should return the previous value due to delay, explanation check here https://stackoverflow.com/a/55983132
    // console.log(idNameCombo);
  };

  const handleInputChange = async (event) => {
    event.preventDefault();
    // console.log(event.target.value);
    setidNameCombo({...idNameCombo, newUsername: event.target.value });
    // console.log(idNameCombo);
  }

  const [changeUsername, {error}] = useMutation(ChangeUsernameMutation);

  let input;

  const handleFormSubmit = async (event) => {
    // Prevent the content from deminish after submitted
    event.preventDefault();

    // TODO: ADD IF NOT EXIST TWO VARIABLE, READ DEFAULT VALUE
    // console.log(idNameCombo);
    try {
        let { data } = await changeUsername({ variables: {...idNameCombo},});

        // Alternatively use below context
        // let { data } = await changeUsername({ variables: {
        //   // selfid: "idforuser2",
        //   // newUsername: "user2new",
        //   selfid: idNameCombo.selfid,
        //   newUsername:  idNameCombo.newusername,         
        // }
        // });

        // Update the select options by refetch again
        // Tutorial here https://www.apollographql.com/docs/react/v2/data/queries/#refetching
        refetch();
      } catch (err) {
        console.error(err);
      }
  }

  return (
      <div>
        {loading? (<p>Loading in progress</p>) : (
          <form onSubmit={handleFormSubmit}>
          <label>Select user by current username: </label>
          <select onChange={handleSelectChange}>
            {data.allUser.map(({ selfid, username }) => {
              return (
                  <option key={selfid} value={selfid}> 
                    id ({selfid}) - username ({username}) 
                  </option>
              )})
            }
          </select>
          {/* assign the node reference to the input variable */}
          <input type="text" placeholder='new username' ref={ node => { input = node; }} onChange={handleInputChange} />
          <div><button type="submit"> Change now! </button></div>
          </form>
        )}
          <div><a href='/'>Back and check on main</a></div>
      </div>
  )
}

export default QueryMutationBlock;