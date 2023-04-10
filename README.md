Here I am going to add all about he project


## Error handling - 

We have the error folder which has the custom-api js file, which is the parent class for the other error classes - i.e. - bad-request and not-found.
The bad-request and not-found extend the custom-api class to show the respective errors
The index.js file is a common file which helps in exporting all the files from a single place, this making the code more readable and arranged.


## Hashing passwords - 
Hashing the password is a one way street i.e. Once the passwords are hashed, it can't be unhashed. We save the hash value to the database and 
next when a user enters password for login, we just compare the hash values.

Here, I have used bcryptjs library.