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
    - <Navbar className="border-b-2">Home!</Navbar>; to add a border between the page and the navbar. The fixed top-0 w-full z-50 is to make the navbar sticky
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
       `<Button className="w-12 h-10 lg:hidden" color="gray" pill onClick={handleSubmit}>
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
          // res.status(201).json({ user: user.id });
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
              request.resource.size < 2 * 1024 * 1024 &&
              request.resource.contentType.matches('image/.*')
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
   - Import the function `import { create } from "../controllers/post.controller.js";` into **post.route.js** file.
   - Now export the router `export default router;`
   - Go to the **index.js** file an import the route: `import postRouters from "./routes/post.route.js";`
   - Add it after *authRoutes* around line 30: `app.use("/api/post", postRouters);`
   - Come back to the file *post.controller.js* and verify if the user as admin privilegies.
     `import {errorHandler} from '../utils/errorHandler.js'

        export const create = async (req, res, next) => {
          if (!req.body.isAdmin) {
            return next(errorHandler(403, "You are not allowed to create a post"));
          }
          if (!req.body.title || !req.body.content) {
            return next(errorHandler(400, "Please fill all the fields"));
          }
        };
    `Remember if not auto import do it manaually.
  - After the if add the **slug**:
    `const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");
    `
  - Create the post model.
    * Go to the folder **/api/models** and create file **user.model.js**
    * Code should look like this: 
      `import mongoose from "mongoose";

        const postSchema = new mongoose.Schema(
          {
            userId: {
              type: String,
              required: true,
            },
            content: {
              type: String,
              required: true,
            },
            title: {
              type: String,
              required: true,
              unique: true,
            },
            image: {
              type: String,
              default:
                "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
            },
            category: {
              type: String,
              default: "uncategorized",
            },
            slug: {
              type: String,
              required: true,
              unique: true,
            },
            likes: [{
              userId: {
                type: String,
                required: true,
              },
              likedAt: {
                type: Date,
                default: Date.now,
              }
            }],
          },
          { timestamps: true }
        );

        const Post = mongoose.model("Post", postSchema);

        export default Post;
    `    
  - Create the **post** instruction:
    `import { errorHandler } from "../utils/error.util.js";
      import Post from "../models/post.model.js";

      export const create = async (req, res, next) => {
        if (!req.user.isAdmin) {
          return next(errorHandler(403, "You are not allowed to create a post"));
        }
        if (!req.body.title || !req.body.content) {
          return next(errorHandler(400, "Please fill all the fields"));
        }
        const slug = req.body.title
          .split(" ")
          .join("-")
          .toLowerCase()
          .replace(/[^a-zA-Z0-9-]/g, "");

        const newPost = new Post({
          ...req.body,
          slug,
          userId: req.user._id,
        });
        try {
          const savedPost = await newPost.save();
          res.status(201).json(savedPost);
        } catch (error) {
          next(error);
        }
      };`
  - Create a Thunder Client Query.
    * http://localhost:3000/api/post/create If you run as it it will give you an 403 error.
    * Create an Admin with adminsitrative rights (create at Thunder Client then change to admin in MongoDB)
    * Use the signIn to verify everythings works well and sighin
  
  ## Complete Upload Post Image Functionality.
1. Close all the tabs that are open for better readibility. 
2. Go to **/client/src/pages** and open file **CreatePost.jsx**
3. Around line of code *5* create a state to manage the image file: `const [file, setFile] = useState(null);`
4. Around line of code *35* add an onChange event in the **FileInput** tag: `onChange={(e) => setFile(e.target.files[0])}`
5. Around line of code *40* add an onClick event listener to call the function **handleUploadImage**: `onClick={handleUploadImage}`
6. Create the function before the return:
   `const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please Select an Image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app); if not auto import **import { getStorage } from "firebase/storage"; and import { app } from "../firebase";**
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageLoadProgress(progress.toFixed(0)); // We round to zero with toFixed(0)
        },
        (error) => {
          setImageUploadError("Image Upload Failed");
          setImageLoadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageLoadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
          } catch (error) {
            setImageUploadError("Image Upload Failed");
            setImageLoadProgress(null);
            console.log(error); // Provisional code
          }
        };
      );`
7. Adding the progress bar.
  - Import the circular progress bar:
    `import { CircularProgressbar } from "react-circular-progressbar";  
     import "react-circular-progressbar/dist/styles.css";`
  - Change the **Upload Image** Button from:
    `<Button
    type="button"
            className="bg-gradient-to-r from-greenEx to-blueEx "
            outline
            size="sm"
            onClick={handleUploadImage}
    >
           Upload Image
          </Button>`
          to:
          `<Button
            type="button"
            className="bg-gradient-to-r from-greenEx to-blueEx "
            outline
            size="sm"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0} %`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>`
8. After the div of the Button add the Alert in case something went wrong:
   `{imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}`
9. Getting the image. After the alert code:
   `{formData.image && (
          <img
            src={formData.image}
            alt="Uploaded Image"
            className="w-full h-72 object-cover"
          />
        )}`

## Complete Create Post Functionality
1. On the file **CreatePost** we need to add three event listener.
   - Add an onChage event listener in the first Input which is **Title** around line of code 60:
     `onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }`
   - Let's do the same with the **<Select>** around line of code 70 and write inse the tag:
     *<Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >*
   - Do the same with the **<ReactQuill>** component.
     `onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}`
2. Console.log the functions to see if it works. After the *useState* formData aroun line of code 20:
   `console.log(formData)`
3. Around line 60 add in the **<form>** tag an onSubmit event:
   `onSubmit={handleSubmit}`
4. Create a piece of state after the **formData** around line 20
   - `const [publishError, setPublishError] = useState(null);`
5. Create the handleSubmit function before the retutn:
   `const handleSubmit = async (e) => {
    e.preventDefault(); // To prevent reflesing the page
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
      }
    } catch (error) {
      setPublishError("Something went wrong!!");
    }
  };`
6. Creae an **<Alert>** to show an alert if something is wrong. After the last **<Button>** tag add:
   ` {publishError && <Alert className="mt-5"color="failure">{publishError}</Alert>}`
7. Navigate the user to the post page, so add **useNavigete** before the export around line of code 10:
   - `import { useNavigate } from "react-router-dom";`
   - Initialize it around line of code 20: `const navigate = useNavigate();`
   - Around line of code 80 add the navigate route: `navigate(`/post/${data.slug}`);`
   - Try it, you should see the page with the ending: */post/your-post* in the slug form.


## Add Posts Section to the Dashboard.
1. First thing first. Close all the tabs that are open.
2. Open **DashSidebar.jsx** File from **/client/src/components**
3. After the *Profile* <Link> add:
   - Import the useSelector: `import { useSelector } from "react-redux";`
   - then add the current user before the useEffect around line of code 10: 
   ` {currentUser.isAdmin && (
            <Link to="/dashboard?tab=post">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}`
    * Remember if not auto import the HiDocumentText do it: `import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";`
4. Around line of code 50 make the current user Dynamic, so change: `label={"Change Later"}` to `label={currentUser.isAdmin ? "Admin" : "User"}`
5. Also modify around line of code 40 the **<Sidebar.ItemGroup> from `<Sidebar.ItemGroup>` to `<Sidebar.ItemGroup className="flex flex-col gap-1">`
6. Create in the same folder, component the file **DashPosts.jsx**
   - Create the React Function Component (RFC):
     `export default function DashPosts() {
    return <div>DashPosts</div>;
  }
  `
