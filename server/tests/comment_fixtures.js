const commenterRawData = {
  testUser1: {
    id: 1,
    username: 'test1',
  },
  testUser2: {
    id: 2,
    username: 'test2',
  },
  testUser3: {
    id: 3,
    username: 'test3',
  },
  testUser4: {
    id: 4,
    username: 'test4',
  },
  testUser5: {
    id: 5,
    username: 'test5',
  }
};
exports.commenterRawData = commenterRawData;
const voteSeedData = [];
const postId1Comments = [];
const postId2Comments = [];
const fakeComments = [
  'Voluptates minus dicta ut ipsam omnis cumque nesciunt eveniet accusantium.',
  'At dolorem non delectus reprehenderit mollitia.',
  'Molestiae esse quas est.',
  'Quas voluptatem et sit aut molestiae et.Veniam culpa inventore molestiae natus.',
  'Deleniti laboriosam odit maiores tempora corporis in corrupti atque.Dignissimos adipisci sed qui.',
  'empora corporis in corrupti atque.Dignissimos adipisci sed qui omnis id autem.',
  'Quia ad quidem porro cum et.Voluptatem quaerat dolorum officia.',
  'Amet harum vel pariatur in velit eius aliquid et eaque.',
  'Culpa ut quia autem asperiores ut in consequatur.',
  'Odit magni commodi magni quod.Incidunt expedita magnam illo quia qui ut.'
]
for(var i = 1; i <5; i++) {
  postId1Comments.push({
    id:i,
    parentPostId: 1,
    commenterId: commenterRawData.testUser1.id,
    text: fakeComments[i-1],
    upvotes:0,
    downvotes: 0
  });
}
for(i = 5; i <7; i++) {
  postId2Comments.push({
    id:i,
    parentPostId: 2,
    commenterId: commenterRawData.testUser2.id,
    text: fakeComments[i-1],
    upvotes: 0,
    downvotes: 0
  });
}
postId1Comments.push({
  id:7,
  parentPostId: 1,
  commenterId: commenterRawData.testUser3.id,
  text: fakeComments[6],
  upvotes: 3,
  downvotes: 0
});
voteSeedData.push({
  parentPostId:1,
  parentCommentId : 7,
  upvote: true,
  voterId: commenterRawData.testUser1.id,
});
voteSeedData.push({
parentPostId:1,
  parentCommentId : 7,
  upvote: true,
  voterId: commenterRawData.testUser2.id,
});
voteSeedData.push({
  parentCommentId : 7,
  parentPostId:1,
  upvote: true,
  voterId: commenterRawData.testUser4.id,
});

postId1Comments.push({
  id:8,
  parentPostId: 1,
  commenterId: commenterRawData.testUser4.id,
  text: fakeComments[7],
  upvotes: 0,
  downvotes: 3
});
voteSeedData.push({
  parentCommentId : 8,
  parentPostId:1,
  upvote: false,
  voterId: commenterRawData.testUser1.id,
});
voteSeedData.push({
  parentCommentId : 8,
  parentPostId:1,
  upvote: false,
  voterId: commenterRawData.testUser2.id,
});
voteSeedData.push({
  parentCommentId : 8,
  parentPostId:1,
  upvote: false,
  voterId: commenterRawData.testUser3.id,
});

postId2Comments.push({
  id:9,
  parentPostId: 2,
  commenterId: commenterRawData.testUser2.id,
  text: fakeComments[8],
  upvotes: 2,
  downvotes: 1
});
voteSeedData.push({
  parentCommentId : 9,
  parentPostId:2,
  upvote: true,
  voterId: commenterRawData.testUser1.id,
});
voteSeedData.push({
  parentCommentId : 9,
  parentPostId:2,
  upvote: true,
  voterId: commenterRawData.testUser4.id,
});
voteSeedData.push({
  parentCommentId : 9,
  parentPostId:2,
  upvote: false,
  voterId: commenterRawData.testUser3.id,
});

postId2Comments.push({
  id:10,
  parentPostId: 2,
  commenterId: commenterRawData.testUser2.id,
  text: fakeComments[9],
  upvotes: 1,
  downvotes: 1
});
voteSeedData.push({
  parentCommentId : 10,
  parentPostId:2,
  upvote: true,
  voterId: commenterRawData.testUser4.id,
});
voteSeedData.push({
  parentCommentId : 10,
  parentPostId:2,
  upvote: false,
  voterId: commenterRawData.testUser3.id,
});
exports.seededPost1Comments = postId1Comments;
exports.seededPost2Comments = postId2Comments;
exports.commentSeedData = [
  ...postId1Comments,
  ...postId2Comments,
];

exports.voteSeedData = voteSeedData;


