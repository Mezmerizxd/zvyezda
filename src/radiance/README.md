# Documentation and Development Updates for Radiance

### Project Scope

- [User Registration and Profiles](./docs/USER_REGISTRATION_PROFILES.md)
- [Booking System](./docs/BOOKING_SYSTEM.md)
- [Messaging and Communication](./docs/MESSAGING_COMMUNICATION.md)
- [Payment Processing](./docs/PAYMENT_PROCESSING.md)
- [Service History and Reviews](./docs/SERVICE_HISTORY_REVIEWS.md)
- [Financial Management](./docs/FINANCIAL_MANAGEMENT.md)
- [Admin Panel](./docs/ADMIN_PANEL.md)

### How the App Works

<!-- - How the Project is Setup
  - The main app is called Zvyezda, it contains 4 more projects within it, `Engine`, `Radiance`, `Server`, `Web`.
  - `Engine` and `Server` are pretty much the same its just `Engine` is written in Go and `Server` is written in TypeScript.
  - `Radiance` and `Web` are the two different clients that are both written in TypeScript and React.
  - `Radiance` is the client for the cleaners website and `Web` is the client for my personal website.
  - `Radiance` and `Web` both use the same `Server` and `Engine` projects as their backends but `Radiance` only uses `Engine` as its more updated
- How the Server runs the Project
  - The Server is just a mini desktop computer that runs Ubuntu 20.04 LTS, It has 8GB of RAM and 4 CPU cores and 120GB of Storage.
  - The Server runs the project using `pm2` which is a process manager for Node.js applications.
  - `pm2` runs the project using `yarn start:prod` which runs the `start:prod` script in the `package.json` file.
  - The `start:prod` script runs the `migrate`, `build`, and `start` scripts in the `package.json` file.
  - The `migrate` script runs the `prisma migrate deploy` command which migrates the database.
  - The `build` script runs the `yarn build` command which builds the source files (`Engine`, `Radiance`, `Server`, `Web`).
  - The `start` script runs the `yarn start` command which starts the app.
- How the Server is Hooked up to the Domain
  - My home Router is configured to Port-Forward all traffic on port 80 to the Server's Local IP Address.
  - The Server is running a program called `nginx` which is a web server that handles all the traffic coming in on port 80.
  - `nginx` is configured to forward all traffic on port 80 to the `Server` project which is running on port 3000.
  - `Engine` runs on a different port, maybe port 4000 and so does `Radiance` as `Engine` also serves the `Radiance` client.
  - `nginx` is configured to host `Engine` on a subdomain called `engine.zvyezda.com` instead of `zvyezda.com` as that is for my personal website.
  - I use `NameCheap` to manage my domain and use their DNS servers to point `zvyezda.com` to my Server's Public IP Address so that nginx can handle the traffic allowing me to host my website and the app on the same server. -->

- The app is called Zvyezda, and it is a web application that helps cleaners find and manage their jobs.
- The app has four main parts: `Engine`, `Radiance`, `Server`, and `Web`.
  - `Engine` is the core of the app, it handles the logic and data of the app. It is written in Go, which is a programming language that is fast and reliable.
  - `Radiance` is the front-end of the app, it is what the cleaners see and interact with on their browsers. It is written in TypeScript and React, which are programming languages that are popular and easy to use for web development.
  - `Server` is another part of the app that connects `Engine` and `Radiance`. It is also written in TypeScript, but it runs on Node.js, which is a platform that allows JavaScript code to run on the server side.
  - `Web` is my personal website, where I showcase my skills and projects. It is also written in TypeScript and React, and it uses `Server` as its backend.
- The app runs on a small computer that I have at home, which has Ubuntu 20.04 LTS as its operating system. Ubuntu is a type of Linux, which is a free and open source operating system that is widely used by developers.
- The app uses a program called `pm2` to manage its processes. `pm2` makes sure that the app runs smoothly and restarts automatically if there are any errors or updates.
- The app also uses a program called `nginx` to handle the web traffic. `nginx` is a web server that redirects the requests from the internet to the app.
- The app has a domain name called `zvyezda.com`, which is what people type in their browsers to access the app. I use `NameCheap` to register and manage my domain name, and I use their DNS servers to point `zvyezda.com` to my computer’s IP address.

### Development Operations

1. When I want to make changes to the app, I create a new branch on GitHub, which is a platform that hosts and manages my code online.
2. I write and test my code on the new branch, making sure that it works as expected and does not break anything else.
3. When I am happy with my code, I merge the new branch into the `main` branch, which is the branch that contains the latest version of the app.
4. I run a script called `start_zvyezda.sh` on my computer, which updates and restarts the app using pm2.
5. The script does the following steps:

- It goes to the folder where the app code is stored (`zvyezda/`).
- It stops and deletes the app process if it exists (`pm2 stop yarn` and `pm2 delete yarn`).
- It pulls the latest code from GitHub (`git pull`).
- It installs any new dependencies that the app needs (`yarn install`).
- It starts the app using another script called `start:prod`, which does three things:
  - It updates the database schema using a tool called `prisma` (`prisma migrate deploy`).
  - It builds the source files into executable files using a tool called `yarn` (`yarn build`).
  - It starts the app using `yarn` again (`yarn start`).

```bash
# start_zvyezda.sh

# Navigate to the directory
cd zvyezda/

# Stop the app if it's running
pm2 stop yarn || true

# Delete the app if it exists
pm2 delete yarn || true

# Pull the latest changes from git
git pull

# Install any new dependencies
yarn install

# Start the app
pm2 start yarn --name "yarn" -- start:prod
```

### Client Development

[API Management](./docs/API.md)

### Descriptions / Mottos / About

#### Descriptions

- Radiance is your go-to solution for home cleaning management. It seamlessly connects you with professional house cleaners in your area, allowing you to schedule, manage, and pay for house cleaning services with ease. With Radiance, maintaining a clean and healthy home is just a few taps away.
- Radiance is your digital concierge for home cleaning services. With a few taps, you can schedule, manage, and pay for professional cleaning services tailored to your needs.
- Radiance is the ultimate home cleaning management app. It offers a hassle-free way to connect with local cleaning professionals and manage your home cleaning schedule.
- Radiance is revolutionizing home cleaning with its intuitive app that brings professional cleaning services right to your doorstep.
- Radiance is your personal assistant for maintaining a clean home. It connects you with top-notch cleaning professionals in your area and allows you to manage all your cleaning needs in one place.
- Radiance is the smart way to keep your home clean. Our app connects you with local professional cleaners and provides a seamless platform to manage and pay for their services.

#### Motto's

- "Radiance - Your Beacon of Cleanliness!"
- “Radiance - Sparkling Homes at Your Fingertips!”
- “Radiance - Your Home’s Best Friend!”
- “Radiance - Clean Homes, Clear Minds!”
- “Radiance - Simplifying Home Cleaning!”
- “Radiance - A Cleaner Home is Just a Tap Away!”

[Homepage](../../README.md)