1. In the **Dashboard.jsx** file from **/client/src/pages** around line of code 25 add:
   - ` {/* Posts */}
      {tab === "posts" && <DashPosts />}` remember if not auto import  import it: `import DashPosts from "../components/DashPosts";`

## Create Get Posts API Route.
1. Go to the backend section **/api/routes/** and open **post.route.js** file and code:
  - `router.get("/getposts", getposts); ` No need to verifyToken since we need al the users can check the posts.
2. Now go to the **/api/controllers** and open the file **post.controller.js** now code the *getpost* async function:
   - Code should look like this:
     `export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9; // The see the page in tiles 3 x 3
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { category: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchItem && {
        $or: [
          // It allow us to use multiple criteria
          { title: { $regex: req.query.searchTerm, $options: "i" } }, // "i" stands for that upper case or lower case text doesn't matter
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};
`
   - import it: `import { getposts } from "../controllers/post.controller.js";` in to the **post.route.js** file.
3. Go to the Thunderclient to test the function. 
   - Create a Get funtion: `http://localhost:3000/api/post/getposts`
   - Save it and run it.  
   - Also you can limit it by running like this: `http://localhost:3000/api/post/getposts?limit=1`

## Show user Posts Inside Dashboard.
1. Close all the tabs you don't need and just leave open **Dasgbiar.jsx, DashPost.jsx and DashSideber.jsx**
2. On **DashPost.jsx** File:   
   - Import:
     `import { useEffect } from "react";
      import {useSelector} from 'react-redux'`
  - Create the function.
    Remember you cannot use async functions with useEffect so the thing we do is a work around:
    ` useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]);`
3. Seacth in Google for scrollbar tailwind and hit the npm package [Tailwind Scrollbar](https://www.npmjs.com/package/tailwind-scrollbar)
 - Install via **NPM** npm install --save-dev tailwind-scrollbar or via **yarn** yarn add -D tailwind-scrollbar
   **Remember to install in the client side**
 - Go to **/client** and open the tailwind file **tailwind.config.js** and edit:
   * On pluging after the flowbite add: `require('tailwind-scrollbar'),` code should look like this:
     `plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],` 
   * Remember when you do changes like this you should restart the app on the client side.
4. Go back to the **/client/src/components** and continue working on **DashPost.jsx** file:
   `import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { CiEdit, CiCircleRemove } from "react-icons/ci";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  console.log(userPosts); // For testing purposes.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className="text-red-700 text-2xl hover:text-3xl cursor-pointer">
                      <CiCircleRemove />
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-greenEx text-2xl hover:text-3xl cursor-pointer"
                      to={`/update-post/${post._id}`}
                    >
                      <span>
                        <CiEdit />
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p> You have no post yet!!</p>
      )}
    </div>
  );
}
`

## Add Show more Functionality to the Posts Results of the Dashboard.
1. Add a **showMore** state around line of code 10 after *userPost* state
   `const [ showMore, setShowMore ] = useState(true);`
2. Around line of code 20 insde the try statement after the *setUserPost* add the code:
   `if (data.posts.length <Table 9) {
            setShowMore(false);
          }`
3. After the closing **</Table>** tag add:
   `  {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blueEx font-semibold self-center text-sm py-7 hover:text-greenEx"
            >
              Show More
            </button>`
4. Now before the return add the function **handleShowMore**
   `const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error); // No need to add error handler
    }
  };`

## Add Delete Post Functionality to the Dashboard.
1. Open **/api/routers/** and open file **post.route.js**
   - Add: `router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);`
2. Now go to **/api/controllers** then open the file **post.controller.js** an create the function deletepost.
   - Write the code that should look like:
     `export const deletepost = async (req, res, next) => {
        if (!req.user.isAdmin || req.user.id !== req.params.id) {
          return next(errorHandler(403, "You are not allowed to delete this post."));
        }
        try {
          await Post.findByIdAndDelete(req.params.postId);
          res.status(200).json("The post has been deleted!!");
        } catch (error) {
          next(error);
        }
      };
      `
3. Now go to the **DashPost.jsx** File around line of code 10 add a piece of state to handle *Modal*
   - We can use the **<Modal>** we made on file **DashProfile.jsx** or create a component to handle it.
   - For now copy and paste the modal around line of code 120 after the *<p>* element *You have not post yet* inside the same div:
     `<Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
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
        </Modal.Body>
      </Modal>`
      - Remember to import the **<Modal>** `import { Modal, Button } from "flowbite-react";` and `import { HiOutlineExclamationCircle } from "react-icons/hi";`
      - Around line of code 130 change the h3 element from: **Are you sure to delete your account?** to **Are you sure to delete this post?**
      - Around the same line of code change the handle event from **onClick={handleDeleteUser}>** to **onClick={handleDeletePost}>**
      - Around line of code 90 add on the span of the delete button the **onClick**: ` onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}`
      - Around line of code 10 add the piece of state: `const [postIdToDelete, setPostIdToDelete] = useState(null);`
      - Before the return add the **handleDeletePost** Function.
        `const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };`

## Add Update Post Functionality.
1. Go to **/client/src/pages** and create a new file **UpdatePost.jsx**
2. Go to **/client/src** and open **App.jsx** file. Then add the *private* route for UpdatePost:
  - Code should lool like this:
    `<Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>`
  - If not auto import, do it: `import UpdatePost from "./pages/UpdatePost";`
3. Go to folder **/api/routes** and open file: **post.route.js**
   - Around line of code 10 after the deletepost: `router.put("/updatepost/:postId/:userId", verifyToken, updatepost);`
   - Now go to **/api/controllers** and open **post.controller.js**
     `export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.id) {
    return next(errorHandler(403, "You are not allowed to update this post."));
  }
  try {
    const updatepost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        // $set: req.body, this is not secure thats whay we use like this:
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatepost);
  } catch (error) {
    next(error);
  }
};`
4. Open the page **CreatePost.jsx** and copy the code and paste into **UpdatePost.jsx**
   `import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomReactQuill from "../components/CustomReactQuill";
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  // console.log(formData); Testing purposes.
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please Select an Image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image Upload Failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image Upload Failed");
      setImageUploadProgress(null);
      console.log(error); // Provisional code
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // To prevent reflesing the page
    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong!!");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          {/* <TextInput type="text" placeholder="Author" required /> */}
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
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
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            className="bg-gradient-to-r from-greenEx to-blueEx "
            outline
            size="sm"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0} %`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded Image"
            className="w-full h-72 object-cover"
          />
        )}

        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Create a story..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-greenEx to-blueEx hover:from-blueEx hover:to-greenEx"
          required
        >
          Update!!
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
        <CustomReactQuill />
      </form>
    </div>
  );
}
`
** Remember to import the function: import { updatepost } from "../controllers/post.controller.js";

## Create Get Users API Route.
1. Go to the folder **/api/routes/** and open the file **user.route.js**
2. Create a new route after the router.post around line of code 10: `router.put("/updatepost/:postId/:userId", verifyToken, updatepost);`
3. Go to the folder **/api/controllers** and open file **user.controller.js** and create the function:
   `export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to See all users."));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // No showing the password
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createAt: {
        $gte: oneMonthAgo,
      },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};`
4. Test it with ThunderClient:
   - Create a copy of a old one, for exaple the getPosts.
   - Writhe this request: `http://localhost:3000/api/user/getusers`
   - To limit the user you can use: `http://localhost:3000/api/user/getusers?limit=times`
  
