const graphql = require("graphql");
// const _ = require('lodash');
const axios = require('axios');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema
} = graphql;

// const users = [
// 	{id: '23', firstName: 'Alex', age: 20},
// 	{id: '24', firstName: 'Ben', age: 22}
// ];

const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: {
		id: { type: GraphQLString }, 
		name: { type: GraphQLString },
		description: { type: GraphQLString }
	}
});

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		company: {
			type: CompanyType,
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
				.then(res => res.data)
			}
		}
	}
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString }},
			resolve(parentValue, args){
				// go into data store and find data we are looking for 
				// args is the args above 
				
				// return _.find(users, { id: args.id }) // look through list of users with id == args.id
				return axios.get(`http://localhost:3000/users/${args.id}`) 
				.then(response => response.data);

			}
		},
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString }},
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/companies/${args.id}`)
				.then(resp => resp.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});

