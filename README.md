# eco-planner
A tool intended to help planning actions to achieve local environmental goals

## Setup
This tool requires the following environment variables to be set:
- `IRON_SESSION_PASSWORD`: Should be a string at least 32 characters long. This is used to encrypt the session cookie from the Iron Session library.
- `DATABASE_URL`: Should be a connection string to a database. This is used by Prisma to connect to the database. The default configuration expects a MySQL database but this can be changed in the `prisma/schema.prisma` file.

1. Install dependencies with `yarn install`
2. Depending on which database you're connecting to, do one of the following:
    - If you're working against the dev database, run `yarn prisma migrate dev` to apply the migrations to the database.
    - If you're working against the production database, run `yarn prisma migrate deploy` to apply the migrations to the database. (This should be done as part of the deployment process.)

Now you should be able to run the app with `yarn dev` and access it at http://localhost:3000 or build it with `yarn build` and run it with `yarn start`.

Please run `git update-index --skip-worktree src/lib/LEAPList.json` to prevent git from tracking changes to the LEAPList.json file as this file is regenerated every build.
If you for some reason need to update the default LEAPList.json file, run `git update-index --no-skip-worktree src/lib/LEAPList.json` to allow git to track changes to the file again.

## Backend notes
We use the function unstable_cache from Next.js, which currently returns cached `Date`s in stringified form (See this [GitHub issue](https://github.com/vercel/next.js/issues/51613)). Remember to always create a `new Date()` from the date value whenever you use one, until this problem is fixed.


## Components

### Generic components
Generic components are components whose functionality is not tied to this project. They are independently redistributable and function on their own within other next.js projects without any dependancies. Examples include the [attributedImage.tsx component](/src/components/images/attributedImage.tsx) or the [header.tsx](/src/components/header/header.tsx) component. 

All generic components are located within the [generic folder.](/src/components/generic)

### Project specific components
Project specific components are located directly under the [components folder.](/src/components/) Theese are components which are dependent on this projects structure in order to function. This may include files such as [goals.tsx](/src/components/tables/goals.tsx) which are dependant on the `Roadmap` type.

***Component folder structure***
```
└── components/
    ├── projectSpecificComponent/
    │   ├── projectSpecificComponent.tsx
    │   └── projectSpecificComponent.module.css
    └── generic/
        ├── genericComponent/
        │   ├── genericComponent.tsx
        │   └── genericComponent.module.css
        └── GenericComponentGroup/
            ├── genericComponent1
            ├── genericComponent2
            ├── genericComponent3
            └── genericComponentGroup.module.css
```

## CSS

There are 3 different ways of writing css for this project: [Semantic Style Sheets](#semanticstylesheets), [CSS Modules](#cssmodules) and [Global CSS](#globalcss). 

> **<span style="color:#4169E1;">🛈</span> Note**
>
> Global CSS and Semantic Style Sheets use kebab-case but CSS Modules use camelCase.

<div id="semanticstylesheets"></div>

### Semantic Style Sheets 
This project uses a custom made version of [Semantic Style Sheets v.0.0.1](https://github.com/Axelgustavschnurer/semantic-style-sheets) to add commonly used utility classes. The code for this can be located within [/src/styles/utility.css.](/src/styles/utility.css) 

<TODO remove this and replace with site docs when those are added >
<details>
<summary>Utility Classes</summary><br/>

```css
.display-flex {
    display: flex;
}

.display-grid {
    display: grid;
}

.flex-direction-row {
    flex-direction: row;
}

.flex-direction-column {
    flex-direction: column;
}

.flex-wrap-wrap {
    flex-wrap: wrap;
}

.align-items-flex-start {
    align-items: flex-start;
}

.align-items-center {
    align-items: center;
}

.align-items-flex-end {
    align-items: flex-end;
}

.align-items-space-between {
    align-items: space-between;
}

.align-items-space-evenly {
    align-items: space-around;
}

.align-items-space-evenly {
    align-items: space-evenly;
}

.justify-content-flex-start {
    justify-content: flex-start;
}

.justify-content-center {
    justify-content: center;
}

.justify-content-flex-end {
    justify-content: flex-end;
}

.justify-content-space-between {
    justify-content: space-between;
}

.justify-content-space-evenly {
    justify-content: space-around;
}

.justify-content-space-evenly {
    justify-content: space-evenly;
}

.flex-grow-25 {
    flex-grow: .25;
}

.flex-grow-50 {
    flex-grow: .5;
}

.flex-grow-75 {
    flex-grow: .75;
}

.flex-grow-100 {
    flex-grow: 1;
}

.gap-25 {
    gap: .25rem;
}

.gap-50 {
    gap: .5rem;
}

.gap-75 {
    gap: .75rem;
}

.gap-100 {
    gap: 1rem;
}

.gap-200 {
    gap: 2rem;
}

.gap-300 {
    gap: 3rem;
}

.gap-400 {
    gap: 4rem;
}

.gap-500 {
    gap: 5rem;
}

.margin-25 {
    margin: .25rem;
}

.margin-50 {
    margin: .5rem;
}

.margin-75 {
    margin: .75rem;
}

.margin-100 {
    margin: 1rem;
}

.margin-200 {
    margin: 2rem;
}

.margin-300 {
    margin: 3rem;
}

.margin-400 {
    margin: 4rem;
}

.margin-500 {
    margin: 5rem;
}

.margin-y-25 {
    margin: .25rem 0;
}

.margin-y-50 {
    margin: .5rem 0;
}

.margin-y-75 {
    margin: .75rem 0;
}

.margin-y-100 {
    margin: 1rem 0;
}

.margin-y-200 {
    margin: 2rem 0;
}

.margin-y-300 {
    margin: 3rem 0;
}

.margin-y-400 {
    margin: 4rem 0;
}

.margin-y-500 {
    margin: 5rem 0;
}

.margin-x-25 {
    margin: 0 .25rem;
}

.margin-x-50 {
    margin: 0 .5rem;
}

.margin-x-75 {
    margin: 0 .75rem;
}

.margin-x-100 {
    margin: 0 1rem;
}

.margin-x-200 {
    margin: 0 2rem;
}

.margin-x-300 {
    margin: 0 3rem;
}

.margin-x-400 {
    margin: 0 4rem;
}

.margin-x-500 {
    margin: 0 5rem;
}

.padding-25 {
    padding: .25rem;
}

.padding-50 {
    padding: .5rem;
}

.padding-75 {
    padding: .75rem;
}

.padding-100 {
    padding: 1rem;
}

.padding-200 {
    padding: 2rem;
}

.padding-300 {
    padding: 3rem;
}

.padding-400 {
    padding: 4rem;
}

.padding-500 {
    padding: 5rem;
}

.padding-y-25 {
    padding: .25rem 0;
}

.padding-y-50 {
    padding: .5rem 0;
}

.padding-y-75 {
    padding: .75rem 0;
}

.padding-y-100 {
    padding: 1rem 0;
}

.padding-y-200 {
    padding: 2rem 0;
}

.padding-y-300 {
    padding: 3rem 0;
}

.padding-y-400 {
    padding: 4rem 0;
}

.padding-y-500 {
    padding: 5rem 0;
}

.padding-x-25 {
    padding: 0 .25rem;
}

.padding-x-50 {
    padding: 0 .5rem;
}

.padding-x-75 {
    padding: 0 .75rem;
}

.padding-x-100 {
    padding: 0 1rem;
}

.padding-x-200 {
    padding: 0 2rem;
}

.padding-x-300 {
    padding: 0 3rem;
}

.padding-x-400 {
    padding: 0 4rem;
}

.padding-x-500 {
    padding: 0 5rem;
}

```

</details>

<div id="cssmodules"></div>

### CSS modules
In some areas there is a larger requirement to have more complicated styling, which usually isn't suitable for [Semantic Style Sheets](https://github.com/Axelgustavschnurer/semantic-style-sheets). For this usecase we define custom classes within [CSS modules](https://github.com/css-modules/css-modules). A page, component or group of components should have an accompanying css module file for this case. The CSS module stylesheet should be named after the file or group of files, which it belongs to.

> **<span style="color:#4169E1;">🛈</span> Note**
>
> CSS modules use camelCase instead of kebab-case.

#### Setup CSS module
1. Create file `component.tsx`
```jsx
export default function Component() {
    return (
        <p>Hello World!<p>
    )
}
```

2. Create file `component.module.css`
```css
.componentStyling {
    color: red;
}
```
3. Import `component.module.css` to `component.tsx`
```jsx
import styles from './component.module.css'

export default function Component() {
    return (
        <p>Hello World!<p>
    )
}
``` 

4. Add the styling to the `component.tsx` component 

```jsx
import styles from './styles.module.css'

export default function Component() {
    return (
        <p className={styles.componentStyling}>Hello World!<p>
    )
}
``` 

<div id="globalcss"></div>

### Global CSS

> **<span style="color:red;">⚠</span> Warning**
>
> *Using global styling often leads to css files which are difficult to read and maintain. It may also cause specificity problems. Ensure that your decision to use global styling is well thought through.*

This project contains a [global.css](/src/styles/global.css) file to style  elements which should have a consistent appearance across the application. This may for example include buttons or forms. The file also contains variables for colors, contained within the css `:root{}` element.

## Styling

### Color Palette
![Color Palette](/public/images/palette.png "Color Palette")