## Show Users to the Admin Dashboard.
1. Close all the open tabs for better unedrstanding.
2. Go to **/client/src/componets** and create file: **DashUsers.jsx**
3. Now copy the code from **DashPost.jsx** since the code here should look the same since we fill a table. 
   - First add the page to **Dashboard.jsx** which is in **/client/src/pages** around line of code 30 after the DashPost page:
     `{/* Users */}
      {tab === "users" && <DashUsers />}`
      ** Remember. If not auto import, Import it: `import DashUsers from "../components/DashUsers";` 
   - Go to **DashSideBar.jsx** from **/client/src/componets** and copy and paste the code from showing the code of side bar around line of code 55 after it, it should look like:
     `import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Modal } from "flowbite-react";
import { CiCircleRemove } from "react-icons/ci";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  // console.log(users); // For testing purposes.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) fetchUsers();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.title}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className="text-red-700 text-2xl hover:text-3xl cursor-pointer"
                    >
                      <CiCircleRemove />
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blueEx font-semibold self-center text-sm py-7 hover:text-greenEx"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p> You have no users yet!!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this user?
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
        </Modal.Body>
      </Modal>
    </div>
  );
}`

## Add delete user functionality to the admin user
1. Go to **/api/controllers** and open the file: **user.controller.js** and modify around line of code 60:
   From ` if (req.user.id !== req.params.userId)` to `if (!req.user.isAdmin && req.user.id !== req.params.userId) {`
2 On **DashUsers.jsx** write the code:
  ` const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };`

## Complete post page functionality
1. Close all open tabs to avoid confutions.
2. Go to FrontEnd page **/client/src/pages** and create the file **PostPage.jsx**
   - Use RFC snippet (React Functional Component).
     `export default function PostPage() {
  return <div>PostPage</div>;
}
`
3. Go to folder **/client/src** and open file **App.jsx** add the page without any protections since it will be public so around line of code 30 after the projects path add: `<Route path="/posts/:postSlug" element={<PostPage />} />` remember if not auto import do it: `import PostPage from "./pages/PostPage";`
4. Go to **/api/controllers** folder and open **post.controller.js** file.
   - Around Change the line of code ********HERE
5. Go back to the **PostPage.jsx** file and:
   - Import `import { useParams } from "react-router-dom";`
   - Add before the regurn of the functions: 
     `const { postSlug } = useParams();
      const { loading, setLoading } = useState(true);
      const { error, setError } = useState(false);
      const { post, setPost } = useState(null);`
      ** Remember to import **useState** if it won't do automatically: `import { useEffect, useState } from "react";`
   - Create the useEffect:
     `  useEffect(() => {
    // console.log(postSlug); // Testing purposes
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search/?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>
          {post && "about " + (post.content.length / 1000).toFixed(0)} minutes
          to read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
    </main>
  );
}
`
      ** If not auto import do it: `import { useEffect } from "react";`

6. Go to **/client/src/pages** and open the file **index.css**
   - Add the following CSS Code:
     `.post-content p {
    margin-bottom: 0.5rem;
  }
  
  .post-content h1 {
    font-size: 1.5rem;
    font-weight: 600;
    font-family: sans-serif;
    margin: 1.5rem 0;
  }
  
  .post-content h2 {
    font-size: 1.4rem;
    font-family: sans-serif;
    margin: 1.5rem 0;
  }
  
  .post-content a {
    color: rgb(73, 149, 199); /* Change to blueEx */
    text-decoration: none;
  }
  
  .post-content a:hover {
    text-decoration: underline;
  }
  
  .dark .post-content a {
    color: red; /* Change to greenEx */
  }
`
## Add Call to Action to the Post Page.
1. Go to **/client/src/components** folder an create file **CallToAction.jsx**
2. Then create a RFC (React Funtional Component).
3. Add the *Call to Action Component* to **PostPage.jsx**
   - Add a new <div> tag after the last one:
     `
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
     `
     ** Remeber if not auto import do it: `import CallToAction from "../components/CallToAction";`
4. Go back to the **CallToAction** function and:
   `import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-greenEx justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about Excel?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with 100% practical exercises
        </p>
        <Button className="bg-gradient-to-r from-blueEx to-greenEx rounded-tl-xl rounded-bl-none">
          <a
            href="https://portfolio.excelsolutionsv.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portfolio
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/40/Microsoft-excel.png"
          alt="Some Logo"
        />
      </div>
    </div>
  );
}`


## Add comment section to the post page.
1. Go to **/client/src/components** and create the file: **CommentSection.jsx**
   - Then run the RFC snipped (React Functional Component)
 -   `import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Textarea } from "flowbite-react";
import ButtonOutline from "../components/Buttons";
import { useState } from "react";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Remember to avoid refreshing the page.
    if (comment.length > 1000) {
      return;
    }

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setComment("");
        setCommentError(null);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dasboard?tab=profile"}
            className="text-xs text-blueEx hover:text-greenEx"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-blueEx my-5 flex gap-1">
          You must be Signed In to comment.
          <Link to={"/signin"} className="text-greenEx hover:font-bold">
            {" "}
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-blueEx rounded-md p-3"
        >
          <Textarea
            placeholder="Write a comment..."
            rows="3"
            maxLength="1000"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {(1000 - comment.length).toLocaleString()} characters left
            </p>
            <ButtonOutline title="Submit" type="submit" />
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}
`
2. Then add to the **PostPage.jsx** Fille after the <Div> of the *<CallToAction>* function:
   `<CommentSection postId={post._id} />`
    ** We gather the id because we need to select a post to edit it.
3. Go to **/api/models** and create the file: **comment.model.js**:
   `import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  conent: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: []
  },
  numberOfLikes: {
      type:Number,
      dafault:0
  },
  {timestamps: true}
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;`

4. Go to **/api/routes** and create the file: **comment.routes.js**:
   `import express from "express";
import { verifyToken } from "../utils/verifyUser.util.js";
import { createComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);

export default router;
`
5. Go to **/api/controllers** and create the file: **comment.controller.js**:
   `import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, "You're not allowed to create comments"));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};
`

6. Go to the folder: **/api** and open file: **index.js**:
   - Around line of code 10: `import commentRoutes from "./routes/comment.route.js";`

7. Add a new component to always being to the top of the page:
   - So go to **/client/src/components** and create the file: **ScrollToTop.jsx**
   - Code:
     `import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect{() =>{
        window.scrollTo(0, 0)
    }, [pathname]} // eslint-disable-line react-hooks/exhaustive-deps
    return null;
}

export default ScrollToTop;`
   - The go to the folder **/client/src** and open file **App.jsx**
      * Write on the top the **ScrollToTop** component before the *<BrowserRouter>* tag
        `<ScrollToTop />`
        ** Remember if not auto import: `import ScrollToTop from "./components/ScrollToTop";`
