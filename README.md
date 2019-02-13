# TravelLog

## Description

Keep track of all your trips with our app. It will crunch all the stats of your travels. Which countries have you been to? Or, how many countries left to visit in Asia? Or, have you been in more countries that your nomad friend?

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 

- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

- **homepage** - Landing page for the project. Logged user has access to travelLog and profile. New user can sign in or log in.

- **sign up** - As a user I want to see a sign up form to sign up.

- **login** - As a new user I want to be able to log in to the application. 

- **logout** - As a user, I want to be able to log out from the application. 

- **travel log** - As a user I want to see all the countries I have visited and see travel stats. 

- **add trips to travel log** - As a user I will be able to add countries to my travel log.

- **delete trips to travel log** - As a user I will be able to remove countries directly from my list.

- **see profile** - As a user I will be able to see profile.

- **edit profile** - As a user I will be able to edit profile.

- **delete profile** - As a user I will be able to delete profile.

## Backlog

List of other features outside of the MVPs scope

Auth:
- Sign up page: pick home country from list
- Same view for log in and sign in
- Log in with Instragram (OAuth)

TravelLog:
- Pick new visited from list
- Add more stats (groups of countries)
- Change interface to a passport

API:
- Countries Api connection
- Map in Travellog with pins showing visited places
- Sign in with your Instagram account
- Share to Instagram places I have been
- Display images from instagram
- Webcam of places visited

Profile/Social:
- Badges to show accomplishments
- Compare with others users

Error:
- Funny quotes, facts, image in 404 and 500 pages

## ROUTES:


|  Routes | HTTP Method | Description  | Variables |
|---|---|---|---|
| /  | GET  | - renders the homepage ||
| /auth/signup  | GET  |  - redirects to /travellog if user logged in <br> - renders the signup form (with flash msg) if  user not logged in ||
| /auth/signup  | POST  |  - check all fields not empty, check if user exists (front and back end checks), create new user <br>  - redirects to /travellog after user sign up | Body (username, password, homecountry)|
|/auth/login|GET|- redirects to /travellog if user logged in <br> - renders the login form (with flash msg)||
|/auth/login|POST|  - check all fields not empty, check if user exists (front and back end checks), check password bcrypt <br> - redirects to /travellog if user logged in|Body (username, password)|
|/auth/logout|GET|- remove a user from the session <br> - redirects to /||
|/travellog|GET|- renders travel stats, list of countries visited, plus create country button||
|/travellog/add|GET|- renders travel form with country field||
|/travellog |POST|- check in countries model if country exists (if not redirect to /travellog/add with flash message), add the id of country to the travelLog array of user |Body (country)|
|/profile|GET|- display editable username, password, homecountry and buttons to save or delete||
|/profile|POST| - find and Update Current User <br> - redirect to travelLog |Body (username, password, homecountry) <br> req.session.currentUser.id|
|/profile/delete|POST|- delete user account <br> - redirect to / |req.session.currentUser.id|



## Models

User model
```
{
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  homeCountry: { type: String },
  isCreatedFromInstagram: { type: Boolean, default: false },
  profilePicture: { type: String },
}
```

Country model
```
{
  name: { type: String, required: true, unique: true },
  capital: { type: String },
  region: { type: String },
  subregion: { type: String },
  population: { type: String },
  location: {
    type: {
      type: String,
    },
    coordinates: [Number],
  },
  area: { type: Number },
  languages: { type: Array },
  flag: { type: String },
  regionalBlocs: { type: Array },
}
``` 

Trip model
```
{
  name: { type: String },
  users: [{ type: ObjectId, ref: 'User' }],
  countries: [{
    country: { type: ObjectId, ref: 'Country' },
    dates: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
  }],
}
``` 

We design our database relationships so that trips would be the central piece of it. The main page each user accesses is the travel log which is a reference of all trips undertaken. Hypothetically, a trip can have few different users and can be composed of several countries. For version one though, we maintain a simple relation, one trip = one user = one country.

## Process

- Planing: writing this readme and designing the wireframes
![alt Wireframes](https://github.com/MR-Neto/TravelLog/blob/master/readmeAssets/wireframes.jpeg)

- First iteration of the app
![alt First Iteration](https://github.com/MR-Neto/TravelLog/blob/master/readmeAssets/first-iteration.jpg)

- MVP was created entirely in pair programming to give us the same base before spliting tasks on backlog features. Also, we decided to work in pair when dealing with complicated features like implementing Instagram authentication through it API. And again when performing Mongo queries to calculate our travel statistics. This turned out to be very beneficial to our project.


## Links

### Trello

https://trello.com/b/WFXytC9n/travellog

Our Kanban board:
![alt Kanban board](https://github.com/MR-Neto/TravelLog/blob/master/readmeAssets/kanban.jpeg)


### Git

The url to your repository and to your deployed project

https://github.com/MR-Neto/TravelLog

[Deploy Link](https://ironpassport.herokuapp.com/)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)

