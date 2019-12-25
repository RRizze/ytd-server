import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    attackTypes: [AttackType]
    rarities: [Rarity]
    elements: [Element]
    creeps: [Creep]
    creepSizes: [CreepSize]
    towers(
      pageSize: Int,
      after: Int,
      rarity: [RarityField],
      attackType: [AttackTypeFiled],
      element: [ElementField],
      notRarity: [RarityField],
      notAttackType: [AttackTypeFiled],
      notElement: [ElementField],
      damage: [Int],
      attackCd: [Float],
      rangeTower: [Int],
      goldcost: [Int],
      waveLvlUp: [Int],
      elementLvlUp: [Int],
    ): TowerConnection!
    items(
      pageSize: Int,
      after: Int,
      rarity: [RarityField],
      notRarity: [RarityField],
      goldcost: [Int],
      waveLvlDrop: [Int]
    ): ItemConnection!
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!): User
    signIn(username: String!, password: String!): User
  }

  type User {
    id: Int!
    username: String!
    email: String
  }

  type TowerConnection {
    cursor: Int
    hasMore: Boolean
    towers: [Tower]!
  }

  type ItemConnection {
    cursor: Int
    hasMore: Boolean
    items: [Item]!
  }

  type AttackType {
    attack_type_id: ID
    attack_type_name: String
  }

  type Element {
    element_id: ID
    element_name: String
    element_description: String
  }

  type Rarity {
    rarity_id: ID
    rarity_name: String
  }

  type Creep {
    creep_id: ID
    creep_name: String
  }

  type CreepSize {
    creep_size_id: ID
    creep_size_name: String
    creep_size_description: String
  }

  type Tower {
    tower_id: ID!
    tower_name: String
    goldcost: Int
    icon: String
    wave_lvl_up: Int
    element_lvl_up: Int
    range_tower: Int
    min_damage: Int
    max_damage: Int
    attack_cd: Float
    tower_description: String
    rarity_name: String
    element_name: String
    attack_type_name: String
    specials: String
    abilities: [Ability]
  }

  type Item {
    item_id: ID!
    item_name: String
    icon: String
    goldcost: Int
    wave_lvl_drop: Int
    rarity_name: String
    item_description: String
    specials: String
    abilities: [Ability]
  }

  type Ability {
    ability_id: ID
    ability_name: String
    ability_description: String
    lvl_bonus: String
    ability_active: String
  }

  enum RarityField {
    COMMON
    UNCOMMON
    RARE
    UNIQUE
  }

  enum AttackTypeFiled {
    DECAY
    ELEMENTAL
    ENERGY
    ESSENCE
    PHYSICAL
    MAGIC
  }

  enum ElementField {
    FIRE
    ICE
    NATURE
    DARKNESS
    STORM
    IRON
    ASTRAL
  }

  enum CreepField {
    MAGICAL
    HUMANOID
    UNDEAD
    ORC
    NATURE
  }

  enum CreepSizeField {
    MASS
    NORMAL
    CHAMPION
    BOSS
    AIR
  }
`;
