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

Defining the Local Library Schema:
- Has separate module for each model. (eg. /models/author.js)

--------------------

Routes and controllers:

Brief:
- The code to present the information stored in the db to users
- First determine what information we want to be able to display in our pages
- Define appropriate URLs for returning those resources
- Then create the routes (URL Handlers) and views (templates) to display those pages.
- Controller functions to separate out the code to route requests from the code that actually processes the requests

Models are already defined, here we need to create:
1) Routes : To forward the supported requests (also any information encoded in request URLs) to appropriate controller functions
2) Controller functions: To get the requested data from the models, create an HTML page displaying that data and return it to the user to view in the browser
3) Views(templates) used by the controllers to render the data

Routes needed for this website:
1) catalog/ - The home/index page
2) catalog/<object> - The list of all books, bookinstances, genres and authors (e.g /catalogs/books/, /catalogs/genres/)
3) catalog/<object>/<id> - The detail page for a specific book, bookinstance, genre or author with the given _id (eg /catalog/book/1234)
4) catalog/<object>/create - The form to create a new book, bookinstance, genre or author (eg /catalog/book/create)
5) catalog/<object>/<id>/update - The form to update a specific book, bookinstance, genre or author with the given _id field value (eg /catalog/book/1234/update)
6) catalog/<object>/<id>/delete - The form to update a specific book, bookinstance, genre or author with the given _id field value (eg /catalog/book/1234/delete)

--------------------

Displaying library data:

Gist:
- Display the library books and other data
- Homepage : shows how many records we have of each model type
- List page
- Detail page

Library website base template:

- Will have a sidebar with links for the different pages
- Main content area that we'll override in each of our individual pages

Individual Pages:

- Home page:
  * Accessible from either the site('/') or catalog('/catalog') root.
  * Displays some static text describing the site along with dynamically calculated "counts" of different record types in the database

   Dynamically calculating the "counts":
   * The controller function (/controllers/book-controller.js) fetches the information about how many
        - book
        - bookInstance
        - available 'bookInstance'
        - author
        - genre
    records we have in the database.
    * It needs to render this data in a template to create in HTML page
    * It needs to return this in an HTTP response

    * countDocuments() method is used to get the number of instances of each model. This is called on a model.

List pages:

- Book-list page

- BookInstance-list page

- Author-list page

- Genre-list page

Detail pages:

- Genre-detail page
  * Displays the information of the particular genre instance using it's automatically generated _id field value as the identifier.
  * The page displays genre name, list of all books in the genre with links to each book's detail page
  * async.parallel() has been used to query the genre name and it's associated books in parallel, with the callback rendering the page when both requests complete successfully.
  * The id of the genre record is encoded at the end of the URL and extracted automatically based on the route definition (/genre/:id)
  * The id is accessed within the controller via the request parameters: req.params.id.
  * This id is used in genre.findById() to get the current genre.
  * It is also used to get all book objects that have the genre ID in their genre field : book.find({genre : req.params.id})

- Book-detail page
  * Displays information for a specific book identified using it's _id field value, along with information about each associated copy in the library(BookInstance)
  * Wherever we display the author, genre or book instance, these should be linked to the associated detail page for that item


- Author-detail page
  * Displays information about the specified author, identified using their _id field value, along with a list of all the book ojects associated with that author

- BookInstance-detail page
  * Needs to display information for each bookInstance, identified using it's _id field value.
  * This will include book name along with other information in the record.

_____________________

Forms:

Pattern in all create forms:
- First run validators
- Followed by sanitizers
- Check for errors
- Either re-render the form with error information or save the data

Delete forms:
- Only those objects that are not referenced by other objects are allowed to be deleted
- The form confirms that there are no associated books before the author is deleted
- If there are associated books then the form displays them and states that they must be deleted before the object is itself deleted

Update forms:
- Similar to creating a book
- Here the form is populated in the GET route with values from the database

_____________________

Mini challenge:
Create a new route in /routes/users.js that will display the text "You're so cool" at URL /users/cool/. Test it by running the server and visiting http://localhost:3000/users/cool/

Route: The route defines a callback that will be invoked whenever an HTTP GET request with the correct pattern is detected.

Steps:
1) Here the aim is to create a route (/users/cool)
2) So in users.js file replace the first parameter from '/' to '/cool'
 3) Visit http://localhost:3000/users/cool/ and test the result.

--------------------




