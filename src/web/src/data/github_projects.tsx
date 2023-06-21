import { FaGithub } from 'react-icons/fa';

const github_projects: Zvyezda.Client.Data.GithubProjects[] = [
  {
    project: 'social_app_v2',
    title: 'Social App V2',
    description:
      'This is a simple messaging application that allows you to chat with your friends. Features: Add Friend, Friend Requests, Edit Profile and a lot more. The stack, TypeScript/Express/React/Docker. I am very proud of this web application as its the first one that actually works and I am able to expand on it. There are many more things I would like to add to this project in the future.',
    image: 'https://github.com/Mezmerizxd/social-app-v2/blob/v0.6.9/screenshots/example_1.png?raw=true',
    links: [<FaGithub onClick={() => window.open('https://github.com/Mezmerizxd/social-app-v2', '_blank')} />],
  },
  {
    project: 'time_waste',
    title: 'Time Waste',
    description: [
      'This is where I waste my time.',
      'A revived version of BigBase working on GTA5 v1.64',
      'Has all the natives setup and up to date and it also includes ImGui. The main Menu is from BigBase.  Keybinds F4 - Opens Menu, INS - Opens ImGui, END - Kills thread',
    ],
    image: 'https://github.com/Mezmerizxd/time-waste/raw/main/docs/image_1.png',
    links: [<FaGithub onClick={() => window.open('https://github.com/Mezmerizxd/time-waste', '_blank')} />],
  },
];

export default github_projects;
