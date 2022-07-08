import { useMutation, gql } from '@apollo/client';

const ChangeUsernameMutation = gql`
  mutation Mutation($selfid: String!, $newUsername: String!) {
    changeUsernameBySelfid(selfid: $selfid, newUsername: $newUsername) {
      selfid
      username
    }
  }
`
// Example at https://www.apollographql.com/docs/react/data/mutations/
function MutationBlock() {
    const [changeUsername, { data, loading, error }] = useMutation(ChangeUsernameMutation);

    const handleFormSubmit = async (event) => {
        // Prevent the content from deminish after submitted
        event.preventDefault();

        try {
            const { data } = await changeUsername({ variables: { 
                "selfid": "idforuser2", 
                "newUsername": "user2newname" 
            }, });
          } catch (err) {
            console.error(err);
          }
    }

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <button type="submit">
                    Change now!
                </button>
            </form>
            <a href='/'>Check the change</a>
        </div>
    )
}

export default MutationBlock;