8. Create a Button compoment so that way you don't have to repeat and repeat and repeat the same code everysingle time.
   - Go to **/client/src/components** folder and create file: **Buttons.jsx**
   - Code:
     `import { Button } from "flowbite-react";
import PropTypes from "prop-types";

const ButtonOutline = ({ title, type }) => {
  return (
    <Button
      type={type}
      className="bg-gradient-to-r from-blueEx to-greenEx"
      outline
    >
      {title}
    </Button>
  );
};

ButtonOutline.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  // onClick: PropTypes.func,
  // width: PropTypes.string,
  // loading: PropTypes.bool,
  // padding: PropTypes.string,
  // noIcon: PropTypes.bool
};

export default ButtonOutline;
` 
   - To use the Button simply use:
     `<ButtonOutline title="Submit" />` for example.

## Show the Comments of a Post.
1. For easy understanding close all the tabs you won't need.
2. Go to the folder **/api/routes** and open the file comment.route.js
3. Around line of code 10 write: `router.get("/getPostComments/:postId", getPostComment);`
4. Now create the function so go to **/api/controllers** folder and at the end of the file **comment.controller.js** create te function:
`export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createAt: -1, // To order newst ones
    });
  } catch (error) {
    next(error);
  }
};`
* Don't forget to import it into **cinnebt.route.js** file: `import {createComment, getPostComments,} from "../controllers/comment.controller.js";
4. Create an api roite for getUser, go to folder **/api/routes** and open file **user.route.js**
   - Around line of code 20 add: `router.get("/:userId", getUser); // get user by id`
5. Create the function so go to **/api/controllers** and open the file **userControllers.js**
   - At the end of the file, around line of code 130 add the function:
     `export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
`
   - Remember to import the function into **user.route.js** file: `import { getUser } from "../controllers/user.controller.js";`
6. Instal package on the client side **/client** called **luxon**
   - NPM: `npm i luxon`
   - YARN: `yarn add luxon`
   - import it into **Comment.jsx** file: `import { DateTime } from "luxon";`
7. Go to folder **/client/src/componets** and creta the file **Comment.jsx**
   - Create a RFC (React Functional Component).
   - Import that component into **commentSection.jsx**: `import { Comment } from "../components/Comment";`
   - Write:
     `import { useEffect, useState } from "react";
import { DateTime } from "luxon";

export default function Comment({ comment }) {
  const [user, setUser] = useState({});
  console.log(user); // For testing purposes
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:border-greenEx text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs">
            {user ? `@${user.username}` : "Anonymous User"}
          </span>
          <span text-gray-500 text-xs>
            {DateTime.fromISO(comment.createdAt).toRelative()}
          </span>
        </div>
        <p className="text-gray-500 pb-2 text-justify">{comment.content}</p>
      </div>
    </div>
  );
}
` 
8. Close the backend files and go to **/client/src/comments** and open **commentSection.jsx**
  - Around line of code 10 type: 
    `const [comments, setComments] = useState([]);
     console.log(comments); // For testing purposes
    `
  - Around line of code 40 type:
    `useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);`
  - Around line of code 100 after the closging tag of *<form>* type:
    ` {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments: </p>
            <div className="border border-greenEx py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      )}`

## Add Like Functionality to the Comment Component.
1. Open the folder **/api/routes** and open file: **comment.route.js**
   - Add the route around line of code 10: `router.put("/likeComment/:commentId", verifyToken, likeComment);`
2. Create the controller so open folder **/api/controllers** and the file: **comment.controller.js**
   - At the end of the file around line of code 35:
     `export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1); // userIndex remove the array, that why the number 1.
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
`
   - Remember to import the function into **comment.route.js** file: `import { likeComment } from "../controllers/comment.controller.js";`
3. Go to the front end section **/client/src/components** and open the file **CommentSection.jsx**.
   - Before the *return* around line of code create the function **handleLike**:
   - Add the import: `import { Link, useNavigate } from "react-router-dom";`
   - Then around line of code 15 add : `const navigate = useNavigate();` 
     `const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };`
   - On **Comment.jsx** add: `import { useSelector } from "react-redux";`
   - Around line of code 125 into the **<Comment />** tag add: `onLike={handleLike}`
   - On **/client/src/compoments** open the file: **Comment.jsx** and add:
   - Change: `export default function Comment({ comment })` for: `export default function Comment({ comment, onLike })`
4. On the file **Comment.jsx** around line 40 write:
   - Import: `import { FaThumbsUp } from "react-icons/fa";`
   - `<div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
          <button
            type="button"
            onClick={() => onLike(comment._id)}
            className={`text-gray-400 hover:text-blue-500 ${
              currentUser &&
              comment.likes.includes(currentUser._id) &&
              "!text-blue-500"
            }`}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p className="text-gray-400">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>`

## Add Edit Functionality to the Comment Component.
1. Go to **/api/routes/** folder and open file: **comment.route.js** and add an the end around line of code 15: `router.put("/editComment/:commentId", verifyToken, editComment);`
- Remember to import it on the top: `import { likeComment, editComment } from "../controllers/comment.controller.js";`

2. Open **/api/controllers/** and open file **comment.controller.js** at the en of the file, aronn line of code 60 code:
  `export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You're not allowed to edit this comment"));
    }

    const editComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );
    res.status(200).json(editComment);
  } catch (error) {
    next(error);
  }
};
`
3. Create the **handleEdit** function bedore the return:
   - Around line of code 10 create a piece of state: `const [isEditing, setIsEditing] = useState(false);`
   - Around line of code 10 create another piece of state: `const [editContent, setEditContent] = useState(comment.content);`
   - Create the function arond line of code 20
     `const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };`
   - Around line of code 50 after the time or hours ago tag create the logic for **isEditing**:
     `- `{isEditing ? (
          <>
            <Textarea
              className="mb2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <ButtonInline
                title="Save"
                type="button"
                size="sm"
                onClick={handleSave}
              />
              <ButtonOutline
                title="Cancel"
                type="button"
                size="sm"
                onClick={() => setIsEditing(false)}
                outline
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2 text-justify">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-greenEx font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500 font-semibold"
                    >
                      Delete
                    </button>
                  </>`
4. Go back to the FrontEnd secciont **/client/src/components** and open **Comment.jsx** file and around line of code 60 after the **<p>** tag of the like code:
   `{currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-greenEx font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500 font-semibold"
                    >
                      Delete
                    </button>
`
   
5. Create the Function **handleEdit** on file **CommentSection.jsx** before the return around line of code 90:
   `const handleSave = async (comment, editedContent) => {
    setComents(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };
` 
6. Again on **Comment.jsx** File create the functions **handleSave** around line of code 35:
   `const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };`


  

## Add Delete Functionality to the Comment Section.
1. Close all the tabs so you won't get confussed.
2. Go to **/api/routes** folder and open **comment.route.js** file.
   - Around line of code 15 tipe: `router.delete("/deleteComment/:commentId", verifyToken, editComment);`
   - Remember to import from `deleteComment, import {deleteComment} from "../controllers/comment.controller.js";`
3. So create that function go to **/api/controllers/** and open **comment.controller.js**
   - At the end around line of code 80:
     `export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You're not allowed to delete this comment")
      );
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json({ message: "Comment deleted" });
    }
  } catch (error) {
    next(error);
  }
};`
### Comment.jsx
4. Go to the frontEnd section **/client/src/componets** and on the file **Comment.jsx** it should look like this:
   `<button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500 font-semibold"
                    >
                      Delete
                    </button>
                  </>`
5. Around line of code 10 add to the component at the top. I should look like this:
   `export default function Comment({ comment, onLike, onEdit, onDelete }) {`
