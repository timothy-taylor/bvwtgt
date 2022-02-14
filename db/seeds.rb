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
  title: "test title", 
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a feugiat nibh, vitae congue augue. Donec at fermentum purus, accumsan mattis quam. Aliquam erat volutpat. Sed eget ullamcorper enim, quis malesuada nisi. Aenean venenatis magna et sapien pharetra, a aliquam ex finibus. Sed at aliquam neque. Praesent vel fringilla ex. Proin eget placerat ante. Nam lobortis, ligula vel varius eleifend, lectus odio malesuada diam, ac blandit nisl nisl et nisi. Aliquam convallis arcu aliquet tortor dapibus tempus. Integer rhoncus facilisis fringilla. Cras eros ligula, blandit in felis in, finibus tempus lorem. Ut ac faucibus magna. Etiam imperdiet, orci eu porttitor lacinia, velit eros porttitor nunc, mollis malesuada lacus nunc vitae urna.

Donec nisl neque, luctus nec aliquam vitae, sagittis quis tortor. Nulla facilisi. Nam facilisis libero a porttitor accumsan. Sed convallis id justo vel efficitur. Morbi iaculis ornare eros, non blandit eros cursus sed. Morbi scelerisque condimentum purus ut accumsan. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a est vitae nibh blandit venenatis. Mauris a commodo risus.", 
  tag: testing
)
