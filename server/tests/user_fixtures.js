const bcrypt = require('bcrypt');
const saltRounds = 10;
passwordUser1 = "testpass1";
passwordUser2 = "testpass2";
passwordUser3 = "testpass3";
passwordUser4 = "testpass4";
passwordUser5 = 'testpass5';
let hashPass1 = bcrypt.hashSync(passwordUser1, saltRounds);
let hashPass2 = bcrypt.hashSync(passwordUser2, saltRounds);
let hashPass3 = bcrypt.hashSync(passwordUser3, saltRounds);
let hashPass4 = bcrypt.hashSync(passwordUser4, saltRounds);
let hashPass5 = bcrypt.hashSync(passwordUser5, saltRounds);
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
