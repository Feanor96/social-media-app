const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');

module.exports = {
    Post: {
        likeCount(parent) {
            console.log(parent);
            return parent.likes.length;
        },
        commentCount(parent) {
            console.log(parent);
            return parent.comments.length;
        }
    },
    Query: {
        ...postResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation
    }
}