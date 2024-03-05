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
  
# Biblography
* https://www.youtube.com/watch?v=Kkht2mwSL_I&t=117s - "Source Code"
* https://www.markdownguide.org/cheat-sheet/ - Markdown cheatsheet
* https://levelup.gitconnected.com/display-images-in-react-8ff1f5b1cf9a - Displays Images
* https://nerdcave.com/tailwind-cheat-sheet - Tailwind CheatSheet
* https://tailwindcss.com/docs/customizing-colors - Custom Colors in Tailwind
* https://usbrandcolors.com/