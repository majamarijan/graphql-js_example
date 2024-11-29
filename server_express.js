// API server

const express = require('express');
const app = express();
const { buildSchema } = require('graphql');
// graphql-http library mounts the GraphQL API server at /graphql
const { createHandler } = require('graphql-http/lib/use/express');
const { ruruHTML } = require('ruru/server');
const favicon = require('serve-favicon');

const path = require('path');
const { randomUUID } = require('crypto');

app.use(express.static(path.join(__dirname, 'src')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.json(express.urlencoded({ extended: true })));

const schema = buildSchema(`
    type Query {
      hello: String,
      id: Int,
      isOpen: Boolean,
      person: Person,
      pokemon: Pokemon
    },
    type Person {
      name: String,
      id: ID!,
      favNumbers: [Int],
      friends: [Person]
    },
    type Pokemon {
      id: Int,
      name: String,
      sprites: Sprites,
      cries: Cries,
      abilities: [Abilities],
      types: [Types]
    }
    type Sprites {
      other: Other
    }
    type Other {
      dream_world: DreamWorld
    }
    type DreamWorld {
      front_default: String
    }
    type Cries {
      latest: String
    }
    type Abilities {
      ability: Ability
    }
    type Ability {
      name: String
    }
    type Types {
      type: PokemonType
    }
    type PokemonType {
      name: String
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
      id: randomUUID(),
      favNumbers: [1, 2, 3],
      friends: [
        {
          name: 'Jane Doe',
          id: 13,
          favNumbers: [12, 33, 104],
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
  async pokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + Math.floor(Math.random() * 200 + 1));
    const data = await response.json();
    return data;
  }
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