### CommentSection.jsx
6. Now on the **CommentSection.jsx** before the return around line of code 95 create the **handleDelete** function:
   - Create a piece of state at the beggining around line of code 15: `const [showModal, setShowModal] = useState(false);`
   - Pass the prop around line of code 160 inside the **<Comment>** tag:
     `onDelete={(commentId) => {
                setShowModal(true);
                setCommentId(commentId);
              }}` 
   - Create another piece of state around line of code 15: `const [commentToDelete, setCommentToDelete] = useState(null);`
   - Create the **<Modal>** you can create it, or copy from *DashPost* (The last modal) and paste or better create a Modal Component to rehutilize the code. You can copy before the last closing **</div>** around line of code 180.
   - `<Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">
              Are you sure to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>`
   * If not autoimport remember to import it: `import { Alert, Modal, Textarea } from "flowbite-react";`
   * Same with the icon: `import { HiOutlineExclamationCircle } from "react-icons/hi";`

## Add Recent Article Section to the Post Page.
1. Close all the open tags we don't need anymore.
2. Go to the FrlontEnd section an open **/client/src/pages** and open the file **PostPage.jsx**.
3. After the **<CommentSeccion>** tab and before the closing **</main>** tag around line of code 80 write:
   `<div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="">
          {
            recentPosts &&
            recentPosts.map((post) => {
              <PostCard key={post._id} post={post} />
            })
          }
        </div>
      </div>`
4. Create another piece of state around line of code 10: `const [recentPosts, setRecentPosts] = useState(null);`
5. Around line of code 40 create another piece of state:
   `useEffect(() => {
    try {
      const fetchRecentPost async () => {
        fetchRecentPost();
        const res = await fetch("/api/post/getposts?limit=3");
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  });` 
6. Go to **/client/src/components** and create the file **PostCard.jsx**
   - Use RFC (React Functional Component) 
   - Remember to Import it into PostPage to make the **<PostCard/>** tag work: `import {PostCard} from "../components/PostCard";`
