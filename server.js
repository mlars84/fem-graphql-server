require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql');
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const mongoose = require('mongoose');
const cors = require('cors');

const port = process.env.PORT || 7654;

const app = express();

const CourseSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  level: { type: String, required: false }
});

const StudentSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  active: { type: Boolean, required: true },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'course',
      required: true
    }
  ]
});

const Course = mongoose.model('course', CourseSchema);
const Student = mongoose.model('student', StudentSchema);

const typeDefs = `
  type CourseType {
    id: ID
    name: String
    description: String
    level: String
  }

  type StudentType {
    id: ID
    firstName: String
    lastName: String
    active: Boolean
    courses: [CourseType]
  }

  input CourseInput {
    id: ID!
    name: String!
    description: String
    level: String
  }

  input StudentInput {
    id: ID!
    firstName: String!
    lastName: String!
    active: Boolean!
    coursesIds: [ID]!
  }

  type Query {
    allCourses: [CourseType]
    allStudents: [StudentType]
  }

  type Mutation {
    createCourse(name: String!, description: String, level: String): CourseType
    updateCourse(id: ID! name: String!, description: String, level: String): CourseType
    deleteCourse(id: ID!): CourseType
    createStudent(firstName: String! lastName: String!, active: Boolean!, coursesIds: [String]!): StudentType
    updateStudent(id: ID!, firstName: String! lastName: String!, active: Boolean!, coursesIds: [ID]!): StudentType
    deleteStudent(id: ID!): StudentType
  }
`;

const resolvers = {
  Query: {
    allCourses: async () => {
      // TODO: Run a Mongo query to return all courses
      try {
        return await Course.find({})
      } catch (err) {
        return err
      }
      //return Promise.resolve(Course.find({}).populate('courses'))
    },
    allStudents: async () => {
      // TODO: Run a Mongo query to return all students
      try {
        return await Student.find({})
      } catch (err) {
        return err
      }
    //another version (w/out async)
    // return Promise.resolve(Course.find({}))
    }
  },
  Mutation: {
    createCourse: async (_, { name, description, level }) => {
      // TODO: Run a Mongo query to save a new course
      try {
        return await Course.save({})
      } catch (err) {
        return err
      }
      // const input = { name, description, level };
      // const course = new Course(input)
      // return Promise.resolve(course.save())
    },
    updateCourse: async (_, { id, name, description, level }) => {
      // TODO: Run a Mongo query to update a course
      try {
        return await Course.findOneAndUpdate({})
      } catch (err) {
        return err
      }
      // const input = { name, description, level };
      // return Promise.resolve(
        // Course.findOneAndUpdate({_id: id}, input, {new: true})
      // )
    },
    deleteCourse: async (_, { id }) => {
      try {
        return await Course.findOneAndRemove({})
      } catch (err) {
        return err
      }
      // return Promise.resolve(Course.findOneAndRemove({_id: id}))
      // TODO: Run a Mongo query to delete a course
    },
    createStudent: async (_, { firstName, lastName, active, coursesIds }) => {
      try {
        return await Student.save({})
      } catch (err) {
        return err
      }
      // TODO: Run a Mongo query to create a student
      // let input = { firstName, lastName, active, coursesIds };
      // let student = new Student(input)
      // return Promise.resolve(student.save())
    },
    updateStudent: async (_, { id, firstName, lastName, active, coursesIds }) => {
      try {
        return await Student.findOneAndUpdate({})
      } catch (err) {
        return err
      } 
      // TODO: Run a Mongo query to update a student
      // let input = { firstName, lastName, active };
      // return Promise.resolve(
      //   Student.findByIdAndUpdate({_id: id}, input, {new: true})
      // )
    },
    deleteStudent: async (_, { id }) => {
      try {
        return await Student.findOneAndDelete({})
      } catch (err) {
        return err
      }
      // TODO: Run a Mongo query to delete a student
      // return Promise.resolve(Student.findOneAndRemove({_id: id}))
    }
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(
  '/graphql',
  cors(),
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

function listen() {
  app.listen(port);
  console.log('Express app started on port ' + port);
}

async function connect() {
  let options = {
    useMongoClient: true,
    keepAlive: true,
    reconnectTries: 30,
    socketTimeoutMS: 0
  };
  try {
    await mongoose.connect(process.env.MLAB_URL, options);
  } catch (err) {
    console.log(err);
  }
  listen();
}

connect();
