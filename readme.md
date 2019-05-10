Local Library Website:
- Used by Library staff to:
  * store information about books
  * store information about borrowers
- Used by Library members to:
  * browse and search for books
  * find out if any copies are available
  * reserve or borrow books

DB Design:
- Need to store information about books(title, summary, author, genre, ISBN)
- Multiple copies can be available (with globally unique ids, availability statuses, etc.)
- Information about the author
- Multiple authors can be available with same or similar names
- Should be able to sort information based on the book title, author, genre, and category.

While designing objects(a group of related information) - each object needs to have a separate model.
We can have three objects in this case :
1) Books
2) Book instances((status of specific physical copies of the book available in the system))
3) Authors

We use models to represent selection-list options. e.g- Drop-down list of choices
Since we do not know all the options up-front and they might change
Here we choose book-genre(e.g. Science Fiction, French Poetry, etc.) for the model - the values of this model can be created dynamically.
We will not to have a model for the BookInstance:status — we will hard code the acceptable values because we don't expect these to change.






--------------------

Mini challenge:
Create a new route in /routes/users.js that will display the text "You're so cool" at URL /users/cool/. Test it by running the server and visiting http://localhost:3000/users/cool/

Steps:
1) Here the aim is to create a route (/users/cool)
2) So in users.js file replace the first parameter from '/' to '/cool'
 3) Visit http://localhost:3000/users/cool/ and test the result.

--------------------




