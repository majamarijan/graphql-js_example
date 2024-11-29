// Create a graphQL schema that can be used to execute a GraphQL query on the API that returns a string "Hello world!"
// run with node server.js

const { graphql, buildSchema } = require('graphql');


// Create a schema using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String,
    id: Int,
    isOpen: Boolean
  }
`);


// The rootValue provides a resolver function for each API endpoint
const rootValue = {
  hello: () => {
    return 'Hello world!';
  },
  id: () => {
    return 12;
  },
  isOpen: () => {
    return true;
  },
};

const options = {
  schema,
  rootValue,
  source: '{ hello, id, isOpen }',
};

// Run the GraphQL query '{ hello }' and print out the response
graphql(options).then((response) => {
  console.log(response);
});
