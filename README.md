# IME-Inventory-Database

## Technical Instructions

### Tech Stack

- Frontend: Javascript ES6, CSS, HTML (Jinja template language, mainly to work with Flask)
- Backend: Flask, pymongo
- Database: MongoDB

### Files
```
IME-Inventory-Database  
├── Dockerfile          [Docker config file]
├── README.md
├── development.env     [Development environment, modify this in production]
├── docker-compose.yml  [Docker compose config file]
├── requirements.txt
├── test_data
│   ├── README
│   ├── categories.json     [Categories used to sort test equipments]
│   ├── load_json           [Shell script to purge the database and repopulate with pristine test data]
│   ├── mongo_postprocessing.js
│   ├── pnf_scraper.ipynb   [Python script to scrape test data from PNF website]
│   └── test_data_v3.json   [Test data scrapedfrom PNF website]
└── web
    ├── __init__.py   [Application factory where everthing starts]
    ├── config.py     [Load the env file and put them in the Flask application]
    ├── db.py         [Database operations]
    ├── edit.py       [Process input and output for the equipment editing page]
    ├── search.py     [Search and front page logic]
    ├── static
    │   ├── assets    [Images and icons]
    │   ├── css       [All the style sheets]
    │   ├── js        [All the frontend logics]
    │   └── user_uploads [Obsolete]
    ├── templates     [Jinja HTML templates]
    ├── user.py       [Serves user page]
    └── utils.py      [Helper functions]
```

### Deploy on AWS

- AWS Account: `pme.developer[at]gmail.com`
- Password: See email
- Recommended hosting environment: AWS Lightsail - Amazon Linux 2 ($3.5/month)
- Deployment: git pull, luanch through `docker-compose up --build` (be sure to update development configuration in `development.env` if used for production)

### Questions about Code/Repo Maintainance

Email me at `zhenfengqiu[at]gmail.com`.

## Todos

As of Jun 10, 2021:
- **Responsive Mobile UI**: Currently the UI breaks down on smaller screens. Add some `@media` conditions in the css files to fix it.
- **User information editing page**: Allow users to edit their information on their user page.
- **Email confirmation system**: Setup an email for the site so that users can get email confirmation when registaring accounts. I would imagine this involves getting a domain name first, although if there might be a way to make do with Gmail API?
- **Password retrieval**: Allow user to change password. It will probably involve working with the site email system as well.
- **Hosting options/hostname**: Currently the demo is hosted on my private server since free trial on AWS has expired. Follow the hosting option above to set up a new server environment, then contact the school IT staff to discuss hostname options. (Regarding AWS: From my discussion with them, hosting on AWS seems to make integration into the school's system easier. But docker-compose is pretty versatile and we are already using a complete virtual environemnt, so integration should be possible whereever you host your development server.)
- **Institution sign in**: Integrate UChicago's shibboleth sign in system so users can sign in using their UChicago account. This likely involves a lot of dicussion with the IT staff and a lot of system design choices. I would start with understanding the current database scheme and see if we can use some kind of common identifier to link UChicago account with our current user scheme, but if you feel like scraping the whole thing thats fine too.
- **Bulk Upload**: This is a requested feature from the early feedbacks we gathered. This will probably lead to big changes from database to the frontend template. Again, a lot of work but certainly possible.
- **Refactor frontend in React (Optional)**: In retrospect, React seems to be a fairly reasonable choice for our frontend framework. The downside is that you can no longer use Jinja with Flask and frontend can only pass JSON data to and from backend, so you will need a lot of async calls. However, using React will simplify a lot of the interactive logics that have became messier as features began to pile. If you are considering refactoring (and practice your framework skill), maybe start with the equipment editing page since there are relatively less data exchanges.
