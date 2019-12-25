export const resolvers = {
  Query: {
    attackTypes: async (_, args, { dataSources }) => {
      return await dataSources.gameAPI.getAttackTypes();
    },
    rarities: async (_, args, { dataSources }) => {
      return await dataSources.gameAPI.getRarities();
    },
    elements: async (_, args, { dataSources }) => {
      return await dataSources.gameAPI.getElements();
    },
    creeps: async (_, args, { dataSources }) => {
      return await dataSources.gameAPI.getCreeps();
    },
    creepSizes: async (_, args, { dataSources }) => {
      return await dataSources.gameAPI.getCreepSizes();
    },
    towers: async (_, args, { dataSources }) => {
      return await dataSources.towerAPI.getTowers(args);
    },
    items: async (_, args, { dataSources }) => {
      return await dataSources.itemAPI.getItems(args);
    },
  },
  Mutation: {
    // login: async () => await {msg: 'yes, it is login'},
    signIn: async (_, args, { dataSources }) => await dataSources.userAPI.signIn({args}),
    signUp: async (_, args, { dataSources }) => await dataSources.userAPI.signUp({args}),
  }
}