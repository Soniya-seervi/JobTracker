## JobTracker

The application where user can register/ login and then he/she can create job applications and keep track of them. 

The other user should not be able to see one user's data. So, this restriction can be done using tokens(JWT). Every time, the user registers or logs in, we will send back this token and then once we send back the token, with every future request, we will be sending back this token to the server where we will be validating it(token). The library we use for this is - jsonwebtoken


## Error handling - 

We have the error folder which has the custom-api js file, which is the parent class for the other error classes - i.e. - bad-request and not-found.
The bad-request and not-found extend the custom-api class to show the respective errors
The index.js file is a common file which helps in exporting all the files from a single place, this making the code more readable and arranged.


## Hashing passwords - 
Hashing the password is a one way street i.e. Once the passwords are hashed, it can't be unhashed. We save the hash value to the database and 
next when a user enters password for login, we just compare the hash values.

Here, I have used bcryptjs library.

## Register User Frontend
We set up the controller at server and then handle it at front end.

-> When the user enters the details required, on clicking the submit button, the alert shows that the user created successfully and redirects to the dashboard page. If there is any error, then the danger alert is shown on the form. 
-> While the user creating request is send, the submit button gets disabled to prevent the user from sending request again and again.
-> When the user is registered, the user data, token and location is stored in the local storage as the data in the components is removed on refreshing the page.

## Login User Server
-> Morgan package - to log HTTP requests and errors, and simplify the process.
-> Check if email and password are provided by the user
-> Check if user exits by checking the email and finding the match
-> Check if password is correct by comparing the passwords.