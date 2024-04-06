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
8. Type this address to your Browser: **http://localhost:3000/api/user/test**

## Create SignUp API Route
1. On folder **api/routes** create the file **auth.route.js**
2. Write the following code:
     `router.post("/signup", signup);
     export default router;`
3. On folder **api/controllers** create the file **auth.controller.js**
4. Write an asyncronous function since we have to wait until MongoDB (Our Database responds):
  - First of all we're going to test the API.
  - If you don't have installed **Thunderclient** please install from VSCode Extensions.
  - You can use **[Insomnia](https://insomnia.rest/)** the main disvantage of this is you have to signup and install.
  - Write the Following code to test the API:   
     `export const signup = async (req, res) => {
          console.log(req.body);};`
  - Export the function to **auth.route.js**:
    * Import the route: **import { signup } from "../controllers/auth.controller.js";** plese **don't** forget the **.js**
    * Then on **index.js** write the following line of code: **app.use("/api/auth", authRoutes);** and don't forget to import it if not autoimport **import authRoutes from "./routes/auth.route.js";** 
    * For testing the app use the route: **http://localhost:3000/api/auth/signup** in Thunder Client
    * Since it is using JSON we have to authorize it so in **index.js** write: **app.use(express.json());**
  - In Mongo go to **Database -> Browse Collections -> Collections** and you will see the Sync data!
  - This is the **auth.controller.js**:
    `import User from "../models/user.model.js";

          export const signup = async (req, res) => {
          // console.log(req.body); This line was added for testing purpouses.

          const { username, email, password } = req.body;

          if (
          !username ||
          !email ||
          !password ||
          username === "" ||
          email === "" ||
          password === ""
          ) {
          return res.status(400).json({ message: "All fields are required" });
          }

          const newUser = new User({ username, email, password });

          try {
          await newUser.save();
          res.json("Signup Successful!!");

          // const user = await User.create({ 
               username, 
               email, 
               password // After JS6 We don't have to write password: password 
               });
          // res.status(201).json({ user: user._id });
          } catch (error) {
          res.status(500).json({ message: error.message });
          }
          };`
5. We have to hash the information of our users so for that we have:
  - Install package bcryptjs **npm i bcryptjs** or **yarn add bcryptjs**  
  - Import the library: **import bcryptjs from "bcryptjs";** it is very importa to import as bcryptjs since bcrypt will cause problems at the deploy
  - between all fields requiered and new user code write: **const hashedPassword = bcryptjs.hashSync(password, 10); // 10 mens the number of salts** 
  - Finally in password: **password: hashedPassword,**

## Add a Middleware and a Function to Handle Errors.
1. On file **api/index.js** write the middleware after user.auth.js
   - Code:
     `app.use((err, req, res, next) => {
          const statusCode = err.statusCode || 500;
          const message = err.message || "Internal Server Error";
          res.status(statusCode).json({
          suceess: false,
          statusCode,
          message,
         });
     });`
   - On file **api/controllers/auth.controller.js** add res in sigup variable:
     * **export const signup = async (req, res, next) => {** remember that next its to go to the next middeware
     * Then change on the cath error the line of code of **res.status(500).json({ message: error.message });** for **next(error);** 
  2. Inside **api** folder create another folder called **utils**
     - add the functions/file **error.util.js**
     - The code:
       `export const errorHandler = (statusCode, message) => {
          const error = new Error();
          error.statusCode = statusCode;
          error.message = message;
          return error;
        };`
     - on file **auth.controller.js** change the line of code: **return res.status(400).json({ message: "All fields are required" });** for **next(errorHandler(400, "All fields are required"));** if not auto import import: **import { errorHandler } from "../utils/error.util.js";**
    - Run the test on **Thunder Client**

## Create Signup Page UI
1. Open the **SignUp** page on **client/src/pages**
2. Write the code:
   **Pro Tip** with CTRL-P you can find between your files.
   `<div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* Left */}
        <div className="">
          <Link
            to="/"
            className="text-sm sm:text-4xl font-bold dark:text-white"
          >
            <span className="flex items-end">
              <img src={logo} alt="Logo Excel Solutions" className="h-20" />
              <span className="text-greenEx"> Blog</span>
            </span>
            {/* <span className="px-2 py-1 bg-gradient-to-r from-blueEx to-greenEx rounded-lg text-white">
          Excel Solutions®
        </span>
        Blog */}
          </Link>
          <p className="text-sm mt-5 text-justify">
            Discover the ultimate Excel resource! Sign up now to access
            exclusive tips, tutorials, and updates. Whether you're a beginner or
            an expert, elevate your skills with our curated content. Join our
            community with your Email or Google Account.
          </p>
        </div>
        {/* rigth */}
        <div className=""></div>
      </div>
    </div>`
  - Create a form in the right side. 
  - Import the Label from flowbite.
  - Import TextInput from flowbite:
  - Import Button from flowbite:
    `form>
      <div>
        <Label value="What's your name: " />
        <TextInput type="text" placeholder="Username" id="username" />
      </div>
      <div>
        <Label value="Type your Email: " />
        <TextInput type="text" placeholder="Email" id="email" />
      </div>
      <div>
        <Label value="What's your name: " />
        <TextInput type="text" placeholder="Password" id="password" />
      </div>
     </form>`
  - Final Version:
        `import { Link } from "react-router-dom";
        import logo from "../assets/LogoExcelv2_Trim_803x230.png";
        import { Button, Label, TextInput } from "flowbite-react";

        const SignUp = () => {
          return (
            <div className="min-h-screen mt-20">
              <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-20">
                {/* Left */}
                <div className="flex-1">
                  <Link
                    to="/"
                    className="text-sm sm:text-4xl font-bold dark:text-white"
                  >
                    <span className="flex items-end">
                      <img src={logo} alt="Logo Excel Solutions" className="h-20" />
                      <span className="text-greenEx"> Blog</span>
                    </span>
                    {/* <span className="px-2 py-1 bg-gradient-to-r from-blueEx to-greenEx rounded-lg text-white">
                  Excel Solutions®
                </span>
                Blog */}
                  </Link>
                  <p className="text-sm mt-5 text-justify">
                    Discover the ultimate Excel resource! Sign up now to access
                    exclusive tips, tutorials, and updates. Whether you're a beginner or
                    an expert, elevate your skills with our curated content. Join our
                    community with your Email or Google Account.
                  </p>
                </div>
                {/* rigth */}
                <div className="flex-1">
                  <form className="flex flex-col gap-4">
                    <div className="">
                      <Label value="What's your name: " />
                      <TextInput type="text" placeholder="Username" id="username" />
                    </div>
                    <div className="">
                      <Label value="Type your Email: " />
                      <TextInput
                        type="email"
                        placeholder="someone@somecompany.com"
                        id="email"
                      />
                    </div>
                    <div className="">
                      <Label value="What's your name: " />
                      <TextInput type="password" placeholder="Password" id="password" />
                    </div>
                    <Button
                      className="bg-gradient-to-r from-blueEx to-greenEx"
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  </form>
                  <div className="flex gap-2 text-sm mt-3">
                    <span>Do you have an account?</span>
                    <Link to="/sign-in" className="text-bold text-greenEx font-bold">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        };

        export default SignUp;`

## Adding Functionality to the Sign Up Page.
**PRO TIP** Hit and Hold **ALT Key** in order to select multiple lines and add/change
1. On File **client/src/pages/sign-up** and an onChange event after de id **`onChange={handleChange}`**
2. before the return add the event firstly to test the code:
   `  const handleChange = (e) => {
        console.log(e.target.value);
    };`
3. Now before the handle change type code: `const [formData, setFormData] = useState({});` don't forget to import: `import { useState } from "react";`
   So here what it looks like:
   `const [formData, setFormData] = useState({});
    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
    };`
4. on Form tag add the submit event: `onSubmit=({handleSubmit})`
   - After the handleChange event write the **handleSubmit** event:
     `const handleSubmit = async (e) => { // We use async functions since we have to wait for the server answer
      e.preventDefault(); // Prevent default we use since we don't want the page to update everytime we change of input
      try {
        const res = await fetch("api/auth/signup", { // This is the answer
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData), // We need to send a string but since we cannot sent JSON data directly we convert to string with stringify
        });
      } catch (error) {}
    };`
  - As you can see the frontEnd is 5173 and our backend is 3000 so to make it work we can simply add **localhost:3000/** like ... **`fetch("localhost:3000/api/route/auth/signup"`**... but we can add a Proxy in our vite configuration
  - Open the file **vite.config.js** which is on folder **client**
  - After line of code: **export default defineConfig({** type:
    `  server: {
          proxy: {
          "/api": {
          target: "http://localhost:3000",
          secure: false, // We set this to false since we're running on http enviroment not https
          },
        },
      },`
  - Verify if server has restarted if not restart manually
  - Run another example and verify in mongo if it is working.
5. Add another two user states:
  - **const [errorMessage, setErrorMessage] = useState(null);** 
  - **const [loading, setLoading] = useState(false);**
6. In order to avoid white spaces add **.trim** to: **setFormData({ ...formData, [e.target.id]: e.target.value.trim() });**
7. To prevent users left field without data after preventdefault line add: ****
   `if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all the fields!");
    }`
8. To handle errors after the closing div of the Link Sign in add:
   `Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>`
9. For Handling when users is duplicate after **const data = await res.json();** add:
   ` if (data.success === false) {
        return setErrorMessage(data.message);
      }`
10. In the catch error message type:
    `} catch (error) {
      setErrorMessage(error.message);
    }`
11. Set the loading after try write:
    **setLoading(true);**
    **setErrorMessage(null);**
12. Setting the loading to false after finish.
    `if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);`
13. Setting the loading to false if something went wrong.
    `} catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }`
14. For loading efect go to signup button and disable it.
    `<Button
              className="bg-gradient-to-r from-blueEx to-greenEx"
              type="submit"
              disabled={loading}
            >` 
    The add the spinner and the effect don't forget to import from Flowbite:
    `{loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>`
15. After loading we need to go to the Sign in page we achieve this by adding in import **useNavigate**:
    `import { useState, useNavigate } from "react";`
    - Then initialize the variable: **const navigate = useNavigate();**
    - befire the catch write the code:


      `if (res.ok) {
        navigate("/sign-in");
      }`

## Create and Add the Footer Component
1. In forlder **/client/src/componets** create file **Footer.jsx**
2. With **RFC** (React Function Component) create the code:
   `export default function FooterComponent() {
  return (
    <div>Footer</div>
    )
  }
  `
3. On **App.jsx** file  in **/client/src** foldeer add the folder outside the <Routes> same way we did with Header. Don't forget to import it. `<Footer />` 
4. on file Footer.jsx import the **Footer** component from **Flowbite**:
   `import { Footer } from "flowbite-react";

      export default function FooterComponent() {
      return <Footer>Footer</Footer>;
    }
    `
5. Make it a conanier: **<Footer container className="border border-t-8 border-blueEx">**
6. In the third div add the Link tag and don't forget to import it to add the logo:
   `<Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="flex items-end justify-center ">
                <img src={logo} alt="Logo Excel Solutions" className="h-10" />
                <span className="text-greenEx"> Blog</span>
              </span>
              {/* <span className="px-2 py-1 bg-gradient-to-r from-blueEx to-greenEx rounded-lg text-white">
          Excel Solutions®
        </span>
        Blog */}
            </Link>`
7. After the div with the logo code:
   - A new <div> where we set up the columns **className="grid grid-cols-2 gap-3 sm, mt-4 sm:grid-cols-3 sm:gap-6">**
   - Wrap the following code in another <div>
   - Footer.Title from Flowbite with the title: **<Footer.Title title="About" />**
   - Footer.LinkGroup group where we going to put a column organization: **<Footer.LinkGroup col>**
   - Footer.Link to add links to another pages.
   - The code will look like this:
    `<div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://portfolio.excelsolutionsv.com"
                  target="_blank"             // Blank and rel will help us to open the page in different tab.
                  rel="noopener noreferrer"
                >
                  Portfolio
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Excel SolutionsV® Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>`
  - Do the Same for the Follow Us and Legal:
    ` <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://portfolio.excelsolutionsv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Excel SolutionsV® Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup row className="text-xl">
              {/* was <Footer.LinkGroup row className="text-xl"> */}
                <Footer.Link
                  href="https://www.github.com/svei00"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="hover:text-github" />
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/ivan-e-villanueva-26253157/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="hover:text-linkedin" />
                </Footer.Link>
                <Footer.Link
                  href="https://www.youtube.com/svei00"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube className="hover:text-red-600" />
                </Footer.Link>
                <Footer.Link
                  href="https://x.com/svei00"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaXTwitter className="hover:text-xTwitter" />
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>`
8. Adding the year and copyright. Add a Footer Dividier after the third div **<Footer.Divider />**
9. Add another <div> to put the data:
   `<Footer.Copyright
            href="excelsolucionesv@gmail.com"
            year={new Date().getFullYear()}
            by=<span className="px-2 py-1 bg-gradient-to-r from-greenEx to-blueEx font-semi-bold font-serif rounded-lg text-white">
              Ivan E. Villanueva
            </span>
          />`
10. Add Social Media Icons in another <div>:
    `<div className="flex gap-6 sm-mt-0 mt-4 sm:justify-center">
            <Footer.Icon
              className="hover:text-instagram"
              href="https://Instragram.com/svei00"
              icon={FaInstagram}
            />
            <Footer.Icon
              className="hover:text-facebook"
              href="#"
              icon={FaFacebook}
            />
            <Footer.Icon
              className="hover:text-tiktok"
              href="#"
              icon={FaTiktok}
            />
            <Footer.Icon
              className="hover:text-xTwitter"
              href="https://x.com/svei00"
              icon={FaXTwitter}
            />
            <Footer.Icon
              className="hover:text-dribbble"
              href="#"
              icon={FaDribbble}
            />
          </div>`

## Create signin API route
1. Go to the **/api/routes** folder.
2. Open file **auth.route.js** 
3. Create the route of signin **router.post("/signin", signin);**
   - Don't forget to import the function **signin** from **auth.controller.js**
4. Install package **jsonwebtoken** via **npm i jsonwebtoken** or **yarn add jsonwebtoken**
   - import it to the file: **import jwt from "jsonwebtoken";**
5. On **.env** file, create the variable **JWT_SECRET** with the value **mysecretkey**
6. Go to the file **auth.controller.js** on folder **/api/controllers**
  - We're going to export: 
  - `export const signin = async (req, res, next) => {}`
     * Where **async** is because we'll  need to wait for the server response.
     * **req** to sent the request 
     * **res** which is the response of the request.
     * **next** to pass the control to the next middleware and handle errors.
     * **Pro TIP** with CTRL + D and selecting the words you want to change you can do it in a snap!
     * Code will look like this:   
      `export const signin = async (req, res, next) => { // Requiremente, response and Next to manage m 
        const { email, password } = req.body;

        if (!email || !password || email === "" || password === "") {
          next(errorHandler(400, "All fields are required"));
        }
        try {
          const validUser = await User.findOne({ email }); // FindOn help us to find data
          if (!validUser) {
            // next(errorHandler(404, "User not found =(")); We comment this part because it was an example it is not a good idea to give to hackers a clue of which is the password and which the email or username
            next(errorHandler(400, "Invalid credentials =("));
          }
          const validPassword = bcryptjs.compareSync(password, validUser.password);
          next(errorHandler(400, "Invalid credentials =("));

          const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
          const { password: pass, ...rest } = validUser._doc; // With this we separate the password from the file and only send the user for a good practice.

          res
            .status(200)
            .cookie("access_token", token, {
              httpOnly: true,
            })
            .json(validUser);
        } catch (error) {
          next(error);
        }
      };
      `
7. On Thunder Client run the test: **localhost:3000/api/auth/signin**
   - Parameters are:
   - {
        "email": "test@test.com"
        "password": "test123"
    }

## Complete signin page functionality - MERN Blog
1. Go to **/client/src/pages** and open the file **SigIn.jsx**
2. Go to **SignUp.jsx** page and copy everything to **SigIn.jsx** page
3. Starting from top to botton start to making changes, so change **SignUp** to **SignIn** you can use **CTRL + F** to find or **CTRL + H** to find and replace.
4. Around line of code **15** remove username field.
5. Around line of code **30** change the route in **navigate** from **/signin** to home I mean **/**
6. Around line of code **60** change **Sign up** to **Sign in**
7. Around line of code **70** inside the form remove the div that refers to **username**.
8. Around line of code **80** change the **placeholder** text from password to ************** 
9. Around line of code **100** change Button from **Sign Up** to **Sign In**
10. Around the same line of code change **Do you have an account?** to **Don't have an account?**
11. In the same line of code **<Link to=/sign-up>**
12. Try it. Sign in with one of the accounts created and test.

## Add Redux Toolkit
1. Search in Google **Redux Toolkit** or go to [Redux Toolkit](https://redux-toolkit.js.org/).
2. Hit on **Get Started** then on the left side **Quick Start**.
3. Install the package via NPM **npm install @reduxjs/toolkit react-redux** or Yarn **yarn add @reduxjs/toolkit react-redux** on the Front end folder (/client).
4. Create **Redux Store** you can copy the snippet on Redux oficial page.
   - Go to **/client/src** and create **redux** folder.
   - Indide the **/redux** folder create the file **store.js** and paste the code:
     `import { configureStore } from '@reduxjs/toolkit'

        export const store = configureStore({
        reducer: {},
      })`
  5. Go to the **/client** folder and open the **main.jsx** file to continue with the third step of installing redux tool kit that way it would be avalieble of all the application.
  - So import **import { store } from './redux/store.js'** and **import { Provider } from 'react-redux'**
  - It should look like this:
    ` import ReactDOM from "react-dom/client";
      import App from "./App.jsx";
      import "./index.css";
      import { store } from "./redux/store.js";
      import { Provider } from "react-redux";

      ReactDOM.createRoot(document.getElementById("root")).render(
        <Provider store={store}>
          <App />
        </Provider>
        );` 
6. Create a Reduce State Slice.
  - Go to **/client/src/redux** and create a folder called **user**.
  - Inside the folder create the file **userSlice.js** and paste the code:
    `import { createSlice } from "@reduxjs/toolkit";

      const initialState = { // Those are null when we load the page.
        currentUser: null,
        error: null,
        loading: false,
      };

      const userSlice = createSlice({
        name: "user",
        initialState,
        reducers: {
          signInStart: (state) => {
            state.loading = true;
            state.error = null;
          },
          signInSuccess: (state, action) => {
            state.currentUser = action.payload; // It is the same payload we can find in the Inspect/Network on our browser.
            state.loading = false;
            state.error = null;
          },
          signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
        },
      });

      export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

      export default userSlice.reducer; // We can change the name later`
7. On file **store.js** add the reducer.
   - Import the reducer `import { useReducer } from "./user/userSlice";`
   - The code should look like this:
      ` import { configureStore } from "@reduxjs/toolkit";
        import { useReducer } from "./user/userSlice";

        export const store = configureStore({
          reducer: {
            user: useReducer,
          },
        });`
   - Now we can use it inside the **SignIn.jsx**
8. On file **SignIn.jsx** import the reducer and the action.
   - `import { useDispatch } from "react-redux";`
   - `import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";`
9. Initialize the **useDispatch** hook.
  - Initialize the dispatch`const dispatch = useDispatch();`
  - In the **try and catch** statement change around line of code **30** **setLoading(true);** and **setErrorMessage(null);** to **dispatch(signInStart());**
  - Around line of code **20** replace **setErrorMessage("Please fill out all the fields!");** to **dispatch(signInFailure("Please fill out all the fields!"));** the return remains the same.
  - Around the same line of code **30** change **return setErrorMessage(data.message);** to **dispatch(signInFailure(data.message));**
  - Now between **if (res.ok) {** and **navigate("/");** around line of code **40** write **dispatch(signInSuccess(data));** also delete the **setLoading(false);** which is above.
  - In the **catch** section around line of code **40** replace **setErrorMessage(error.message);** and **setLoading(false);** for **dispatch(signInFailure(error.message));**
10. For manage erros and change line of code **{errorMessage && (** arond line of code **110**
    - Add **useSelector** on the **react-reduc** import like this: `import { useDispatch, useSelector } from "react-redux";`
    - Get rid of line **const [errorMessage, setErrorMessage] = useState(null);** around line of code **10** and replace for **const { loading, error: errorMessage } = useSelector(state => state.user);** remember that we get user from file **userSlice.js** in the name around line **10**.
11. To verify if it is working install **Redux DevTools** on your browser if you're using Chrome like go to ... > Extensions > Manage Extensions and find and install **Redux DevTools** 
12. Now You can use the Redux DevToolkit in the Inspect menu
13. Run your test. You know wrong password, wrong username, no user, etc. in the Redux Toolkit you can se the chantes on **State** tab and in **Action** tab you can see the payload. Also you can run the step by step.

## Adding Redux Persist.
1. In the same page of [Redux Toolkit](https://redux-toolkit.js.org/) search for persist. Persist its a function that you can use to save the state of your application in the local storage of your browser. That help us to don{t lose data.
2. Install the package **redux-persist** via **npm i redux-persist** or **yarn add redux-persist**
3. on file **/redux/store** in the import @reduxjs/toolkit import combineReducers **import { configureStore, combineReducers } from "@reduxjs/toolkit";**
4. Create a root reducer:
   `const rootReducer = combineReducers({
      user: userReducer;
    }`
5. Create a persistConfig object (configurarion):
   - First of all import the storage: **import storage from "redux-persist/lib/storage";**
   - `const persistConfig = {
        key: "root",
        storage,
        version: 1,
      }

      const persistedReducer = persistReducer(persistConfig, rootReducer);`
6. In order to avoid to make one reducer per event just use the **rootReducer**
   `const rootReducer = combineReducers({
        user: userReducer;
      });

      const persistConfig = {
        key: "root",
        storage,
        version: 1,
      },

      const persistedReducer = persistReducer(persistConfig, rootReducer);

      export const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({serializableCheck: false}),
      });

      export const persistor = persistStore(store);`
7. Now in folder **/client/src** open the **main.jsx** file.
   - On **./redux/store.jsx** import, import the **persistor**:
   - Then **import { PersistGate } from "redux-persist/integration/react";**
   - Cover everything with the **PersistGate** tag:
      `ReactDOM.createRoot(document.getElementById("root")).render(
          <PersistGate persistor={persistor}>
            <Provider store={store}>
              <App />
            </Provider>
          </PersistGate>
        );
        `
8.  Now you can run your test and see how it works with Redux DevTookKit.
   

## Add Google OAuth Functionality.
### FrontEnd
1. Create the Component of the Button. That way you can use it in both places (Sign-in and Sign-up pages).
   - Go to **/client/src/components/** folder.
   - Create the file **OAuth.jsx** file.
   - Using RFC create the React Functional Component:
      `export default function OAuth() {
        return <div>OAuth</div>;
      }`
   -  Now go to **/client/src/pages/SignIn.jsx** file and Add the Component directy under the closing tag of **<Button>** and don't forget to import it if it does not import it automatically. 
   -  Same thing with the **SignUp.jsx** file.
   -  Check if it renders.
2. In the OAuth component add the **<Buttom>** from Flowbite instead the **<div>**
3. Customize the button:
   ` <Button
        type="button"
         className="px-2 py-1 border-2 border-blueEx font-semibold rounded-lg text-black hover:bg-gradient-to-r hover:from-greenEx hover:to-blueEx hover:text-white"
      >
        <AiFillGoogleCircle className="w-6 h-6 mr-2" />
        Continue with Google 3:17
      </Button>`
4. Adding Functionality to the Button:
   - Add **onClick={handleGoogleClick}** on opening button tag.
   - Add an Asyncronus functions before the return:
     * First go to [Firebase](https://firebase.google.com/).
     * Go to **Console** (Top Right).
     * **+ Add Project/Create Project** Add a name of your project ex. mern-blog. If it is your first time accept the terms and conditions and usage confirmation.
     * At this time do not Enable Google Analytics and hit in create project.
     * Create a new **Web** Project.
     * Add an **App Nick Name** you can leave the same name of the project, do not check the Firebase Hosting and **Register the App**
     * Install de Firebase via npm **npm install firebase** or yarn **yarn add firebase** on client/frontend folder.
     * Now copy the code from the **SDK** for that inside the **/client/src/** and create the file **firebase.js** and paste the code inside.
     * Check it out this code in the file **firebase.js**
       `// apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // For React
           apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY, // For Vite`
     * Hit in continue to console.
     * Now go to Autentication > Get Started > Aditional Providers > Select Google > In the toggle button select enable > Public Facing name can put the same name of the project and email select the account you signed in and **Save**.
     * Create another **.env** file inside the **/client** to hide the apiKey. Make sure to create the file in the client root directory if not it won't work.
     * Since we're using Vite we need to create the enviromental variable using that keyword. **VITE_FIREBASE_API_KEY="your_api_key"**
     * On **firebase.js** change the key for: **apiKey: process.env.VITE_FIREBASE_API_KEY,**
     * Export the **firebase** object from the **firebase.js** file.
     `import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import the functions
      import { app } from "../firebase";

      export default function OAuth() {
        const auth = getAuth(app); // Remember this comes from our firebase.js file
        const handleGoogleClick = async () => { // It is asyncronus function since we have to wait for the answer of the server
          const provider = new GoogleAuthProvider();

          try {
            const resultsFromGoogle = await auth.signInWithPopup(auth, provider);
            console.log(resultsFromGoogle); // For testing purposes
          } catch (error) {
            console.log(error); // not so important just for testing
          }
        };
      `
5. Fetching the information. In file **OAuth.jsx** on the try bloc remove the console.log for test purposes for:
   `const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();`
6. Then we'll need to import **useDispatch** from **react-redux** in order to dispatch the information to the store. `import {useDispatch} from "react-redux";`
   - Initialize the **dispatch** function between getAuth and handleGoogleClick:
      `const dispatch = useDispatch();` 
    - Import **import {signInSuccess} from "../redux/user/userSlice";** 
    - Also Import **navitage** like this `import { navigate } from "react-router-dom";`
      * Initialize it writing the code after the dispatch:
        `const navigate = useNavigate();`
7. The code should se like this:
   `const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }`
    
   }
### BackEnd.
1. Go to the folder **/api/routes** 
2. Open the file **auth.route.js**
   - Add `router.post("/google", google);`
3. Create the function **google** on file **auth.controller.js** (**/api/controllers**)
   - `export const google = async (req, res, next) => {};`
   - import in into **auth.route.js** file. It should look like: `import { signup, signin, google } from "../controllers/auth.controller.js";`
   - Add to the model **/api/models/user.model.js** the photo.
     `profilePicture: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/05/42/36/11/360_F_542361185_VFRJWpR2FH5OiAEVveWO7oZnfSccZfD3.jpg", // Can use a defaul image taked from Google
    },`
   - Continue with the function:
     `export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc; // Substract the password
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      // Math.randon will generate password 36 means any number between 1-9 and letters a-z Slice(-8) will take the last 8 characters
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4), // We put 9 to use only numers
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};`

## Update Header Component with User Data
1. Close all the Visual Studio Tabs, then open **/client/src/components/Header.jsx**
2. Import **useSelector** from **react-redux** `import { UseSelector } from "react-redux";`
3. Initialize the useSelector after the useLocation initializatin: `const { currentUser } = useSelector((state) => state.user);`
4. Modify the line of code where is the <Link to> which is between the closin </Button> and the open of <Navbar.Toggle>:
   - Write: 
     `{currentUser ? () :
        }`
   - Then inside move the <Link to> tag inside the false statement in the ternary if.
   - Now in the true statement write the **<Dropdown></Dropdown>** tag. Remember to import it if VScode don't auto import it.
   - Working in the Dropdown it shoul se like:
     `<Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded /> // Remember to Import the Avatar from Flowbite if it won't autoimport.
            }
          ></Dropdown>`
    - For the <Dropdown.Header>:
      `<Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>`
    - Add the link section that should look like this:
      `<Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item>Sign Out</Dropdown.Item>`

## Complete Dark Mode Functionality. 
1. Go to **/client/src/redux** folder then create a folder called **theme**
2. In the folder create the file **themeSlice.js**
   - Then `import { createSlice } from "@reduxjs/toolkit";`
   - The code should be like this:
     `const initialState = {
        theme: "light",
      };

      const themeSlice = createSlice({
        name: "theme",
        initialState,
        reducers: {
          toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light";
          },
        },
      });

      export const { toggleTheme } = themeSlice.actions;

      export default themeSlice.reducer;`

3. Open the file **store.js** file on **/client/src/redux** folder.
   - On the rootReducer add the following code. Don't forget to `import themeReducer from "./theme/themeSlice"`
   - Inside the rootReducer add the following code:
    `theme: themeReducer`
4. Open folder **/client/src/components** create the file: **ThemeProvider.jsx**
   - Create a RFC (React Functional Component). Type RFC:
     `import { useSelector } from "react-redux";

      export default function ThemeProvider({ children }) {
        const { theme } = useSelector((state) => state.theme);

        return (
          <div className={theme}>
            <div className="bg-white text-gray-700 dark:bg-[rgb(16,23,42)] dark:text-gray-200">
              {children}
            </div>
          </div>
        );
      }`
5. In order to change all the pages when toggle the button go **/client/** folder 
   - Open **App.jsx** file and enclose in tags the ThemeProvider.
   - Code should look like this:
     `ReactDOM.createRoot(document.getElementById("root")).render(
          <PersistGate persistor={persistor}>
            <Provider store={store}>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </Provider>
          </PersistGate>
        );
        `
6. Go to **Header.jsx** on **/client/src/components**
   - Import the **useDispatch** `import { useSelector, useDispatch } from "react-redux";`
   - Now import the togleTheme `import { toggleTheme } from "../redux/theme/themeSlice";`
   - Go to **<FaMoon>** button and add onClick event `onClick={() => dispatch(toggleTheme())}`
   - afther path add: `const dispatch = useDispatch();`
   - Test the code.
7. To know which theme we're using add the line of code: 
   -   - After currentUser line code the useState:`const { theme } = useSelector((state) => state.theme);`
8. Add the icon of sun by importing **FaSun** `import { FaMoon, FaSun } from "react-icons/fa";`
   - Then replace **<FaMoon>** to:
     `{theme === "light" ? <FaSun /> : <FaMoon />}`
9. If you want to cover all the page add to the time provider **min-h-screen**: `<div className="bg-white text-gray-700 dark:bg-[rgb(16,23,42)] dark:text-gray-200 min-h-screen">`

## Make the Dashboard Private
1. In order to make some pages private, like the dashboard we need to create a new page.
   - Go to **/client/src/components/** 
   - create the file **PrivateRoute.jsx**
   - Create the RFC (React Functional Component).
   - Import the useSelector since we want to know if the user is logged in or not
   - Code should look like:  
     `import { useSelector } from "react-redux";
      import { Navigate, Outlet } from "react-router-dom";

      export default function PrivateRoute() {
        const { currentUser } = useSelector((state) => state.user);

        return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
      }
      `
2. Cover the dashboard on **/client/App.jsx** with the **<PrivateRoute>** tags.
   `<Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>`
        ** Remember to `import PrivateRoute from "./components/PrivateRoute";`

## Complete Sidebar of the Dashboard
1. Open the **Dashboard.jsx** file from **/client/src/pages**
2. import `import { useLocation } from "react-router-dom";`
3. Create a function that will return the active class for the sidebar. It should look likle this:
   `import { useEffect, useState } from "react";
    import { useLocation } from "react-router-dom";

    export default function Dashboard() {
      const location = useLocation();
      const [tab, setTab] = useState(""); // Remember to import it if VSCode doesn't do it 
      useEffect(() => { // Remember to import it
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        // console.log(tabFromUrl); for testing purposes.
      }, [location.search]);
      return (
        <div>
          <div className="">{/* SideBar */}</div>
          {/* Profile */}
        </div>
      );
    }
`
4. Inside folder **/client/src/component** create:
   - File called **DashProfile.jsx**
   - File called **DashSidebar.jsx**
   - Create the RFC in each one.
5. Import the files in **Dashboard.jsx** if when you add <DashSidebar/> and <DashProfile/> doesn't do automatically.
6. On file **Dashboard** comment or delete the console.log and add:
   `  if (tabFromUrl) {
      setTab(tabFromUrl);
    }`
### Working on DashSidebar
7. Use **<Sidebar/>** from Flowbite, remember if not auto import do it.
8. Page should look like this:
   `import { Sidebar } from "flowbite-react";
    import { useEffect, useState } from "react";
    import { HiArrowSmRight, HiUser } from "react-icons/hi";
    import { Link, useLocation } from "react-router-dom";

    export default function DashSidebar() {
      const location = useLocation(); // We bring this 10 lines of code from Dashboard.jsx and import the necesary libraries
      const [tab, setTab] = useState("");
      useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        // console.log(tabFromUrl);
        if (tabFromUrl) {
          setTab(tabFromUrl);
        }
      }, [location.search]);
      return (
        <Sidebar className="w-full md:w-56"> // To divide the side bar from the profile
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Link to="/dashboard?tab=profile">
                <Sidebar.Item
                  active={tab === "profile"} // To make the page active
                  icon={HiUser}
                  label={"Change Later"}
                  labelColor="dark"
                  as="div"
                >
                  Profile
                </Sidebar.Item>
              </Link>
              <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer"> // No need to make it active
                Sign Out
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      );`


## Complete Profile Page UI
1. We're gont to work on file **DashproFile.jsx** on folder **/client/src/components**
2. Code should look like this:
   `import { useSelector } from "react-redux";
    import { TextInput, Button } from "flowbite-react";

    export default function DahsProfile() {
      const { currentUser } = useSelector((state) => state.user);
      return (
        <div className="max-w-lg mx-auto p-3 w-full"> // This line is to center the image in larger screen
          <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1> //Set the header text
          <form className="flex flex-col gap-4"> // We make it flex in order to center in small screen and put a gap between text inputs
            <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"> // Complementary style to center, remember the parent should be flex
              <img
                src={currentUser.profilePicture} // get the image from firebase
                alt="User Image"
                className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
              />
            </div>
            <TextInput // If TextInput doesn't autoimport, import them from flowbite
              type="text"
              id="username"
              placeholder="Username"
              defaultValue={currentUser.username}
            />
            <TextInput
              type="text"
              id="email"
              placeholder="Email"
              defaultValue={currentUser.email}
            />
            <TextInput
              type="password"
              id="password"
              placeholder="Would you like to change your Password?"
            />
            <Button // The same, if not auto import do it manually.
              type="submit"
              className="bg-gradient-to-r from-blueEx to-greenEx"
              outline
            >
              Update
            </Button>
          </form>
          <div className="text-red-500 flex justify-between mt-5 font-semibold">
            <span className="cursor-pointer hover:text-blueEx">Delete Account</span>
            <span className="cursor-pointer  hover:text-greenEx">Sign Out</span>
          </div>
        </div>
      );
    }
    `

## Complete User Image Upload Functionality
1. We'll keep working on the same file **DashProfile.jsx** 
2. After the **<form>** opening tag add the input:
   - `<input type="file" accept="image/*" />` // The image/* means that it will aceept any of the supported image files.
3. Then add an useState hook to store the image file after the {currentUser} variable:
   - `const [imageFile, setImageFile] = useState(null);`
   - Add an onChange event onto the **<Input/>** so code should be:
     `<input type="file" accept="image/*" onChange={handleImageChange} />`
4. Create the function **handleImageChange** after the useState:
   - ` const handleImageChange = (e) => {
      setImageFile(e.target.files[0]);
    };
    console.log(imageFile); // This console log is to get img information.
    `
5. Convert the image into a temporary image url.
   - After the imageFile variable add the following code: `const { imageFileUrl, setImageFileUrl } = useState(null);`
   - Change the handleImageChange function to the following code:
     `const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      }
    };`
  - change the console.log for `console.log(imageFile, imageFileUrl);`
  - For now change the **src** from src={currentUser.profilePicture} to `src={imageFileUrl || currentUser.profilePicture}`
6. Now we want to pick the picture so for that:
   - Create the variable filePickerRef and import useRef it it doesn't do automatically.
     * ` const filePickerRef = useRef();`
   - Add in the <Input> so change <input type="file" accept="image/*" onChange={handleImageChange} /> for `<input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef}/>`
   - In the next div add in at the final `onClick={() => filePickerRef.current.click()}`
   - Make the input hidden by adding **hidden** at the end of the input tag.
7. After the **handleImageChange** function add an **useEffect** to know if there is a new function.
   - Code should look like this:
     `useEffect(() =>{
        if(imageFile) {
          uploadImage();
        }
      }, [imageFile]);`
8. Create an **Asyncronous** function since we need to interact with the server.
   - For now we create the function and console.log to see if it will work:
     ` const uploadImage = async () => {
          console.log("Uploading image...");
        };`
   - Go back to Firebase and sign in with your proper accont.
   - Hit in **Go to console**
   - Select the blog project
   - Hit in **Built** → **Storage** → **Get Started**
   - Select **Production Mode** and hit next
     * In Location select the one is near your audience. in this case us-west4 and hit **Done**
     * When ready hit the tab **rules** and create them.
     * After line of core **match /{allPaths=**}** apply the code that should look like this:
       `rules_version = '2';

        // Craft rules based on data in your Firestore database
        // allow write: if firestore.get(
        //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
        service firebase.storage {
          match /b/{bucket}/o {
            match /{allPaths=**} {
              allow read; 
              allow write: if
              request.resourse.size < 2 * 1024 * 1024 &&
              request.resourse.contentType.matches('image/.*')
            }
          }
        }`
    - Create the variable **getStorage** `const storage = getStorage(app);` if not auto import import it: `import getStorage from "firebase/storage";` We can use getStorage directly since Firebase v9.
       * Import tha **app** aplication to from the one we have created, if not auto import do it manually
        `import { app } from "../firebase";`
    - Create **fileName** variable by adding the current date to the name in order to allow unique files: `const fileName = new Date().getTime() + imageFile.name;`
    - Create **storageRef** variable `const storageRef = ref(storage, fileName);` import ref, if it doesn't auto import do in mannaally: `import { getStorage, ref } from "firebase/storage";` code should look like: `const storageRef = ref(storage, fileName);`
    - Create **UploadTask** Variable `const uploadTask = uploadBytesResumable(storageRef, imageFile)` to track about the bytes, don't forget to import the **uploadBytesResumable** manually if it won't do automatically.
    - Create a pieces of state after imageFileUrle state:
      `const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);`
    - Create another state for hannling errors after the imageFileUploadPreogress state.
      `const [imageFileUploadError, setImageFileUploadError] = useState(null);`
    - After the variable: **imageFileUploadError** console.log for testing:
      `console.log(imageFileUploadProgress, imageFileUploadError);`
    - Import from Flowbyte and **<Alert/>** component at the end of the <TextInput> of the Img:
      `{imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}`
    - Install package react-circular-progressbar
      * You can search at Google like this [react-circular-progressbar](https://www.npmjs.com/package/react-circular-progressbar)
      * Install in the client side via npm **npm install --save react-circular-progressbar** or via yarn **yarn add react-circular-progressbar** 
      * Import the following components on your app:
        `import { CircularProgressbar } from 'react-circular-progressbar';
         import 'react-circular-progressbar/dist/styles.css';`
    - Before the IMG element write:
      * Change from`lassName="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"` to `lassName="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"`
      * Change the IMG Classname from `className="rounded-full w-full h-full object-cover"
            style={{ border: "8px solid lightgray" }}` to `<img
            src={imageFileUrl || currentUser.profilePicture}
            alt="User Image"
            className={`rounded-full w-full h-full object-cover ${
              imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                "opacity-60"
            }`}
            style={{ border: "8px solid lightgray" }} // Set border style here
          />`
      * Write the code:
        `{imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}`          
     - In order to avoid to freeze the upload effect when error add after 2MB text:
       `setImageFileUploadProgress(null);`
     - To remove the error message when upload a succes image before the variable **getStorage** add:
       `setImageFileUploadError(null);` 
     - After **setImageFileUploadProgress(null)** around line 58 add:
       `setImageFile(null);
        setImageFileUrl(null);`

## Add Update User API Route.
1. Go to the backend section and open folder **/app/routes** then open **user.route.js** file.
   - After the "test" line of code add: `router.put("/update:userId", updateUser);`
2. Go to **/api/controllers** and open **user.controller.js** file.
   - Export the file `export const updateUser = async (req, res, next) => {};` and close.
   - Go back to the file **user.route.js** and import it `import { test, updateUser } from "../controllers/user.controller.js";`
3. Go to **utils** folder and create file **verifyUser.util.js**.
   - Open the file and make the following imports:
     `import Jwt from "jsonwebtoken";
      import { errorHandler } from "./error.util.js"`
   - Install the package cookie-parser via npm **npm i cookie-parser** or via yarn **yarn add cookie parser** make sure to don't mix the frontend and backend packages. It can cause troubles when deploying.
     * Import the cookieParse into **index.js** file.
     * Initialice the cookieParse after the inicialization of the express: `app.use(cookieParser());`. This way we can extrct the cookie from the browser.
   - Code the export:
     `export const verifyToken = (req, res, next) => {
      const token = req.cookies.access_token;
      if (!token) {
        return next(errorHandler(401, "Unauthorized"));
      }
      Jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return next(errorHandler(401, "Unauthorized"));
        }
        req.user = user;
        next();
      });
    };
    `
4. Go back to the file **user.route.js** and import it `import { verifyToken } from "../utils/verifyUser.util.js";`
 - Then in *router.put* add the function **verifyToken** it should look like this:
   `router.put("/update:userId", verifyToken, updateUser);`
5. Add `console.log(req.user);` into the file **user.controller.js** and test it with Thunder.
6. Code in **user.controller.js** file should look like this:
   `import { errorHandler } from "../utils/error.util.js";
    import User from "../models/user.model.js";
    import bcrypt from "bcryptjs";

    export const test = (req, res) => {
      res.json({ message: "API is Working!!" });
    };
    export const updateUser = async (req, res, next) => {
      // console.log(req.user); // With this we can see the user information.
      if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You're not Allowed to Update this User"));
      }
      if (req.body.password) {
        if (req.body.password.length < 6) {
          return next(errorHandler(400, "Password must be at least 6 characters"));
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      }
      if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
          return next(
            errorHandler(400, "Username must be between 7 and 20 characters")
          );
        }
        if (req.body.username.includes(" ")) {
          return next(errorHandler(400, "Username cannot contain spaces"));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
          return next(errorHandler(400, "Username must be in lowercase"));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
          return next(
            errorHandler(400, "Username can only contain letters and numbers")
          );
        }
        try {
          const updateUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
              $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
              },
            },
            { new: true } // This line of code prevents to send the old information and send the updated one.
          );
          const { password, ...rest } = updateUser._doc;
          res.status(200).json(rest);
        } catch (error) {
          next(error);
        }
      }
    };
    `
## Complete Update User Profile Page Functionality.
1. Close all the backend pages if any open.
2. Go to **/client/src/components/** then open the file **DashProfile.jsx**
3. After the variable *imageFileUploadError* create a new pieces of state:
   `const [formData, setFormData] = useState({});` We leave it empty because we'll fill with the changing data.
4. Inside the function **getDownloadURL** add:
   - With the spread operator `setFormData({ ...formData, profilePicture: downloadURL });`
5. Select the imputs of username, email and password and add after **defaultValue** and **placeholder** for the password input the following: code: `onChange={handleChange}`
6. Create the function **handleChange** before the return.
   ` const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    console.log(formData); // For testing purposes`
7. In the open **<form>** tag add the onSubmit code: `onSubmit={handleSubmit}`
   - Open **/client/src/redux/user** folder, then the file: **userSlice.js**
     * After the *signInFailure* add:
          `updateStart: (state) => {
          state.loading = true;
          state.error = null;
        },
         updateSuccess: (state, action) => {
          state.currentUser = action.payload;
          state.loading = false;
          state.error = null;
        },
        updateFailure: (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },`
      * Export them: `export const { signInStart, signInSuccess, signInFailure, updateSuccess, updateFailure } = userSlice.actions;`
      * Import into **DashProfile.jsx** file: `import {updateStart, updateSuccess, updateError} from "../features/user/userSlice";`
      * Import the **useDispatch** `import { useDispatch } from "react-redux";`
      * After the *filePickerRef* initialize the useDispatch: `const dispatch = useDispatch();`
   - And create an asyncronous function after *handleChange* function:
     `const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(formData).length === 0) {
          return;
        }

        console.log("Submitting form to:", `/api/user/update/${currentUser._id}`);
        console.log("Form data:", formData);

        try {
          dispatch(updateStart());
          const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            dispatch(updateFailure(data.message));
          } else {
            dispatch(updateSuccess(data));
            // Create message here!!!!
          }
        } catch (error) {
          dispatch(updateFailure(error.message));
        }
      };`
8. To prevent that image freezes at 100% percent add another state:
   - After *imageFileUploadError* add `const [imageFileUploading, setImageFileUploading] = useState(false);`
   - Then before *setImageFileUploadError* around line 50 set: `setImageFileUploading(true)`
   - Also around line 70 after the *setImageFileUrl* set: `setImageFileUploading(false);`
   - Finally around line 70 on the *getDownloadURL* set: `setImageFileUploading(false);`
   - We need to add this line of code to protect us of any issue before the try-catch block:
     ` if (imageFileUploading) {
       return;
    }`
9. Let the user know that it was updated.
  - After *setImageFileUploading* add another state `const [updateUserSuccess, setUpdateUserSuccess] = useState(null);`
  - Then after update success around line of code 100 add: `setUpdateUserSuccess("User's profile updated successfully"); // You can do it dinamically later.`
  - Create the **<Alert>** in the penultimate closing **</div>**:
    ` {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}`
10. Add another piece of state to manage when there's nothing to change.
    - After *updateUserSuccess* create `const [updateUserError, setUpdateUserError] = useState(null);`
    - After Object.keys around line of code 90 `updateUserError("No changes have been made");`
    - After imageFileUploading around line of code 100 `setUpdateUserError("Please wait for the image to Upload");`
    - After !res.ok and after the dispath add around line of code 115: `setUpdateUserError(data.message);`
    - Finally after the *dispatch* of the **catch** block
    - After the **<Alert>** of the Success add:
      ` {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}`
11. Before Object.keys around line of code 90 add:
    `setUpdateUserError(null);
     setUpdateUserSuccess(null);`

## Add Delete User API Route
1. Open the backend folder **/api/routes** then open the file **user.route.js**
2. After the put route add the **delete** route: `router.delete("/delete/:userId", verifyToken, deleteUser);`
3. Create the function *deleteUser* inside the controller, file **user.controller.js** from folder **/api/controllers/**
4. Once you have created the function `export const deleteUser = async (req, res, next) => {}` import it in the **user.route.js** file.
5. Come back to the **user.controller.js** file and add the code:
   `export const deleteUser = async (req, res, next) => {
      if (req.user.id !== req.params.userId) {
        return next(
          errorHandler(403, "You are not authorized to delete this user")
        );
      }
      try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted");
      } catch (error) {
        next(error);
      }
    };
  `
6. Make a test with ThunderClient.
   - To make sure:
     * Create a new user in the thunder client.
     * Sign in and take the _id token.
     * Delete the account. Remember to do not pass any data in the JSON content.
  

## Complete Delete User Account Functionality.
1. Go back to the Fronend secction to the folder **/client/src/components/** and open the file **DashProfile.jsx**
2. Afther the piece of state *updateUserError* add: `const [showModal, setShowModal] = useState(false);`
3. Go to the **Delete Account <span>** add: `onClick={() => setShowModal(true)}` 
4. Now Set the **<Modal>** so after the second *Update <Alert>* add: `<Modal show={showModal} onClose={() => setShowModal(false)}></Modal>` so remember if not auto import, import it: `import { TextInput, Button, Alert, Modal } from "flowbite-react";`
5. Add a **<Modal.Header/>** tag inside the *<Modal>* tag to close it.
6. Open folder **/client/src/redux/user/** then open the file **userSlice.js** add:
   `
   deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }`
    - Export them:
      `export const {
          signInStart,
          signInSuccess,
          signInFailure,
          updateStart,
          updateSuccess,
          updateFailure,
          deleteUserStart,
          deleteUserSuccess,
          deleteUserFailure,
        } = userSlice.actions;`
7. Import them to the **DashProfile.jsx** File
8. Create a **HandleDeleteUser** function. YOu can do it before the return: 
   ` const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };`
9.  Create a **<Modal.Body>** tag to add the functionality:
   `<Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" /> // If not auto import, import it: `import { HiOutlineExclamationCircle } from "react-icons/hi";`
            ** hi stands for hero icons
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">
              Are you sure to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>`
10. On the line of code: `const { currentUser } = useSelector((state) => state.user);` add: `const { currentUser, error } = useSelector((state) => state.user);` and after *updateUserError* error add:
    ` {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}`

## Add signout functionality
1. Create the user api route, open backend folder **/api/routes/** then open file **user.route.js**
   `router.post("/signout", signout);`
2. Again on **/api/client/controllers** open file: **user.controller.js**
   - Create the function and export:
     `export const signout = (req, res, next) => {
        try {
          res
            .clearCookie("access_token")
            .status(200)
            .json("User has been signed out");
        } catch (error) {
          next(error);
        }
      };
      `
3. Import the signout function: `import {test, updateUser, deleteUser, signout,} from "../controllers/user.controller.js";`  
4. Go back to the **frontEnd** and in the **DashProfile.jsx** file add a handleSignout.
   - Around line of code 240 add an onClick listener: `onClick={handleSignout}`
5. Go to the **/client/src/redux/user** and open the **userSlice.js** file to add the signout Slice.
   `signoutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },`
    - Export it:
      `export const {
        signInStart,
        signInSuccess,
        signInFailure,
        updateStart,
        updateSuccess,
        updateFailure,
        deleteUserStart,
        deleteUserSuccess,
        deleteUserFailure,
        signoutSuccess,
      } = userSlice.actions;`
  - Import it into the **DashProfile.jsx** file.
6.  const handleSignout = async () => {
      try {
        const res = await fetch("/api/user/signout", {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    };
7. Go to the Header.jsx component and:
   - Copy and paste the function, obously you can do the same way creating only one function and just import it, rehusing the code. You can paste before the return statement.
     `  const handleSignout = async () => {
          try {
            const res = await fetch("/api/user/signout", {
              method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
              console.log(data.message);
            } else {
              dispatch(signoutSuccess());
            }
          } catch (error) {
            console.log(error.message);
          }
        };
      `
     - Import the **signoutSuccess** from **redux**: `import { signoutSuccess } from "../redux/user/userSlice";`
     - Import the **useDispatch** from **react-redux**: `import { useDispatch } from "react-redux";`
     - Go to the **signout** <Dropdown.Item> and add the event listener `onClick={handleSignout}>` 
8. Go to the DashSidebar.jsx file and do the same things as you did in the Header.jsx file.
    - Add the function, and again, you can create an app or scripts folder and save all of the scripts and just import them to rehutilize the code.
    - `import { signoutSuccess } from "../redux/user/userSlice";`
    - `import { UseDispatch } from "react-redux";`
    - Initialize it: ` const dispatch = UseDispatch();`
    - Add the `onClick={handleSignout}` on **<Sidebar.Item>** 
## Add Admin Functionality to the User
1. To avoid confutions close all the open tabs.
2. Go to the folder **/app/models/** and open file **user.model.js**
3. After the line of code of the picture add:
   `  isAdmin: {
      type: Boolean,
      default: false,
    },`
4. Go to the **MongoDB** database and Sign-in
   - Go to Database.
   - Then Browse Collections.
   - Then lookup for the user you want to change
     * Set `isAdmin: true` 
5. Set the isAdmin to the cookie.
   - Go to the folder **/api/controllers/** open file **auth.controller.js**
   - Around line 60 change **const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);** for **const token= jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin },process.env.JWT_SECRET);**
   - Around line 80 change do the same with the Google Auth**const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);** for **const token=jwt.sign({ id: user._id, isAdmin: user.isAdmin },process.env.JWT_SECRET);**
   - Finally around line 110 change **const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);** to **const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);**


## Complete Create a Post Page UI.
1. Close all the open tabs to manage the files without issues.
2. Go to the frontEnd folder **/app/src/componets** and open the file **DashProfile.jsx**
3. Around line of code 250 after the Update button add:
   `  {currentUser.isAdmin && (
          <Link to={"create-post"}>
            <Button
              type="button"
              className=" w-fullbg-gradient-to-r from-blueEx to-greenEx"
              outline
            >
              Create a Post
            </Button>
          </Link>
        )}`
        Remember if Link don't autoimport, import it: `import { Link } from "react-router-dom";`
4. Also we can add the load effect on the Update button but carefull if it doesn't work take off.
   - Around line 25 change from `const { currentUser, error} = useSelector((state) => state.user);` to `const { currentUser, error, loading } = useSelector((state) => state.user);`
   - At the end of the update button add after the outline: `disabled={loading || imageFileUploading}`
   - Then inside the button change the *Update* to `{loading ? "Loading... " : "Update"}`
 5. Go to the folder **/client/src/pages** and create the page **CreatePost.jsx**
 6. With the RFC (React Functional Component):
    `export default function CreatePost() {
      return <div>CreatePost</div>;
    }
    `
7. Go to the folder **/client/src/components/** and copy the file: **PrivateRoute.jsx** and paste in the same directory
8. Change the name from **PrivateRoute.jsx** to **OnlyAdminPrivateRoute.jsx** and open it.
9. Once open change from `export default function PrivateRoute() {` to `export default function OnlyAdminPrivateRoute() {` and `return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;` to `return currentUser.isAdmin ? <Outlet /> : <Navigate to="/sign-in" />;`
10. Go to **/client/src/** folder and open **App.jsx**
11. There you can copy, paste and then modify the *dashboard* route. So code should look like this:
    `<Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
      </Route>`
      Remember if not auto import, import it: `import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";` and `import CreatePost from "./pages/CreatePost";`
12. Install quill editor inside the fronend. Via NPM **npm install react-quill --save** or via yarn **yarn add react-quill**
    - Import it to your **CreatePost** page. 
      * `import ReactQuill from "react-quill";`
      * `import ReactQuill from "react-quill";`
    - You can Edit to perzonalize your editor.
      * Go to **index.css** in forlder **/client/src/**
        `body {
          height: 100vh;
        }
        
        .ql-editor {
          font-size: 1.05rem;
        }
        `
13. The functions should look like this:
    `return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
            />
            <Select>
              <option value="uncategorized">Select a category</option>
              <option value="formulas">Formulas and Functions</option>
              <option value="data-entry">Data Entry</option>
              <option value="data-analysis">Data Analysis</option>
              <option value="data-visualization">Data Visualization</option>
              <option value="collaboration">Collaboration and Security</option>
              <option value="automation">Automation</option>
              <option value="add-ins">Add-in and Extensions</option>
              <option value="printing">Printing and Sharing</option>
              <option value="accessibility">Accessibility</option>
              <option value="macros">Macros</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center justify-between border-2 border-blueEx p-3">
            <FileInput type="file" accept="image/*" />
            <Button
              type="button"
              className="bg-gradient-to-r from-greenEx to-blueEx "
              outline
              size="sm"
            >
              Upload Image
            </Button>
          </div>
          <ReactQuill
            theme="snow"
            placeholder="Create a story..."
            className="h-72 mb-12"
          />
          <Button
            className="bg-gradient-to-r from-greenEx to-blueEx hover:from-blueEx hover:to-greenEx"
            required
          >
            Publish!!
          </Button>
        </form>
      </div>
    );`
    - Remember to import flow-byte functions if not autoimport.
      * import { Button, FileInput, Select, TextInput } from "flowbite-react";


## Add Create a Post API Route.
1. Close all the open tabs for better view.
2. Go to backend and open folder **/api/routes** and crate file **post.route.js**
3. import express: `import express from "express";`
   - create the router: `const router = express.Router();`
4. We're going to rehutilize the code from *verifyUser.js* so import it:
   - So use: `import { verifyToken } from "../utils/verifyToken.js";`
   - Create the route: `router.post("/create", verifyToken, create);`
5. Create the function **create** on **/api/controllers/** and create the file **post.controller.js**
   - Create an asyncronous function (since we need to wait for the server response):
     `export const create = async (req, res, next) => {};`

     6:03:37


## Biblography
* https://www.youtube.com/watch?v=Kkht2mwSL_I&t=117s - "Source Code - Video"
* https://github.com/sahandghavidel/mern-blog - "Github Source Code"
* https://www.markdownguide.org/cheat-sheet/ - Markdown cheatsheet
* https://levelup.gitconnected.com/display-images-in-react-8ff1f5b1cf9a - Displays Images
* https://nerdcave.com/tailwind-cheat-sheet - Tailwind CheatSheet
* https://tailwindcss.com/docs/customizing-colors - Custom Colors in Tailwind
* https://usbrandcolors.com/