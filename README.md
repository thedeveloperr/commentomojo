### Live deployed:
* ~~https://commentomojo.ml~~
  
### Features
* Login: Secured hashed passowrd in db using bcrypt
* See comments without login
* Login to post comment
* Login to upvote/downvote on comments posted by other but not on their own.
* Can get to add only one upvote or downvote on a particular comment. To change vote one can remove previous vote and click on other type of vote.
* Can remove their own upvotes/downvotes.
* Logged in user can view their own votes highlighted.
* Logout
* Responsive

### Tech used
* express.js
* passport.js for authentication (server side sessions and cookies used)
* bcrypt for hashing
* realtional database : sqlite (Used objections.js (knex.js based) which can connect to MySql, Postgres etc. too)
* react.js + redux + semantic-ui for frontend UI

## Development Instructions:
What ypu need before: Node 10+ LTS, npm, yarn, linux/mac needed
### Setup
Clone this repo on your machine then follow the below instructions:
* server backend
  * Follow these steps
    *  Go to server folder using: ```cd server``` 
    *  Run tests in server folder using: ```npm install```
  
* Frontend react app: You will need yarn package manager so install it before: https://yarnpkg.com/en/docs/install
npm will also work fine but this react.js app's boilerplate was created using create-react-app utility which uses and recommend yarn so I stuck with it for frontend.
  * Follow these steps
    *  Go to server folder using: ```cd comment_spa``` 
    *  Run tests in server folder using: ```yarn install```

### Tests
Backend is tested a lot. Most of code and edge cases have been covered. Simple Non complex Code paths tests remain.

* Unit tests
  * Follow these steps
    *  Go to server folder using: ```cd server``` 
    *  Run tests in server folder using: ```npm run test_unit```
  
* Integration tests
  * Follow these steps
    *  Go to server folder using: ```cd server``` 
    *  Run tests in server folder using: ```npm run test_integration```
  
All tests will pass

### Running
Run server first.
* server backend
  * Follow these steps
    *  Go to server folder using: ```cd server``` 
    *  Run tdev backend server: ```npm run dev_server```
  
* Frontend react app: You will need yarn package manager so install it before: https://yarnpkg.com/en/docs/install
npm will also work fine but this react.js app's boilerplate was created using create-react-app utility which uses and recommend yarn so I stuck with it for frontend.
  * Follow these steps
    *  Go to server folder using: ```cd comment_spa``` 
    *  Serve react app using: ```yarn start```

NOTE: During development the network requests or CORS issue due to different localhost ports of frontend and backend is solved using proxy feature (see `package.json` of comment_spa) provided by create-react-app.

### Test credentials
Login using any of these combination. Case sensitive.
* Test user 1
  * username: test1
  * password: testpass1
  
* Test user 2
  * username: test2
  * password: testpass2
  
* Test user 3
  * username: test3
  * password: testpass3

* Test user 4
  * username: test4
  * password: testpass4

### DB relation ships
https://drive.google.com/file/d/13jrPBvkZjIM0Cp0h86ZrttExFeImjwI1/view?usp=sharing
Note: As a user can only vote once on a comment the Vote table must contain only one vote for a particular (comment id,user id) pair so it's defined as Composite Primary Key.

### Folder overview
* `server/` backend code
  * `models/` contain model classes and methods that access database. Objections.js library used for models
  * `controllers/` contain controller methods that take requests and call services and set response
  * `services/` Business logic separated as services in service folder so that controller are thin. services call models and their methods for DB access. 
  * `tests/` Test files. Contain unit tests, integration tests and test data fixtures.
  * `seed/` Have files needed to seed data in database by knex.
  * `migration/` DB schema files defined and used by knex 
  * `knexfile.js` connection configs for database.
  * `db/config.js` return instance of knex db connection. Needed to connect to database.
  * `app.js` express.js main app.js file
  * `index.js` files that make app start listening to port 4000.
  * `validators/` files validate incoming request before hitting to controller
  * `middlewares/` Authentication middleware files in this folder. Uses passport.js
  * `errors/` Custom errors.
  * `package.json` Contains dependencies
  * `package-lock.json` Contain stable locked version of dependencies 
  * `routes/` contain express router defined url routes files. Define which controller will handle request coming to a path or route.
* `comment_spa` frontend code
  * `src/` main src all work is done here
    * `components/` folder contains all UI components.
    * `redux/` All data, API calls and app state related stuff in files under this folder
      * `actions.js` For making API calls and other UI actions.
      * `state.js` Intial state of app is defined here
      * `reducers.js` Catches actions and payload and modify and return new data state for components. UI changes based on state change produced by reducers.
      * `configureStore.js` Used for initialising store and applying middlewares like redux-thunks used for API Calls.
  * `build/` contains prod builds when `yarn build` command is run
