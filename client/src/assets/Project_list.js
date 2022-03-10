export const list = [
  {
    name: "offworld",
    address: {
      github: "https://github.com/timothy-taylor/offworld",
      live: "https://timothy-taylor.github.io/offworld",
    },
    description:
      "A browser based granular synthesizer that manipulates audio using data from the background image",
    how: "Built using React, HTML5, TailwindCSS, and ToneJS. Simply deployed onto Github Pages using local storage to allow users to upload their own images and sounds.",
    feature:
      "The mouse is a powerful tool, and this instrument allows it shine as a controller. The 'zoom' box shows you exactly where your mouse is, signifying that the instrument is not just random, the user has control.",
  },
  {
    name: "bvwtgt.xyz",
    address: {
      github: "https://github.com/timothy-taylor/bvwtgt",
      live: "https://bvwtgt.xyz",
    },
    description: "My personal website supporting dynamic content management.",
    how: "Built using a React frontend and Ruby on Rails API backend connected to a Postgres database.  Admin authentication and the API allow me to create and edit content from the front end that is saved to the database. I used the jotai library to manage global state and found it very satisfying for small data apps.",
    feature:
      "While this site is simple, the tools used to make it (API + React) are powerful and indicitive of the work I like to do in modern web development. This website was part of a recent effort to begin to document my processes and knowledge in a more intentional and consistent way.",
  },
  {
    name: "constellations",
    address: {
      github: "https://github.com/timothy-taylor/constellations",
      community: "https://llllllll.co/t/constellations/52225",
    },
    description:
      "An interactive note sequencer built for the Monome Norns ecosystem.",
    how: "Scripted in Lua. I coded a quick and dirty version of this one afternoon. In the early stages I began to discussing it on the Lines forum, and, using the discussion and community requests refactored it into a surprisingly profound note sequencer with equal parts control and chaos. This kind of collaboration is exactly what I am looking forward to doing more of.",
    feature:
      "Despite not being browser-based, this projects shows my deep desire for fully understandable and interactive user interfaces; it is simple on the surface, but full of hidden gems. It is built so that the information and interaction that they require and describe may be easily gleaned and understood.",
  },
  {
    name: "tally",
    address: {
      github: "https://github.com/timothy-taylor/tally",
    },
    description: "A time tracking and logging tool for the command line.",
    how: "Built with Rust and Ruby. It uses the clap library for command line argument parsing. Ruby provides text manipulation for the logging functionality.",
    feature:
      "This Rust app that leans heavily on the Enum datatype, which, when pared with the match syntax, is probably my favorite feature of Rust. Using Rust and Ruby together actually makes a lot of sense to me conceptually and this has both of them playing in their sweetspots.",
  },
  {
    name: "pacebook",
    address: {
      github: "https://github.com/timothy-taylor/odin_pacebook_rails",
      live: "https://odin-pacebook-rails.herokuapp.com",
    },
    description: "A fullstack Ruby on Rails built Facebook clone built for runners.",
    how: "A fullstack Ruby on Rails monolyth hooked up to a Postgres database. It uses the devise gem for authentication, Postgres for its database, hosted on Heruko.",
    feature: "The data relationships in this app are fully operational -- friends, friend requests, posts, comments. Purposely kept the posts plain text and did not put in likes for ethical reasons. Part of the assignment, as part of The Odin Project, was to add OAuth support. As I am not a Facebook user, I decided to use Github as my OAuth counterpart. Due to the fact that you can sign up for a Github account without a username (if I recall the issue correctly), I had to tweak my user and authentication in order for Github to play nice with my authentication setup. Improving the user login and authentication (and probably removing the OAuth support) would be worth another pass at some point. Truthfully, this was the Ruby on Rails final project for The Odin Project and I was trying to get to minimum viable products as fast as possible.",
  },
  {
    name: "weather terminal",
    address: {
      github: "https://github.com/timothy-taylor/weather_terminal",
      live: "https://timothy-taylor.github.io/weather_terminal/",
    },
    description: "A vanilla JS weather app that mimics a terminal aesthetic.",
    how: "Built using webpack and deployed to Github Pages. Fetches from Open Weather Map.",
    feature: "I enjoy this little app way more than I should, but its kind of beautiful in its simplicity while delivering just the information one could want in a simple text format.",
  }
];
