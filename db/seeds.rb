# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
User.create!(
  email: 'admin@example.com', 
  password: 'password', 
  password_confirmation: 'password'
)
    
testing = Tag.create!(name: "testing")
Post.create(
  title: "hello world", 
  content: "During the past couple weeks I have been participating in Code Newbie's Cohort One 'Get a Job' challenge. One of the assignments was to document a handful of job descriptions from companies you were interested in and synthesize that data in order to know what kind of jobs are a reach, on target, or a safety as well as document what desirable skills you may want to add for your career development.
  
One of the areas I need to work on most came from a job description: 'excellent communication skills as demonstrated via past collaborative experience, writings, video, etc..'. I feel I can be a good communicator in person (especially nowadays), but have a historical lack of documentation of this ability.

So it seems the time to start writing and documenting consistently. I wanted to take this opportunity to redo my so-called portfolio site to reflect this and reflect my increasing interest in Frontend Developement. This web page being a Rails API backend and React frontend to more accurately repesent the kind of work I am interested in.",
  tag: testing
)
