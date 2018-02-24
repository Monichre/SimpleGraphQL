const _ = require('lodash')
const Authors = require('./data/authors')
const Posts = require('./data/posts')

let {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema
} = require('graphql')

/* Here a simple schema is constructed without using the GraphQL query language. 
  e.g. using 'new GraphQLObjectType' to create an object type 
*/

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author",

  // Creates the attributes of the Author Schema
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    twitterHandle: {
      type: GraphQLString
    }
  })
})

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "This represents a post",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    body: {
      type: new GraphQLNonNull(GraphQLString)
    },
    author: {
      type: AuthorType,
      resolve: function(post) {
        return _.find(Authors, a => a.id == post.author_id)
      }
    }
  })
})

/* Root Query
  ===========================================================================
  A Root Query is an entry point to your GraphQL API server
  It's used to expose the resources available to clients of your application
  ===========================================================================
*/

const BlogQueryRootType = new GraphQLObjectType({
  name: 'BlogAppSchema',
  description: "Blog Application Schema Query Root",
  fields: () => ({
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all Authors",
      resolve: function() {
        return Authors
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      description: "List of all posts",
      resolve: function() {
        return Posts
      }
    }
  })
})

// Schema Declaration
// ===========================================================================
// Schema defines how you want the data in your application to be shaped and how 
// you want the data to be related with each other. Schema defination affects the 
// way data will be stored in your database(s).
// ===========================================================================

const BlogAppSchema = new GraphQLSchema({
  query: BlogQueryRootType
  // If you need to create or updata a datasource, 
  // you use mutations. Note:
  // mutations will not be explored in this post.
  // mutation: BlogMutationRootType 
})

module.exports = BlogAppSchema