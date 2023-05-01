## SharkTanks - Join the battle, forge your destiny.

Welcome to SharkTanks! It is an online multiplayer game that allows multiple players to play together over the internet with each other. Even if there is no one around to play, we have implemented a bot that can work as an additional player. This game is open-sourced, so feel free to create issues to add features or fix bugs. If you find the project interesting, please consider giving it a star!

### Inspiration
We were inspired to build an online multiplayer game because we are fans of video games and the idea of being able to play with others from across the world really excites us.

### Demo
![demo](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/338/753/datas/original.png)

### Play Now
Click [here](https://sharktanks.tech/) to play the game!

### Technologies Used
We used the following technologies to build the game:

- HTML and CSS for the landing page
- Three.js, Express.js and Node.js for the game environment and the backend
- Railway.app for hosting
- Socket.io for the real time communication between the players and the server

### Challenges Faced
We encountered a few challenges while building the game. Some of them are listed below:

- Network Latency: In the beginning, we were using rendered tanks which caused a lot of lag in the gameplay.
- Server Scalability: As more players joined the game, the game server was overloaded and unable to handle the increased traffic. This caused a decrease in performance and a bad user experience.
- Page Overrides: The index page was being overridden by the canvas of the game, and we had to make a few changes in the particular layouts to avoid this.
- Function Workability: The function for counting the hits so that the damage on the tank could be noted was not working properly, but we performed a few debug techniques and fixed it.

### Future Plans
There are several evolutionary changes planned for SharkTank, such as:

- Adding rendered objects to make it look better
- Giving rendered objects functionality, for example, moving, transforming, etc.
- Implementing and improving security aspects
- Assigning separate user accounts so that players can keep track of their achievements and develop their ability accordingly.
- Changing environments and much more

## Installation

To run this project locally, follow these steps:

1. Install Node.js on your system from [here](https://nodejs.org/en/download/).
2. Clone this GitHub repository: `git clone https://github.com/kpatel0170/SharkTanks`
3. Open the terminal and navigate to the "SharkTanks" folder.
4. Run the command `npm install` to install dependencies.
5. Run the command `node server.js`.
6. Run the `public/index.html` in browser.


## To deploy this project using Docker, follow these steps:

1. Clone this repository to your local machine: `git clone https://github.com/KlausMikhaelson/SharkTanks-Debug_Thugs.git`
2. Change into the project directory: `cd SharkTanks-Debug_Thugs`
3. Build the Docker image: `docker build -t sharktank .`
4. Start the Docker container: `docker run -d -p 3001:3001 sharktank`
5. Your project should now be up and running, accessible at http://localhost:3001 in your web browser.

### Notes
1. Make sure that [Docker](https://www.docker.com/) is installed and running on your machine before attempting to deploy this project with Docker.
2. This project's Dockerfile assumes that all dependencies are included in the project directory. If you need to install additional dependencies, update the Dockerfile accordingly before building the Docker image.

## Contributing

To contribute to SharkTanks, follow these steps:

1. Fork this repository.
2. Clone your forked repository to your local machine.
3. Create a new branch: `git checkout -b my-new-feature`.
4. Make your changes and commit them: `git commit -am 'Add some feature'`.
5. Push your changes to the branch: `git push origin my-new-feature`.
6. Submit a pull request.

### Pull Requests

We welcome pull requests from everyone. Please ensure your pull request adheres to the following guidelines:

1. Explain the problem your pull request solves.
2. Make sure your changes are well-tested and documented.
3. Ensure your code follows the coding conventions and standards used in the project.
4. Ensure your code is properly formatted using Prettier.
5. Make sure your commits are descriptive and have a clear message.

[Read more on creating a pull request from a fork here](https://help.github.com/articles/creating-a-pull-request-from-a-fork/).

### Issues

If you find any issues with SharkTanks, please submit them through the [GitHub Issues page](https://github.com/kpatel0170/SharkTanks/issues). When submitting an issue, please provide the following information:

1. A clear and descriptive title.
2. Steps to reproduce the issue.
3. Expected behavior.
4. Actual behavior.
5. Screenshots or code snippets (if applicable).

## License

This project is licensed under the [MIT License](LICENSE).

### Creators
This game was created by:

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/KlausMikhaelson"><img src="https://avatars.githubusercontent.com/u/100528412?v=4" width="100px;" alt="Klaus"/><br /><sub><b>Klaus(Satyam)</b></sub></a><br /><a href="https://sharktanks.tech" title="Code">💻</a></td>
            <td align="center"><a href="https://github.com/OmDalwadi"><img src="https://avatars.githubusercontent.com/u/88398870?v=4" width="100px;" alt="Om"/><br /><sub><b>Om Dalwadi</b></sub></a><br /><a href="https://sharktanks.tech" title="Code and docs">💻 🖋</a></td>
                  <td align="center"><a href="https://github.com/kartikpatel0170"><img src="https://avatars.githubusercontent.com/u/67594421?v=4" width="100px;" alt="Kartik Patel"/><br /><sub><b>Kartik Patel</b></sub></a><br /><a href="https://sharktanks.tech" title="Code">💻</a></td>
                        <td align="center"><a href="https://github.com/zachary-huber"><img src="https://avatars.githubusercontent.com/u/23299345?v=4" width="100px;" alt="GigaChad"/><br /><sub><b>Zac</b></sub></a><br /><a href="https://sharktanks.tech" title="3d design + guidance"> 🎨 🖋</a></td>
    </tr>
  </tbody>
</table>


If you have any questions or feedback, please feel free to reach out to us. Thank you for checking out SharkTanks!

