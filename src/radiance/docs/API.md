# API Management

This document explains how to use interfaces for the API routes in TypeScript. Interfaces are a way of defining the types of the output data for each API route. This helps to ensure consistency and avoid errors when making requests or handling responses. It also makes the code more readable and maintainable by providing a clear overview of the API structure and functionality.

### Example of Interfaces for the API Routes

The following code snippet shows an example of how to use interfaces for the API routes. We define a type called PostEvents that maps each route to a function that returns the expected output data type. For example, the /account/login route takes no input and returns an Account object, while the /account/delete route takes no input and returns nothing.

```TS
type PostEvents = {
  '/account/login': () => Account;
  '/account/create': () => Account;
  '/account/delete': () => null;
};
```

### BaseResponse Interface

We also define a type called BaseResponse that standardizes the format of the server response for all API routes. It has two properties: success and error. The success property indicates whether the request was successful or not, and the error property contains the error message if the request failed.

```TS
type BaseResponse = {
  success: boolean;
  error: string;
};
```

### Post Method

The following code snippet shows how we use the Post method to make requests to the server and how we handle the responses. We use the generic type parameter T to specify which route we are calling and what type of data we expect to receive. We also pass in the authorization and body parameters to customize the request headers and body. We then use the fetch API to send the request and parse the response as JSON. We extract the server and data properties from the JSON object and return them as an object. If there is no server property, we assume something went wrong and set the success to false and error to ‘Server response is null’. If there is any other error, we catch it and return a generic error message.

