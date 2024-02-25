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

# Biblography
* https://www.youtube.com/watch?v=Kkht2mwSL_I&t=117s - "Source Code"
* https://www.markdownguide.org/cheat-sheet/ - Markdown cheatsheet
* https://levelup.gitconnected.com/display-images-in-react-8ff1f5b1cf9a - Displays Images
* https://nerdcave.com/tailwind-cheat-sheet - Tailwind CheatSheet
* https://tailwindcss.com/docs/customizing-colors - Custom Colors in Tailwind