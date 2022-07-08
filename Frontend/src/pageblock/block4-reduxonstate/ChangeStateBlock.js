import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ChangeStateBlock() {
    // stateParser is called "dispatch" in official documentation, the function of it is to constantly doing the round trip from store to every single html component (listen to them)
    const stateParser = useDispatch();

    // Check out the reason to use here https://www.reactjstutorials.com/react-redux/14/redux-use-selector
    const state = useSelector((state) => state);

    const [newUsername, setnewUsername] = useState('');

    return (
        <>
        <h2>Do surgery on state (Redux)</h2>
        <div>
            Add a user:
            <input
              defaultValue={newUsername}
              onChange={(event) => setnewUsername(event.target.value)}
              placeholder="new username"
              type="text"
            />
            <button
              onClick={() => stateParser({ 
                type: "addUser", 
                variables: { username: newUsername }, 
                })}
            >
              Add This User
            </button>
        </div><br/>
        <div>
            Choose a user to delete:
            <select id='selectSection'>
            {state.users.users.map((user) => {
              return (
                  <option key={user.selfid}> 
                    id ({user.selfid}) - username ({user.username}) 
                  </option>
              )})
            }
            </select>
            <button
              onClick={async () => {
                // console.log(state);
                const index = await document.getElementById("selectSection").selectedIndex;
                // console.log(index);
                const userByIndex = state.users.users[index];
                // console.log(userByIndex);
                stateParser({ 
                    type: "deleteUserByName", 
                    variables: { username: userByIndex.username }, 
                    })
                } }
            >
              Delete This User
            </button>
        </div>
        <div>
            {/* {console.log(state.users.users[0].selfid)} */}
            <h3>Current id - username list</h3>
            {state.users.users.map((user) => { return (
                // Should be noted here that the key here should be different from the above since that are on the same page
                <div key={user.username}>
                    id ({user.selfid}) - username ({user.username})
                </div>
                )
            })}
        </div>
        <div><a href='/'>Back to main</a></div>
        </>

    )
}