Probably not necesary check tailwind before install
7. Look up for the [Line-Clamp](https://github.com/tailwindlabs/tailwindcss-line-clamp) plugin. And install it.
   - Via NPM: **npm install -D @tailwindcss/line-clamp**
   - Via Yarn: **yarn add -D @tailwindcss/line-clamp**
   - Make sure to install it on the FrontEnd (Clien Side)
8. Go to the folder **/client/** open **tailwind.conf.js** file and add into the plugins: `require('@tailwindcss/line-clamp'),` 

**<PostCard>** Should look like this:
mport { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full border border-blueEx hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="Post Cover"
          className="h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-greenEx text-greenEx hover:bg-blueEx hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
        >
          Read Article
        </Link>
      </div>
    </div>
  );
}

On PostPage.jsx should look like this around line of code 90:
 <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="flex flex-wrap gap-5 mt-5">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}


## Add Comments Section to the Admin Dashboard.
1. Create the api route so go to **/api/routes/** and on **comment.route.js** add: `router.get("/getcomments", verifyToken, getComments);`
2. Create the function on **/api/controllers** file **comments.controller.js** and at the end add the code:
   `export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, "You're not allowed to see comments"));

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: {
        $gte: oneMonthAgo,
      },
    });
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(error);
  }
};
`
  * Remember to import it into **comment.route.js**: `import { getComments } from "../controllers/comment.controller.js"; `
3. Go to **/client/src/components/**  and create the file **DashComments.jsx**
   - Use the RFC (React Functional Component).
     `export default function DashComments() {
  return <div>DashComments</div>;
}
`
4. Now go to **/client/src/pages** open **Dashboard.jsx** and add around line of code 30:
   - `{/* Comments */}
      {tab === "comments" && <DashComments />}`
   - Remember if not auto import do it: `import DashComments from "../components/DashComments";`
5. Now Copy the code from DashUser and paste into DashComments. Maybe later we can implemente a component of this too.
   - Code should look like this:
   `import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Modal } from "flowbite-react";
import { CiCircleRemove } from "react-icons/ci";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  // console.log(comments); // For testing purposes.
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
        //console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchComments();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setcoments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="text-red-700 text-2xl hover:text-3xl cursor-pointer"
                    >
                      <CiCircleRemove />
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blueEx font-semibold self-center text-sm py-7 hover:text-greenEx"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p> You have no comments yet!!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
`
6. Add the item inside the side bar. Go to **/client/src/components** and open file **DashSidebar.jsx** and code:
   - After the User **<Sidebar.item>** add:
     `</Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>` 
   - Remember to put User and Comments inside empty tags **<></>**
   - Also if not auto import theHiAnnotation do it: `import{ HiAnnotation} from "react-icons/hi";`

## Add Dashboard Overview to the Admin Dashboard.
1. Close all the tabs, if any, you won't need.
2. Go to **/client/src/components** and create file: **DashboardComp.jsx**
   - Open it and create a RFC (React Functional Component).
3. Open **/client/src/pages** folder and file **Dashboard.jsx**
   - Add the **<DashboardComp>** component around line of code 35: `{tab === "dash" && <DashboardComp />}`
   - Remember if not auto import do it: `import DashboardComp from "../components/DashboardComp";`
4. DashboardComp should look like this:
   `import { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import ButtonEx from "./Buttons";
import { Table } from "flowbite-react";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPost] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPost(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        {/* Users */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md dark:shadow-md dark:ring-1 dark:ring-white dark:ring-opacity-10">
          <div className="flex justify-between items-center">
            <div className="">
              <h3 className="text-gray-500 text-lg font-semibold">
                Total Users
              </h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-blue-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-greenEx flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>

        {/* Comments */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md dark:shadow-md dark:ring-1 dark:ring-white dark:ring-opacity-10">
          <div className="flex justify-between items-center">
            <div className="">
              <h3 className="text-gray-500 text-lg font-semibold">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-yellow-300 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-greenEx flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>

        {/* Post */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md dark:shadow-md dark:ring-1 dark:ring-white dark:ring-opacity-10">
          <div className="flex justify-between items-center">
            <div className="">
              <h3 className="text-gray-500 text-lg font-semibold">
                Total Posts
              </h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-purple-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-greenEx flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        {/* Users */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            {/* We use flex to put next to each other */}
            <h1 className="text-center p-2">Recent Users</h1>
            <ButtonEx
              title="See All"
              to="/dashboard?tab=users"
              outline
            ></ButtonEx>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="flex items-center">
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* Comments */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            {/* We use flex to put next to each other */}
            <h1 className="text-center p-2">Recent Comments</h1>
            <ButtonEx
              title="See All"
              to="/dashboard?tab=comments"
              outline
            ></ButtonEx>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comments Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* Posts */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            {/* We use flex to put next to each other */}
            <h1 className="text-center p-2">Recent Posts</h1>
            <ButtonEx
              title="See All"
              to="/dashboard?tab=posts"
              outline
            ></ButtonEx>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="flex items-center">
                      <img
                        src={post.image}
                        alt="Post-Image"
                        className="w-10 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96 ">{post.title}</Table.Cell>
                    <Table.Cell className="w-5">{post.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
`
5. Now go to **/client/src/components** and open **DashSidebar.jsx**
   - Around line of code 50 after the **<Sidebar.ItemGroup>** tag add:
     `{currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                // label="Dashboard"
                // labelColor="dark"
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}`

## Complete the Home Page.
1. Close all the tabs yow won't need for better readibility.
2. Go to **/client/src/pages** and open **Home.jsx**
3. Final code should see like this:
   `import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to Excel Solutionsv Blog
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you can find a variety of Excel topics from General to a more
          specific topics like accounting, data analysis, and mucho more!
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-blueEx font-bold hover:text-greenEx"
        >
          View all Post
        </Link>
      </div>
      <div className="p-3 bg-gray-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Post</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg font-semibold text-greenEx hover:text-blueEx text-center"
            >
              View all Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
`

## Complete Search Page.
1. Close the tabs you won't need.
2. Go to **/client/src/componets** and open the **Header.jsx** file.
3. Add a piece of state aroun line of code 20: 
   - `const [searchTerm, setSearchTerm] = useState("");`
   - Also add: `const path = useLocation().pathname;`
4. Around line of code 25 add an **useStete**
   - Should look like this:
5. Go to **/client/src/pages** and create the file **Search.jsx**
   - Add the RFC (React Functional Component):
     `export default function Search() {
  return <div>Search</div>;
}`
6. Go to **/client** and open file **App.jsx**
   - Around line of code 25 add: `<Route path="/search" element={<Search />} />`
   - If not auto import do it: `import Search from "./pages/Search";`
7. Comming back to the **Header.jsx** file around line of code 70 after the className add:
   `value={searchTerm}
   onChange={(e) => setSearchTerm(e.target.value)}`
  - Also in the **<form>** tag add an *onSubmit* event around line of code 65:
    `onSubmit={handleSubmit}`
8. Before the return add the **handleSubmit** function:
   - Around line of code 10 change `import { Link, useLocation } from "react-router-dom";` for `import { Link, useLocation, useNavigate } from "react-router-dom";`
   - Then import it around line of code 20: `const navigate = useNavigate();` 
   `const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };`
9. Go to the backend section **/api/controllers** and open **post.controller.js** and add the code at the end of the page around line of code:
    `export const getCategories = async (req, res, next) => {
  try {
    const categories = await Post.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch categories"));
  }
};`
10.  Next go to the **/api/routes** open file **post.route.js** and add aound line of code 15:
    `router.get("/categories", getCategories);`
11.  Go back to **/client/src/pages** open **Search.jsx** file and complete it the 
  `import { Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonEx from "../components/Buttons";
import PostCard from "../components/PostCard";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [categories, setCategories] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({
        ...sidebarData,
        sort: order,
      });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({
        ...sidebarData,
        category,
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/post/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-blueEx">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Search Term */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            {/* whitespace-nowrap. To keep the text in the same line */}
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
          <ButtonEx title="Apply Filters" type="submit" outline />
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-greenEx p-3 mt-5">
          Posts Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-greenEx text-lg hover:text-blueEx p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
`

## Complete About and Projects Pages.
1. Close all the tabs yow won't need.
2. Go to the front end section **/client/src/pages** and open **About.jsx** page:
`export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font-semibold text-center my-7">
            Excel SolutionsV Blog.
          </h1>
          <div className="text-md text-gray-500 flex flex-col text-justify gap-6">
            <p className="">
              Welcome to Excel SolutionsV, your ultimate destination for all
              things related to Microsoft Excel! Our blog is dedicated to
              bringing you the latest news, comprehensive exercises, and
              practical examples that cater to data-entry professionals,
              accountants, and anyone looking to harness the full potential of
              Excel. Whether you are a beginner or an advanced user, our content
              is designed to help you improve your skills and streamline your
              workflow with the most popular spreadsheet software in the world.
            </p>
            <p className="">
              At Excel SolutionsV, we understand the importance of efficiency
              and accuracy in data management. That’s why we offer a wide range
              of tutorials and guides on various Excel functionalities, from
              basic data entry techniques to complex accounting formulas. Our
              blog features detailed articles on creating and using macros,
              which can save you valuable time by automating repetitive tasks.
              We also provide insights into advanced Excel features such as
              pivot tables, VLOOKUP, and conditional formatting, ensuring that
              you stay ahead of the curve in your professional endeavors.
            </p>
            <p className="">
              Join our community of Excel enthusiasts and experts who share a
              passion for mastering this powerful tool. At Excel SolutionsV, we
              are committed to delivering high-quality, actionable content that
              will help you excel in your career. Whether you are looking for
              tips to enhance your productivity, solutions to specific problems,
              or inspiration for your next Excel project, our blog has something
              for everyone. Stay tuned for regular updates, expert advice, and a
              wealth of resources that will make your Excel experience more
              effective and enjoyable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
`
3. Now go to the **Projects.jsx** page and:
   `import CallToAction from "../components/CallToAction";

export default function Projects() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="text-md text-gray-500 text-justify">
        At Excel SolutionsV, you can embark on exciting projects that enhance
        your learning experience, such as creating dynamic dashboards,
        automating financial reports with macros, designing interactive data
        entry forms, and building complex financial models. These hands-on
        projects not only solidify your understanding of Excel's functionalities
        but also equip you with practical skills to tackle real-world tasks
        efficiently.
      </p>
      <CallToAction />
    </div>
  );
}
`

## Deploy to Render.
1. Close all the tabs you won't need.
2. Go to the **/** root directory it is the same where the **/api** directory is and open file **package.json**.
3. Go to script section and add at the end the following script to deploy the front and back end together:
   - Via **NPM** `"build": "npm install && npm install --prefix client && npm run build --prefix client",`
   - Via **YARN** `"build": "yarn install && yarn --cwd client install && yarn --cwd client build",`
4. Now go to **/api** folder and open **index.js** file and add in order to get the current directory:
   - Around line of code 10 add: `import path from "path";`
   - Then around line of code 20 before the `const app = express();` add: `const __dirname = path.resolve(); // This is for getting the current directory no mather where it is`
   - In order to see the FrontEnd pages add around line of code 40: `// Static pages of the FrontEnd
app.use(express.static(path.join(__dirname, "/client/build"))); // Use build for React. Use dist for Vite`
5. Now you can search in Google [Render](https://render.com/) or simply hit the hyperlink.
   - Go to Dashboard. If not registered do it in **Get Started**. You can do it with your Google Account or **GitHub**. 
   - Add a new project by hitting **New** of if first time simply hit **Web Services**
   - We're going to render from Git Repository:
     * Select All the repositories that way you can choose one or more for future projects.
     * Select the project you want to render in the source code.
     * Name: Write a name. Ex. Excel SolutionsV Blog
     * Language: In this case node.
     * Branch: main
     * Region: Choose the closest region to the audience. In this case Oregon.
     * Root Directory: Since we did it on the **index.js** file leave in blank
     * Build Command: Since we used **yarn** you can use: `yarn run build` if you're using **npn** `npn run build`
     * Start command: **yarn** yarn start or **npn** npn start.
6. Remeber the enviromental variables:
   * JWT_SECRET
   * MongoDB
   * VITE_FIREBASE_API_KEY

7. If render on Netlify don't forger to add the Enviromental Variable:
   * `NETLIFY_NEXT_PLUGIN_SKIP = TRUE`
   * Create on the root directory a file called **netlify.toml**
     `[build]
      command = "npm run build"
      publish = "client/dist"  # The correct directory for your Vite build output

      [environment]
      NETLIFY_NEXT_PLUGIN_SKIP = "true"  # Explicitly disable the Next.js plugin

      [[redirects]]
      from = "/*"
      to = "/index.html"
      status = 200`



**Custom NavBar with Flowbite - This is Done and worked**
1. `import { Link, useLocation } from "react-router-dom";
import { Navbar } from "flowbite-react";

function CustomNavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeClassName = isActive ? "text-red-500" : "text-gray-900";

  return (
    <Navbar.Link className={activeClassName} as="div">
      <Link to={to}>{children}</Link>
    </Navbar.Link>
  );
}

export default CustomNavLink;`
2. `import CustomNavLink from "./CustomNavLink";
   <CustomNavLink to="/">Home</CustomNavLink>
        <CustomNavLink to="/about">About</CustomNavLink>
        <CustomNavLink to="/projects">Projects</CustomNavLink>
  `

## Fixed Header.
1. Create on **/client/src/components** file **HeaderLayot** to prevent that the header overlaps the page content:
   `import { useEffect, useRef, useState } from "react";
import Header from "./Header";

const HeaderLayout = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <div>
      <div ref={headerRef} className="fixed top-0 w-full z-50">
        <Header />
      </div>
      <div style={{ marginTop: headerHeight }}>{children}</div>
    </div>
  );
};

export default HeaderLayout;
`
2. Go to the **/client/src** and open **App.jsx** file and add the **<HeaderLayout>** tag.
   - This is a sample of how it will looks:
      `return (
    <BrowserRouter>
      <ScrollToTop />
      <HeaderLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route path="/projects" element={<Projects />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
        </Routes>
      </HeaderLayout>
      <Footer />
    </BrowserRouter>` 

# Revision Code:
## CreatePost.jsx
1. Around line of code 20 changed: ` const [formData, setFormData] = useState({});` to ` const [formData, setFormData] = useState({ title: "", category: "", content: "", });`
2. Around line of code 30 Added: `const [errors, setErrors] = useState({});`
3. After the useNavigate around line of code 30 added the function:
   `const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.content) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };` 
4. Around line of code after the preventDefault on **HandleSubmit** add: `if (!validate()) return;` 
5. In the form around line of code 115 after className add: `value={formData.title}`
   - After the closing tag ot  around line of code 120 Title add: `{errors.title && <span className="text-red-500">{errors.title}</span>}`
6. In the form around line of code 120 after className add: `value={formData.category}`
   - After the closing tag ot <Select> around line of code 140 add: `{errors.category && <span className="text-red-500">{errors.category}</span>}`
7. After the closing tag ot **React-Quill** around line of code 195 add: `{errors.content && <span className="text-red-500">{errors.content}</span>}`

## UpdatePost.jsx
Do the same **than CreatePost.jsx**
1. Around line of code 20 changed: ` const [formData, setFormData] = useState({});` to ` const [formData, setFormData] = useState({ title: "", category: "", content: "", });`
2. Around line of code 30 Added: `const [errors, setErrors] = useState({});`
3. before the return around line of code 120 added the function:
   `const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.content) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };` 
4. Around line of code 93 after the preventDefault on **HandleSubmit** add: `if (!validate()) return;` 
5. After the closing tag ot  around line of code 145 Title add: `{errors.title && <span className="text-red-500">{errors.title}</span>}`
6. After the closing tag of <Select> around line of code 165 add: `{errors.category && <span className="text-red-500">{errors.category}</span>}`
7. After the closing tag ot **React-Quill** around line of code 220 add: `{errors.content && <span className="text-red-500">{errors.content}</span>}`


## Creation of <CategoriesSelect> Funtion. 
1. In order to rehutilize the options in **CreatePost/UpdatePost** lets create a component.
2. Go to **/client/src/components** and create <CategoriesSelect> component:
   `import { Select } from "flowbite-react";

const CategoriesSelect = ({ value, onChange }) => (
  <Select value={value} onChange={onChange}>
    <option value="uncategorized">Select a category</option>
    <option value="formulas">Formulas and Functions</option>
    <option value="data-entry">Data Entry</option>
    <option value="data-analysis">Data Analysis</option>
    <option value="data-visualization">Data Visualization</option>
    <option value="collaboration">Collaboration and Security</option>
    <option value="contable">Excel para Contadores</option>
    <option value="automation">Automation</option>
    <option value="add-ins">Add-in and Extensions</option>
    <option value="printing">Printing and Sharing</option>
    <option value="accessibility">Accessibility</option>
    <option value="macros">Macros</option>
    <option value="python">Python</option>
  </Select>
);

export default CategoriesSelect;
`
3. Go to **CreatePost.jsx** page:
   - Add the import: `import CategoriesSelect from "../components/CategoriesSelect";`    
   - Change: `<Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="formulas">Formulas and Functions</option>
            ...
            ...
            ...
            <Select/>
            `
     to: ` <CategoriesSelect
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />`
4. Do the same in the file **UpdatePost.jsx** you have to change the same lies of code.

## Update the Header to make it take the user dark/light theme.
1. Go the **/client/scr/components** and open **Header.jsx** file.
2. Crete the function **getSystemThemePreference** before the return:
   `const getSystemThemePreference = () => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  };`
3. Around line of code 20 modify the userEffect from:
   `useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);`
  To:
  `
   useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

    // Theme Detection
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => {
      dispatch(setTheme(getSystemThemePreference()));
    };

    mediaQuery.addListener(handleThemeChange);
    return () => mediaQuery.removeListener(handleThemeChange);
  }, [location.search, dispatch]);
  `
4. Now around line of code 110 change the button from:
   `
   <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
   `
   To:
   `
   <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <FaSun />
          ) : theme === "dark" ? (
            <FaMoon />
          ) : (
            <FaDesktop />
          )}
        </Button>
   `
   * If the <FaDesktop /> icon won't auto import add it into the import: `import { FaDesktop, FaMoon, FaSun } from "react-icons/fa";`

5. Go to **/client/src/redux/theme** and open the file themeSlice.js.
   Change from:
   `
   import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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

export default themeSlice.reducer;
   `
   To:
   `
   import { createSlice } from "@reduxjs/toolkit";

const getSystemThemePreference = () => {
  if (
    window.matchMedia &&
    Window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const initialState = {
  theme: "system",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      if (state.theme === "system") {
        state.theme = "light";
      } else if (state.theme === "light") {
        state.theme = "dark";
      } else {
        state.theme = "system";
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
   `
6. Modify the `import { toggleTheme, setTheme } from "../redux/theme/themeSlice"`; to `import { toggleTheme, setTheme } from "../redux/theme/themeSlice";` from **/client/src/componets/Header.jsx**
   
## Fix the white cap in the Header.
1. Go to **/client/src/components** and open **HeaderLayout.jsx** and change:
   `
    import { useEffect, useRef, useState } from "react";
import Header from "./Header";

const HeaderLayout = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <div>
      <div ref={headerRef} className="fixed top-0 w-full z-50">
        <Header />
      </div>
      <div style={{ marginTop: headerHeight }}>{children}</div>
    </div>
  );
};

export default HeaderLayout;
   `
   To:
   `
    import { useEffect, useRef, useState } from "react";
import Header from "./Header";

const HeaderLayout = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    // Add resize listener to update header height if window size changes
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <div
        ref={headerRef}
        className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        <Header />
      </div>
      <div className="flex-grow" style={{ marginTop: `${headerHeight}px` }}>
        {children}
      </div>
    </div>
  );
};

export default HeaderLayout;
   `

2. Now open file **Header.jsx** and around line of code 75 change:
   `Navbar className=" border-b-2 ">`
   to:
   `<Navbar className=" border-b-2 bg-white dark:bg-gray-900 transition-colors duration-300">`  

## Updating the UpdatePost.jsx file.

1. Add validations in the form, that way we ensure that the user fill all the form.

Change:

`
return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          {/* <TextInput type="text" placeholder="Author" required /> */}
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
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
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            className="bg-gradient-to-r from-greenEx to-blueEx "
            outline
            size="sm"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0} %`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded Image"
            className="w-full h-72 object-cover"
          />
        )}

        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Create a story..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-greenEx to-blueEx hover:from-blueEx hover:to-greenEx"
          required
        >
          Update!!
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
        <CustomReactQuill />
      </form>
    </div>
  );
}
`

To
`
export default function UpdatePost() {
  // ... all your existing state declarations and useEffect ...

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      {isLoading ? (
        <div className="text-center">
          <Spinner size="xl" />
          <p>Loading post data...</p>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title}
            />
            {errors.title && <span className="text-red-500">{errors.title}</span>}
            <Select
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              value={formData.category}
            >
              {/* ... your options ... */}
            </Select>
            {errors.category && (
              <span className="text-red-500">{errors.category}</span>
            )}
          </div>
          {/* ... rest of your form elements ... */}
          <CustomReactQuill
            value={formData.content || ""}
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
          />
          {errors.content && (
            <span className="text-red-500">{errors.content}</span>
          )}
          <Button
            type="submit"
            className="bg-gradient-to-r from-greenEx to-blueEx hover:from-blueEx hover:to-greenEx"
            required
          >
            Update!!
          </Button>
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}
`

2. Change the useEffect to fecth the data correctly (Solving the issue with the Category)
`
useEffect(() => {
    try {
      const fetchPost = async () => {
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
         if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error);
    }
`
To:

`
useEffect(() => {
  const fetchPost = async () => {
    try {
      setIsLoading(true); // Set loading to true when starting to fetch
      setPublishError(null);
      const res = await fetch(`/api/post/getposts?postId=${postId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch post");
      }

      // Update state in separate microtasks to avoid potential blocking
      setTimeout(() =>
        setFormData((prevState) => ({
          ...prevState,
          title: data.posts[0].title,
        }))
      , 0);
      setTimeout(() =>
        setFormData((prevState) => ({
          ...prevState,
          category: data.posts[0].category,
        }))
      , 0);
      setTimeout(() =>
        setFormData((prevState) => ({
          ...prevState,
          image: data.posts[0].image,
        }))
      , 0);

      // Debounce content update for large texts
      const debounceContent = setTimeout(() => {
        setFormData((prevState) => ({
          ...prevState,
          content: data.posts[0].content,
        }));
        setIsLoading(false); // Set loading to false after all data is set
      }, 100); // Adjust timeout as needed

      return () => clearTimeout(debounceContent);
    } catch (error) {
      console.error("Error fetching post:", error);
      setPublishError(error.message);
      setIsLoading(false); // Make sure to set loading to false even if there's an error
    }
  };

  fetchPost();
}, [postId]);
`

3. Changing the handleSubmit to upload the post without any error from:
`
const handleSubmit = async (e) => {
    e.preventDefault(); // To prevent reflesing the page
    if (!validate()) return;

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(/post/${data.slug});
      }
    } catch (error) {
      setPublishError("Something went wrong!!");
    }
  };
`

To:
`const handleSubmit = async (e) => {
  e.preventDefault(); // To prevent refreshing the page
  if (!validate()) return;

  try {
    const res = await fetch(
      `/api/post/updatepost/${postId}/${currentUser._id}`, // Use postId instead of formData._id
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      setPublishError(data.message);
      return;
    }
    if (res.ok) {
      setPublishError(null);
      navigate(`/post/${data.slug}`);
    }
  } catch (error) {
    setPublishError("Something went wrong!!");
  }
};
`

* Check the toggle in the post.
* Check the posibility of English/Spanish and choose the language according to the system, if there's another lenguage select English.

## Installing React-Helmet-Async for dynamic meta data
1. Install React Helmet:
   - Via **npm**: npm install react-helmet-async
   - Via **yarn**: yarn add react-helmet-async
2. Go to **PostPage.jsx** and add:
   - Add the library around line of code 10:
     `
     import { Helmet } from "react-helmet-async";
     ` 
   - Around line of code 65:
     `
     const getMetaDescription = (content) => {
      // Strip HTML tagas and get first 160 characters
      return content.replace(/<[^>]*>?/gm, "").substring(0, 160);
    };
    `
    - Then around line of code 70: before the **<h1>** tag add:
    `
    (
        <Helmet>
          <title>{post.title} | Excel SolutionsV Blog</title>
          <meta name="description" content={getMetaDescription(post.content)} />
          <meta property="og:title" content={post.title} />
          <meta
            property="og:description"
            content={getMetaDescription(post.content)}
          />
          <meta property="og:image" content={post.image} />
          <meta
            property="og:url"
            content={`https://blog.excel-solutionsv.com/post/${post.slug}`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.title} />
          <meta
            name="twitter:description"
            content={getMetaDescription(post.content)}
          />
          <meta name="twitter:image" content={post.image} />
        </Helmet>
      )}
    `
3. On **UpdatePage.jsx**
   -Around line code 20:
   `
   import { Helmet } from "react-helmet-async";
   `
   - Around line code 170 before the **<h1>** tag add:
   `
   <Helmet>
        <title>
          {formData.title ? `Update: ${formData.title}` : `Update Post}`} |
          Excel SolutionsV Blog
        </title>
        <meta
          name="description"
          content={`Update blog post: ${formData.title}`}
        />
      </Helmet>
    `
4. On **CreatePage.jsx**
   - Around line code 20:
   `
   import { Helmet } from "react-helmet-async";
   `
   - Around line of code 110 before the **<h1>** tag add:
     `
     <Helmet>
        <title>Create a New Post | Excel SolutionsV Blog</title>
        <meta
          name="description"
          content="Create a new blog post for Excel SolutionsV Blog"
        />
      </Helmet>
     ` 

## Upload to Hostinger VPS
1. Setup NodeJS.
   - First of all check if you have via `node -v` and `npm -v`
   - Then `curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -`
   - Install it `yum install -y nodejs`
2. Create the files
   - Create the web page directory ex. `mkdir /var/www/my-webpage`
   - Navigate to your web page ex. `cd /var/www/my-webpage`
2. After that compile the site with `npm run build`

## Biblography
* https://www.youtube.com/watch?v=Kkht2mwSL_I&t=117s - "Source Code - Video"
* https://github.com/sahandghavidel/mern-blog - "Github Source Code"
* https://www.markdownguide.org/cheat-sheet/ - Markdown cheatsheet
* https://levelup.gitconnected.com/display-images-in-react-8ff1f5b1cf9a - Displays Images
* https://nerdcave.com/tailwind-cheat-sheet - Tailwind CheatSheet
* https://tailwindcss.com/docs/customizing-colors - Custom Colors in Tailwind
* https://usbrandcolors.com/
* https://www.npmjs.com/package/tailwind-scrollbar
* https://react-icons.github.io/react-icons/