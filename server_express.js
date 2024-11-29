// API server

const express = require('express');
const app = express();
const { buildSchema } = require('graphql');
// graphql-http library mounts the GraphQL API server at /graphql
const { createHandler } = require('graphql-http/lib/use/express');
const { ruruHTML } = require('ruru/server');

const path = require('path');

app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json(express.urlencoded({ extended: true })));

const schema = buildSchema(`
    type Query {
      hello: String,
      id: Int,
      isOpen: Boolean,
      person: Person
    },
    type Person {
      name: String,
      id: Int,
      friends: [Person]
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
  },
  person() {
    return {
      name: 'John Doe',
      id: 12,
      friends: [
        {
          name: 'Jane Doe',
          id: 13,
          friends: [
            {
              name: 'John Doe',
              id: 12,
            },
            {
              name: 'Mary Doe',
              id: 14,
            }
          ],
        },
      ],
    };
  },
};

app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
})

// create and use graphql handler
const handler = createHandler({ schema, rootValue: root });
app.all('/graphql', createHandler({ schema, rootValue: root }));

app.listen(4000, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});