// API server

const express = require('express');
const app = express();
const { buildSchema } = require('graphql');
// graphql-http library mounts the GraphQL API server at /graphql
const { createHandler } = require('graphql-http/lib/use/express');
const path = require('path');

app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json(), express.urlencoded({ extended: true }));

const schema = buildSchema(`
    type Query {
      hello: String,
      id: Int,
      isOpen: Boolean
    }
  `);

const root = {
  hello() {
    return 'Hello world!';
  },
  id() {
    return 12;
  },
  isOpen() {
    return true;
  }
};



// create and use graphql handler
const handler = createHandler({ schema, rootValue: root });
app.all('/graphql', createHandler({ schema, rootValue: root }));

app.listen(4000, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});