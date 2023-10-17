## Features: Login & Register

### Client Input Handling

The client handles user inputs in the following manner:

1. **Field Validation**: The client validates if all required fields are filled out by the user. If not, it does not send the request to the server and displays an error message.

2. **Server Error Handling**: If the server responds with an error, the client displays an error message to the user.

### Server Input Handling

Upon receiving input from the client, the server performs the following checks:

1. **Null or Missing Values**: If a value is null or missing, the server returns an error.

2. **Invalid Values**: If a value is invalid, the server returns an error.

### User Authentication

### Login Process

The server handles user login as follows:

1. Checks if the provided email exists.
2. Verifies if the provided password is correct.
3. Confirms if the account exists.
4. If all checks pass, it returns account data to the client.

### Registration Process

The server handles user registration as follows:

1. Checks if the provided email already exists. If it does, returns an error.
2. Checks if the provided username already exists. If it does, returns an error.
3. If all checks pass, it creates a new account and returns account data to the client.

## Designs

<img src="../images/USER_REGISTRATION_PROFILES_IMAGE_01.png" alt="alt text" width="350"/>
<img src="../images/USER_REGISTRATION_PROFILES_IMAGE_02.png" alt="alt text" width="350"/>
<img src="../images/USER_REGISTRATION_PROFILES_IMAGE_06.png" alt="alt text" width="350"/>
<img src="../images/USER_REGISTRATION_PROFILES_IMAGE_07.png" alt="alt text" width="350"/>

## Research & Development

I conducted tests to optimize user registration and profile handling. The primary factors considered were latency and performance. A significant improvement was observed by simply moving the `GetAccount` query under the input validation check. This change resulted in:

1. A **50% decrease in latency**.
2. An **increase in stability**.

The reason for this improvement is that if an input value is invalid, the server avoids querying the database unnecessarily.

## Implementation

The implementation process was straightforward and involved the following steps:

1. **Database Package**: Added functions such as `GetAccountByKey` and `GetAllAccounts`.

2. **Features Package**: Utilized the `database` functions to create a library for handling accounts. This library includes functions like `LoginAccount`, `CreateAccount`, `UpdateAccount`, and more.

3. **API Package**: Integrated this library to handle client requests.

This approach made the implementation process easy and efficient.
