# GraphQL Students-Courses Server

This is the GraphQL server implementation used in Front End Masters' GraphQL workshop. It contains GraphQL queries and mutations to handle CRUD operations on a **courses** and **students** resource. MongoDB is used to persist the data and a connection to mLab is provided.

## Getting Started

Clone the repo, install the dependencies, and run the server.

```bash
npm i
# for live reload
npm run dev
# for prod
npm start
```

The app will be served at `localhost:8080` and GraphiQL can be accessed at `localhost:8080/graphql`.

## Why Did You Commit Your mLab Credentials?

There is a `.env` file included with a connection string to an mLab database. Normally the `.env` file would not be committed and any access to a remote server would be hidden. The database used for this example is a throwaway. For the sake of getting started quickly, it is easier to provide direct access to a working database out of the box.

If you will be publishing work based on this example, be sure to keep any database credentials out of source control.

## Why Is There A `Data` Folder?

Some static data is provided for the getting started examples during the workshop.

## Using Your Own mLab Connection

To use your own mLab database, change the connection string value for `MLAB_URL` in the `.env` file. Read the [mLab docs](http://docs.mlab.com/) to get started if you are unfamiliar with it.

## License

MIT

## Notes
- Data modeling, types and schemas:
 - The type system is at the heart of a GraphQL server implementation.
- How do we describe the fields in our schema?
 - Fields can have a concrete (scalar) type:
   - Int
   - String
   - Float
   - Boolean
   - ID
 - Fields can be object types with further fields
   - Most of the time, JSON API's deal in objects
   - could be a single object or an array of objects
   - most of the time we're not just sending back strings or numbers alone
   - we'll use object types very frequently
- What do Object Types look like?
 - fields that eventually resolve to scalar types or other objects/lists.
- Type Modifiers
 - Sometimes we need a way to further modify a type
   - What if we want the type to be in an array?
   - What if we want to make sure the field isn't null?
- GraphQL List
 - Signifies that the field should produce an array of values
 - Can be used with object types or scalar types.
- Input Object Type
 - Much like a regular object type, but used for input for a mutation
 - Distinguishes itself from output types
   - The GraphQL spec defines two categories of types: those that go out from the server and that that come in.
- Non null
 - Sometimes it's fine if a piece of data doesn't exist
 - sometimes we want a guarantee that it does exist
   - Used for both input and output types
- Other Types
 - Interface
   - a Type must have certain fields
 - Enum
   - I want only certain values
 - Union
   - Similar to interfaces
- Custom Scalar Types
 - There are only a handful of provided scalar types
 - What about things like date?
 - We might want others:
   - Phone
   - Email
- So what is a schema then?
 - GraphQL Schema
   - A collection of types to describe the shape of the data.
-` new gql.GraphQLList` is a type modifier, rather than a type.
### Queries, Resolvers and Arguments
 - Queries
   - GraphQL gives us two options: Query and Mutation
   - Queries are analogous to a GET request
   - We use mutations any time we want to write some data
     - we could use a query, but we really shouldn't
  - Resolvers
   - The Resolve Function
     - Where the magic happens
       - Call out to a database
       - operate on data before saving
       - operate on data before it is sent to the Client
     - Root/Parent
       - Data passed from a field higher up (or parent field)
     - Arguments Object
     - Context
     - Resolvers and Async
       - the resolve function fully handles async operations
         - Promises
         - Async/await(Node v8)
       - Important for making database calls
       - Required for every field
 - Arguments
   - Queries become a lot more powerful when we can pass in arguments
     - Look for a specific piece of data by ID or name
     - Limit the data coming back by filter
     - Sort the data
     - must be named and have a type
     - passed to resolvers as a single object
       - Desctructuring comes in handy
     - if a required argument isn't passed, GQL will throw an execution error
   - Using Arguments
     - We need to tell our GQL server about arguments it should expect
     - we need to give them a type
     - we need to get access to them in the resolver to make use of them
     - GQL arguments are always named
     - can be optional or required
       - if optional, we can specify a default value
### Mutations
 - What is a mutation?
   - The GraphQL type we use when we want to write some data
   - in the REST analogy, anything that we'd do with a POST, PUT, PATCH or DELETE request.
 - What do they look like?
   - A lot like queries, but generally always have variables/arguments as input
   - Just like there is a root query type, there is a root mutation type
     - on the root mutation type there are fields that contain our mutations
   - mutations can have any name but generally it should be the action the user is performing
     - createUser
     - updateEmail
     - addPersonToContacts
 - Mutations look like queries
   - we could use the query type to write data if we wanted to
     - just like how we can use GET requests in REST
   - It's important that we use the mutation type becuase it has special behavior
     - queries run in parallel, but mutations run in sequence
     - important for async
 - Mutation Request
   - Mutation From the client
     - use the mutation keyword
     - pass in data as input
     - list the result fields we want
 - Why ask for fields back?
   - The client might need/want the data that was just written
   - Even though we already have it (because we sent it) we can get database IDs etc
 - The Input Object Type
   - GQL has both Object Type and Input Object Types
   - They look different but have a key differance
     - Objects can contain fields that express circular references or references to interfaces
     and unions, neither of which is appropriate for use as an input argument. For this
     reason, input objects have a separate type in the system.”
### Hooking up a Database
 - We're querying GraphQL itself, but we need to query a database as well.
 - GraphQL doesn't care what kind of DB your using
 - As long as you can make a call to your DB from your resolver, you’re good to go
- Resolvers and Async
 - Remember that resolvers fully handle async
   - They will wait for an async operation to complete before sending back the
   result
   - Promises, async/await
- Async await with MongoDB:
 ```
 const resolvers = {
   Query: {
     allCourses: async () => {
       try {
         return await Course.find({})
       } catch (err) {
         return err
       }
     }
   }
 }
 ```
### Best Practices
 - Keep the client-side developer in mind
 - Favor a single input object over many arguments
 - Make mutations specific
   - Do one thing well
 - Name mutations verb-first
- Going further
 - Authentication and authorization
 - Catch-all auth
 - Get auth info from context
