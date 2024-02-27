# Excel Solutions Blog
## Client Side
1. Create the folder of the project ex. **mern-blog**.
2. Open it in Visual Studio Code **vscode**
3. Install React: **npm create vite@latest** or **yarn create vite@latest**
   - Create a folder named **client**.
        * If need to **update yarn** use **npm install --global yarn**
   - **Select the Framework** you wan't to use, could be Solid but for now keep using **React**.
   - Use **JavaScript + SWC** (SW Compilor for better speed.)
4. Go to **cliend folder** and install the packages: **npm install** or **yarn install**.
5. Search in Google **"Tailwind css vite react"**. Here's the direct link: [Tailwind](https://tailwindcss.com/docs/guides/vite)
   - In the Instalation tutorial we alread have done the first step
   - Go to the second step: **npm install -D tailwindcss postcss autoprefixer** or **yarn add -D tailwindcss postcss autoprefixer**
   - Then use: **npx tailwindcss init -p**
   - In file **client\tailwind.config.js** replace the curren text for:
     /** @type {import('tailwindcss').Config} */
     export default {
          content: [
               "./index.html",
               "./src/**/*.{js,ts,jsx,tsx}",
          ],
     theme: {
          extend: {},
          },
     plugins: [],
     }
   - Then in file **src\index.css** replace the whole text to:
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
   - Now **delete** unnesesary files: **src\App.css** (Because we're using tailwind) **public\vite.svg** (if you want), **assets\react.svg**
   - In **index.html* file delete the line of code: <link rel="icon" type="image/svg+xml" href="/vite.svg"
   - Set in title the name of the Blog, in this case: ** Excel SolutionsV Blog**
6. To Run our project use: **npm run dev** or **yarn run dev**
   - If **error** like C:/repos/mern-blog/client/src/App.jsx:4:7 occurs **delete** the content of **src\App.jsx**
   - use the snip **rfc** stands of **React Function component**: (If don't have the snippet install ES7+React/Redux/React-Native)
   - Another Extension can be used are: 
     * **Auto Rename** Tag (helps to auto close the html tag)
     * **Copilot** if you want to pay
     * **Multiple Cursor Case preserve** (Helps to change the name in the App and Tag name)
     * **Prettier** (To automatic formating after saving)
     * **Tailwind Intellisense**
7. Create the **Github** Repository
   - Let's **create** it in root directory 
   - Type: **git init**
   - Type: **git add .** (with point to add/update the whole project).
   - Type: **git commit -m** "Setting up React, TailWind and created the first template of the blog."
   - Type: **git remote add origin** https://github.com/svei00/blogExcelSolutionsV.git
   - Type: **git branch -M main**
   - Type: **git push -u origin main**.
8. In the **SRC** folder create a pages folder.
   - Create **About.jsx** page
     * Create a React Function Component with the snipped **RFC*.  
   - Create the rest of the pages with the correspondent RFC:
     * **Dashboard.jsx**
     * **Home.jsx**
     * **Projects.jsx**
     * **SignIn.jsx**
     * **SignUp.jsx**  
9. Install **React Router Dom** in order to create those pages: **npm i react-router-dom** or **yarn add react-router-dom**
10. On **App.jsx** import the following line of code: **import { BrowserRouter, Routes, Route } from "react-router-dom";**
    - Then the following code inside the **return** parthesis:
          <BrowserRouter>
               <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/sign-in" element={<SignIn />}/>
                    <Route path="/sign-up" element={<SignUp />}/>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/projects" element={<Projects />}/>        
               </Routes>
          </BrowserRouter>
11. Inside **SRC** Folder create folder **components** tne create the file **Header.jsx**
    - RFC to create React Functional Component.  
    - Very important in App.jsx file inside <BrouserRoute> tag but outside the <Routes> tag add the Header in order to have the header in all the pages.
12. For the Next Step search in Google **Flowbite React** for quick reference here's the link [Flowbite](https://www.flowbite-react.com/docs/getting-started/quickstart)
    - Install the package **npm i flowbite-react** or **yarn add flowbite-react**
    - Add this line of code `'node_modules/flowbite-react/lib/esm/**/*.js',` on file **tailwind.config.js**:
          `
          export default {
               content: [
                    "./index.html",
                    "./src/**/*.{js,ts,jsx,tsx}",
                    "node_modules/flowbite-react/lib/esm/**/*.js",
               ],
          }
          `
     - Add `require('flowbite/plugin'),` too inside the:
       `
       plugins: [require("flowbite/plugin")],
       `
13. On File Header type: <Navbar><Navbar> to create the navbar
    - <Navbar className="border-b-2">Home!</Navbar>; to add a border between the page and the navbar
    - Import **import { Link } from "react-router-dom";** so you can go to the page without updating the whole page.
    - Install React Icons **npm i react-icons** or **yarn add react-icons**
      * Import the Icon **import {AiOutlineSearch} from 'react-icons/ai';** 
    - Create a form and inside the form:
    - Import a TextInput from Flowbite with a self closing tag:
      `<TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
      />`
     - For small screens we're going to add a Button:
       `<Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
       </Button>`
     - Add a <div> tag for the dark mode toggle button:
       `<div>
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
      </div>`
     - Add another Link Element to add the Sign In button:
       `<Link to={"/sign-in"}>
          <Button className="bg-gradient-to-r from-blueEx to-greenEx">
            Sign In
          </Button>
        </Link>`
     - For the Hambuerger button lets add **<Navbar.Collapse></Navbar.Collapse>** after the Sign In Link and outside the div
       `<Navbar.Collapse>
        <Navbar.Link>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>

        **Important** Inside the div add the line of code: **<Navbar.toggle/>** to make the hamburger work
     - On the imports add **useLocation** like **import { Link, useLocation } from "react-router-dom";** to Activate or select the current page as follows:
       * Between export and return: **const path = useLocation().pathname;** then:
       `<Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
               <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
               <Link to="/about">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={"div"}>
               <Link to="/projects">Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
       `
       **Note** We put the as={"div"} since the browser cannot have two <a> tags. We have two of them since Navbar.Link and Link creates two different links so as DIV fixs that.

## Server Side
1. Go back to the root directory since when deploy it points to the root.
2. Type **npm init -y** or **yarn init -y**to initialize the Packages and create file package.json
3. Create a Folder called **api** and inside it the file **index.js**
4. Install Express **npm i express** or **yarn add express** then:
   `
   import express from "express";

     const app = express();

     app.listen(3000, () => {
          console.log("Server is running on port 3000");
     });
    `
5. Run the server typing in the console: **node api/index.js**
   - If we got an error go to file **package.json** add the line of code: **"type": "module",** Reason is that we're using **import** instead **require** now it would work
6. In order to keep working while server is still running without restart it install **npm i nodemon** or **yarn add nodemon**
   - Then add on **packages.json** the script: **"dev": "nodemon api/index.js"**
   - Also we add the script to have this ready when deploy: **"start": "start api/index.js"**
   - Finally run **npm run dev** or **yarn run dev**
7. Move the **.gitignore** file from client to root in order to don't upload the whole folder to gitHub.

## Connect the Database
1. Into the root folder instal MongoDB **npm i mongose** or **yarn add mongoose**
2. Import mongoose on the top of index.js **import mongoose from "mongoose";**
3. Go to Goolge and search for [MongoDB](https://account.mongodb.com/account/login) and create the Database
   - Select **M0** which is **Free**
   - Provider **AWS**
   - Select Region near to your country in this case **Oregon**(West Coast).
   - Change Cluster 0 to **ExcelSolutionsV-Blog**
   - Hit in **Create**
   - Once created select **Username and Password**
   - Create and **username** and **password**
   - Select cloud enviroment since we're using a cloud base enviroment.
   - For testing the database on **IP Address** write **0.0.0.0** to gain access everywhere hit **Add Entry**
   - Hit in **Finish and Close** then hit **Go to Overview**
   - Done!
4. Hit in Connect.
  - **Click** on **Drivers** and in option 3 to get the URL: **mongodb+srv://excelsolucionesv:<password>@excelsolutionsv-blog.ad5tzmg.mongodb.net/?retryWrites=true&w=majority&appName=ExcelSolutionsV-Blog** and paste on the line of code: 
  - `mongoose.connect("mongodb+srv://excelsolucionesv:<password>@excelsolutionsv-blog.ad5tzmg.mongodb.net/?retryWrites=true&w=majority&appName=ExcelSolutionsV-Blog")
`
  - Also if you want to know that conections is stablished you can can add the line and also if there's an error: 
    `
    mongoose
     .connect(
     "mongodb+srv://excelsolucionesv:4eZzzCjN5duxSnPs@excelsolutionsv-blog.ad5tzmg.mongodb.net/ExcelSolutionsV-Blog?                   retryWrites=true&w=majority&appName=ExcelSolutionsV-Blog"
     )
          .then(() => {
               console.log("Database conection is Stablished.");
     })
     .catch((err) => {
          console.log(err);
     });
  `
5. Create an Enviromental variable to keep the passwords safe
   - Create **.env** file on the root directory.
   - Change the connect string to **process.env.MongoDB**:
     `.connect(process.env.MongoDB)`
   - In order to keep working on the directori instal the packge dotenv **npm i dotenv** or **yarn add dotenv**
   - Import that package: **import dotenv from "dotenv";** and add in index.js:
     `dotenv.config();`
6. Add to **.gitignore** file the .env file in order to do not upload the .env files and thus our passwords.

## Create User Model
1. Inside **api** folder Create folder **models** and then the file **users.model.js**
   - We're using the extension **model** for searchability. It will be easier to locate the files.
   - import mongoose and write the code:
     import { timeStamp } from "console";
     `import mongoose from "mongoose";

     const userSchema = new mongoose.Schema(
     {
     username: {
          type: String,
          required: true,
          unique: true,
     },
     email: {
          type: String,
          required: true,
          unique: true,
     },
     password: {
          type: String,
          required: true,
     },
     },
     { timeStamps: true }
     );

     const User = mongoose.model("User", userSchema);

     export default User;`

## Create a Test API route
1. Go back to the **index.js** file
     app.get("/test", (req, res) => {
          res.json({ message: "API is Working!!" });
     });
2. Go to your localhost address (could be your IP) and test:
   **localhost:3000/test**
3. A Good practice is create a file for each section.
   - So inside **api** folder lets create **routes** folder
   - Inside routes create **user.route.js** file
   - Code:
     `import { express } from "express";
          const router = express.Router();
          router.get("/test", (req, res) => {
               res.json({ message: "API is Working!!" });
          });

          export default router;
     `
4. Go back to index.js and import it.
   - **import userRoutes from "./routes/user.route.js";** // Important to add file extension on backend!!
   - **app.use("/api/user", userRoutes);**
5. For beter practice create folder **controllers** in the **api** directory.
6. Create the file **user.controller.js**
   export const test = (req, res) => {
     res.json({ message: "API is Working!!" });
   };
7. On **user.route.js** change to:
   - **import { test } from "../controllers/user.controller.js";**
   - Code: **router.get("/test", test);**
   

 

# Biblography
* https://www.youtube.com/watch?v=Kkht2mwSL_I&t=117s - "Source Code"
* https://www.markdownguide.org/cheat-sheet/ - Markdown cheatsheet
* https://levelup.gitconnected.com/display-images-in-react-8ff1f5b1cf9a - Displays Images
* https://nerdcave.com/tailwind-cheat-sheet - Tailwind CheatSheet
* https://tailwindcss.com/docs/customizing-colors - Custom Colors in Tailwind