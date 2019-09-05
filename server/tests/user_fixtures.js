passwordUser1 = "testpass1";
passwordUser2 = "testpass2";
passwordUser3 = "testpass3";
passwordUser4 = "testpass4";
passwordUser5 = 'testpass5';

// bcrypt 10 saltrounds hashes
let hashPass1 = '$2b$10$k73rFRaVXlnnfQEAEyaCpuJuoxSSwlqf1kvkcXoYmJ0YrI1ZB1A.m';
let hashPass2 = '$2b$10$Jg5GbydT5TxWm7T1N3tToO3jK3MGru8M1fzNppMOclQ1ttAks2c4i';
let hashPass3 = '$2b$10$A76Ip6RC02M6lR.Of70kBOA7dc5OvPLum.9KSOfhv8nLSX8BuoTAi';
let hashPass4 = '$2b$10$XA/hbSpytdSU0HzT/FG.2OdBc9wl3iFTSLdzhxqHbugfn2agfrIfK';
let hashPass5 = '$2b$10$85dBNw9gttXcf4dOU0UkBu7LM5XBsINpuNIlyk4llEV0bAq42e206';
exports.seedData = [
        {id: 1, username: 'test1', password:hashPass1 },
        {id: 2, username: 'test2', password:hashPass2 },
        {id: 3, username: 'test3', password:hashPass3 },
        {id: 4, username: 'test4', password:hashPass4 },
];
exports.rawData = {
  testUser1: {
    id: 1,
    username: 'test1',
    password: passwordUser1,
    passwordHash: hashPass1
  },
testUser2: {
    id: 2,
    username: 'test2',
    password: passwordUser2,
    passwordHash: hashPass2
  },
testUser3: {
    id: 3,
    username: 'test3',
    password: passwordUser3,
    passwordHash: hashPass3
  },
testUser4: {
    id: 4,
    username: 'test4',
    password: passwordUser4,
    passwordHash: hashPass4
  },
testUser5: {
    id: 5,
    username: 'test5',
    password: passwordUser5,
    passwordHash: hashPass5
  }

};

const userIdToDataMap = {};
Object.keys(exports.rawData).forEach(function(key) {
    userIdToDataMap[exports.rawData[key].id] = {...exports.rawData[key]};
});
exports.userIdToDataMap = userIdToDataMap;
