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
