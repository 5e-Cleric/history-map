# Welcome to my project, historyMap

HistoryMap is a web tool to register events in timelines and maps, using your own data, including your own custom date system!

It is built with the MERN stack, current temporarily hosted in Netlify + Render + Mongodb Atlas

## Work In Progress

Right now, i am workin towards completing the MVP of this app, which includes:

-   [x] Have different worlds, a world should include: map, timeline, events, factions?
-   [x] In every world, add events to map, automatically added to timeline
-   [x] For every event, add date, position, title, and description
-   [x] Consult events based on map position, and world date in a timeline
-   [ ] CRUD events and worlds


How to install it

HistoryMap requires 3 programs to run:

1. install [node](https://nodejs.org/en/), version v17 or higher. (I use 20.18 atm)
1. install [mongodb](https://www.mongodb.com/try/download/community) (Community version)

1. install [git](https://git-scm.com/downloads) (select the option that allows Git to run from the command prompt).

Checkout the repo ([documentation][github-clone-repo-docs-url]):
```
git clone https://github.com/5e-Cleric/history-map.git
```

[github-clone-repo-docs-url]: https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository

Second, you will need to add the environment variable `NODE_ENV=local` to allow
the project to run locally.

You can set this **temporarily** (until you close the terminal) in your shell of choice with admin privileges:
* Windows Powershell: `$env:NODE_ENV="local"`
* Windows CMD: `set NODE_ENV=local`
* Linux / macOS: `export NODE_ENV=local`

If you want to add this variable **permanently** the steps are as follows:
    1. Search in Windows for "Advanced system settings" and open it.
    1. Click "Environment variables".
    1. In System Variables, click "New"
    1. Click "New" and write `NODE_ENV` as a name and `local` as the value.
    1. Click "OK" three times to close all the windows.
  This can be undone at any time if needed.


1. Run `npm install` to install the Node dependencies

Now that everything is installed, the following commands are used to open the tool:

(remember to run mongo)

1. Run `node server.js` to open the server, leave that as its own 

1. Run `npm run build` and then `npm run preview` to use it locally, or
1. Run `npm run dev` if you want to start a development server



You should now be able to go to [http://localhost:4173](http://localhost:4173)
in your browser and use The Homebrewery offline.

Ports:
- 8000 for development
- 4173 for preview
- 3050 is the server

I'll update this when needed