```TS
private async Post<T extends keyof PostEvents>(
  event: T,
  authorization: boolean,
  body: any,
): Promise<{ server: BaseResponse; data: ReturnType<PostEvents[T]> | null }> {
  try {
    const response = await fetch(`${this.serverUrl}${event}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: `${storage.getToken()}` } : {}),
      },
      body: JSON.stringify(body || {}),
    });
    const json = await response.json();
    const server = json.server;
    const data = json.data;
    if (!server) {
      server.success = false;
      server.error = 'Server response is null';
    }
    return { server, data };
  } catch (e) {
    return { server: { success: false, error: 'Something went wrong, try again later.' }, data:null };
  }
}
```

### LoginAccount Function

The following code snippet shows an example of how to use the Post method in our functions. The LoginAccount function is used to login to an account with a username and password. It calls the Post function with the /account/login route, no authorization header, and the data object as the body. It returns a promise that resolves to an object with the server and data properties. The server property contains the success and error information, and the data property contains the account object or null if the login failed. If the login was successful, it also updates the profile object with the account data.

```TS
public async LoginAccount(data: { username: string; password: string }): Promise<{
  server: BaseResponse;
  data: ReturnType<PostEvents['/account/login']> | null;
}> {
  const account = await this.Post('/account/login', false, data);
  if (account.data) {
    this.profile = {
      ...account.data,
    };
  }
  return account;
}
```

### Uses

All of this is being used in Engine.ts [View Here](../src/libs//engine.ts)

# An Example of How the API Works on the Server

## Login API

This API allows users to log in to the app with their account credentials. It uses the HTTP POST method and accepts JSON data as input. The API endpoint is `/account/login`.

### Request

The request body should contain the following fields:

- `username`: The username of the user.
- `password`: The password of the user.
  The request header should specify the content type as `application/json`.

Here is an example of a curl command that sends a request to the API:

```bash
curl \
-X POST http://localhost:4000/api/v1/account/login \
-H "Content-Type: application/json" \
-d "{\"username\":\"test\",\"password\":\"test\"}"
```

### Response

The response body will contain the following fields:

- `server`: An object that contains information about the server status.

  - `success`: A boolean that indicates whether the request was successful or not.
  - `error`: A string that contains the error message if the request failed.

- `data`: An object that contains information about the user account if the request was successful.
  The response header will specify the content type as `application/json`.

Here is an example of a response body that returns a user account:

```json
{
  "server": {
    "success": true,
    "error": null
  },
  "data": {
    "id": 1,
    "username": "test",
    "email": "test@test.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjMzNjg4MjUwfQ.7xZ4y8Zs2k9yf3V8w6Lw2q7a5u7vYxLw8t3nFqoT1O4"
  }
}
```

### Function

The function that handles the API request is account.Login. It takes a parameter c of type `*gin.Context`. This parameter contains information about the HTTP request and response.
The function performs the following steps:

- It declares a variable `data` of type `types.LoginAccountData`. This type is a struct that defines the fields of the request body.
- It calls the method `c.ShouldBindJSON(&data)` to parse and validate the JSON data from the request body and assign it to the variable `data`. If there is an error, it returns a response with status code 400 and an error message.
- It calls the method `a.Features.Account.Login(data)` to authenticate the user credentials and return a user account. The variable `a` is an instance of type `account`, which is a struct that contains a field `Features` of type `features.Features`. This type is an interface that defines methods for different features of the app, such as account, profile, etc. The method `Login` takes a parameter `data` of type `types.LoginAccountData` and returns two values: a user account of type `types.AccountData` and an error. If there is an error, it returns a response with status code 400 and an error message.
- It returns a response with status code 200 and a user account.
  Here is the code of the function:

Here is the code of the function:

```go
func (a *account) Login(c *gin.Context) {
	var data types.LoginAccountData

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	account, err := a.Features.Account.Login(data)
	if err != nil {
		c.JSON(400, gin.H{
			"server": gin.H{
				"success": false,
				"error": err.Error(),
			},
			"data": nil,
		})
		return
	}

	c.JSON(200, gin.H{
    "server": gin.H{
      "success": true,
      "error": nil,
    },
    "data": account,
	})
}
```

## Profile API

This API allows users to get their profile information from the app. It uses the HTTP GET method and requires authorization. The API endpoint is `/account/profile`.

### Request

The request header should contain the following fields:

- `Content-Type`: The type of the content being sent. It should be `application/json`.
- `Authorization`: The token of the user.
  Here is an example of a curl command that sends a request to the API:

```bash
curl \
-X GET http://localhost:4000/api/v1/account/profile \
-H "Content-Type: application/json" \
-H "Authorization: token"
```

### Response

The response body will contain the following fields:

- `server`: An object that contains information about the server status.
  - `success`: A boolean value that indicates whether the request was successful or not.
  - `error`: A string value that contains the error message if the request failed.
- `data`: An object that contains information about the user profile if the request was successful.
  The response header will specify the content type as `application/json`.

Here is an example of a response body that returns a user profile:

```json
{
  "server": {
    "success": true,
    "error": null
  },
  "data": {
    "id": 1,
    "email": "test@test.com",
    "username": "test",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "biography": "Hello, I am a test user.",
    "createdAt": "2023-10-08T09:57:50.000Z",
    "updatedAt": "2023-10-08T09:57:50.000Z"
  }
}
```

### Function

The function that handles the API request is `account.Profile`. It takes a parameter `c` of type `*gin.Context`. This parameter contains information about the HTTP request and response.

The function performs the following steps:

- It calls the method `c.MustGet(types.AccountCtx).(*types.Account)` to get the user account from the context. This account was set by the middleware function `UseAuthorization` before calling this function.
- It declares a variable `filteredAccount` of type `*types.Profile`. This type is a struct that defines the fields of the response body.
- It assigns the values from the user account to the corresponding fields of the filtered account. It does not include any sensitive information, such as password or token, in the filtered account.
- It returns a response with status code 200 and the filtered account.
  Here is the code of the function:

```go
func (a *account) Profile(c *gin.Context) {
	account := c.MustGet(types.AccountCtx).(*types.Account)

	filteredAccount := &types.Profile{
		ID: account.ID,
		Email: account.Email,
		Username: account.Username,
		Role: account.Role,
		Avatar: account.Avatar,
		Biography: account.Biography,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
	}

	c.JSON(200, gin.H{
		"server": gin.H{
			"success": true,
			"error": nil,
		},
		"data": filteredAccount,
	})
}
```

### Middleware

The middleware function that protects the API endpoint is `UseAuthorization`. It takes three parameters:

- `cfg`: A pointer to a struct of type `Config`. This struct contains configuration settings for the app, such as database connection, features, etc.
- `handler`: A function of type `gin.HandlerFunc`. This function is the actual handler for the API endpoint, such as `account.Profile`.
- `role`: A pointer to a string. This string specifies the required role for accessing the API endpoint. If it is nil, then any role can access it.

The middleware function performs the following steps:

- It returns a function of type `gin.HandlerFunc` that takes a parameter `c` of type `*gin.Context`.
- It calls the method `c.GetHeader("Authorization")` to get the token from the request header.
- It calls the function `database.GetAccountByToken(token)` to get the user account from the database by using the token. If there is an error, it returns a response with status code 400 and an error message and aborts further processing.
- It calls the method `cfg.Features.Account.ValidateToken(*account)` to validate the token of the user account. If there is an error or if the token is invalid, it returns a response with status code 400 and an error message and aborts further processing.
- If role is not nil, it calls the method `cfg.Features.Account.HasAccess(*account, *role)` to check if the user account has the required role for accessing the API endpoint. If there is an error or if the user account does not have the required role, it returns a response with status code 400 and an error message and aborts further processing.
- It calls the method `c.Set(types.AccountCtx, account)` to set the user account in the context for later use by the handler function.
- It calls the handler function with the parameter `c`.
  Here is the code of the middleware function:

```go
func UseAuthorization(cfg *Config, handler gin.HandlerFunc, role *string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")

		account, err := database.GetAccountByToken(token)
		if err != nil {
			c.JSON(400, gin.H{
				"server": gin.H{
					"success": false,
					"error": err.Error(),
				},
				"data": nil,
			})

			c.Abort()
			return
		}

		valid, err := cfg.Features.Account.ValidateToken(*account)
		if err != nil && !valid {
			c.JSON(400, gin.H{
				"server": gin.H{
					"success": false,
					"error": err.Error(),
				},
				"data": nil,
			})

			c.Abort()
			return
		}

		if role != nil {
			authorized, err := cfg.Features.Account.HasAccess(*account, *role)
			if err != nil && !authorized {
				c.JSON(400, gin.H{
					"server": gin.H{
						"success": false,
						"error": err.Error(),
					},
					"data": nil,
				})

				c.Abort()
				return
			}
		}

		c.Set(types.AccountCtx, account)
		handler(c)
	}
}
```
