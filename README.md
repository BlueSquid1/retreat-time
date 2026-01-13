# Retreat Time
Retreat time is the app for Yogis that are doing a multi session mediatation. It is like the clock app but tailored for people that are doing a full day of mediatation and don't want the distraction of needing to check their phone to see the time.

# Folder Structure
frontend - contains the User Interface logic and 95% of the busness logic specific for the Retreat Time app (e.g. how Alarms should be scheduled, what sound should happen with they go off).
frontend/package.json - this file contains all the typescript libraries and the command to translate the code (typescript and tsx files) into a format that web browsers can understand (javascript and html).
frontend/src/index.html - this is the entry point for the web application. Every other source code file is included into this file either dirrectly or through files of files includes.
frontend/src/App.tsx - this file is responsible for constructing the Presenter, Model and all Views. See rest of README.md for more on Model View Presenter (MVP).
android - contains the configuration needed to build a Android app and the remaining 5% of logic that is specific to just Android phones such as registering alarms events with the Android OS. Most of the files in this folder have not be modified from a new Android project.
android/app/src/main/java/com/example/retreattime/MainActivity.kt - The only file that has been significantly modified. It contains the logic to run the rest of the code in the native web browser.
build.sh - contains logic so that setting up, building or running the app is a one line command.

# Getting started
The quickest and easiest way to start is to just build and run the frontend via the command `./build.sh frontend`. This will translate the Typescript/Typescript XML (TSX) in the folder `./frontend/src/*` into Javascript and HTML respectively. The output files are placed in `./build/frontend/`.

If you want intellisense with your local VSCode run this command once `./build.sh setup_dev`

However to build a native binary for Android (also known as a .apk file) you can run `./build.sh all`. The output files for android are placed in `./build/android/`

## Why Typescript and TSX?
Web browsers only understand Javascript and HTML files but Typescript and TSX are easier for humans to work with because Typescript allows for variable type hinting and TSX allow for a declarative approach to defining HTML. In other words while this is how you define a variable in Javascript:
```
// Javascript
let x = 5;
```

in typescript you can explicitly say it's type:
```
// Typescript
let x: number = 5;
```

As for TSX. Because it does an declarative approach you define what the final HTML should look like and don't need to think about how it gets there. For example to display a variable in TSX it would be:
```
// Display a variable on a webpage in TSX
export function App() {
    let x: number = 5;
    return (
        <p>{x}</p>
    );
}
```

Doing the same thing in HTML is much harder because you first need to write some HTML elements that must be static. Therefore if you try to reference a variable in the HTML it will just print out the variable name and never it's value. This is almost never what you want to do. So to achieve the same thing as above you would need to create a `<script>` element and write logic to modify the static HTML elements with the variable values.
```
<!-- Display a variable on a webpage in HTML -->
<p id="paragraphElement"></p>
<script type=module>
let x = 7;
document.getElementById("paragraphElement").innerText = x;
</script>
```

## Why not React?
While this project does import the React modules it does not use React in the way it was originally intended. One of the major benefits of React is being able to define reusable components however it comes at the cost of added complexity. For such a simple project we don't need reusable components and therefore can simplify the UI. Why do reusable components increase complexity? It's because components handle their own state. So if your UI is a form, then to discover what has been written in the form you would need to look at the state of all the components that make up the form. There are other extensions to react that reduce the complexity such as Redux however sometimes the simpliest way to manage complexity is to simply not use the features that introduce the complexity in the first place.

## If not React than what else?
Instead of using React the way it was intended we will stick with the most popular UI architecture ever invented. The MVC. A.k.a. the Model View Controller. However we will use an even simplified version called the Model View Presenter (MVP). The more traditional MVC works by trying to break the code used to generate a UI (typically a form) into 3 main files. 1 file is the model which contains all the information the user has entered into a form at the given time. The View is the code that determines how the UI should look. And the controller file is in theory where the busness logic should go. However in practise because the controller has access to the view and model in the majority of UI apps it becomes the dumping ground for the majority of code. As the controller grows, common mistakes become more common such as:
- the model becomes out of sync with the view.
- the view is either redrawn not enough (resulting in the view not showing the latest model state) or too often (resulting in the UI being slow).
- Uncertainty where complex view logic should go. e.g. should you write the complex logic in the controller and then get the view to do basic things or should you keep the logic in the view and then use the controller to orchestrate the view elements.

All these problems are addressed with the MVP architecture. THe major difference with MVP is we replace the Controller with a Presenter. The Presenter is the same as the Controller however it has one restriction. It can only access the Model directly and never the View. In other words:

In a traditional MVC architecture:
```
             View
            ^  ^
          /    |
         v     |
Controller     |
         ^     |
          \    |
           v   v
            Model
```

In a MVP architecture:
```
Presenter <---> Model <----> View
```

The major benifit of MVP is it's simplicity. There are only two interfaces (represented as arrows in the "diagrams" above) compared to 3 with MVC. And in reality this looks like the Model having Getter and Setter methods to get the current state or update the current state. The Presenter and the View can then call these methods when needed.

This simplicity is great however we still have a big problem that hasn't been addressed yet. User Interfaces need to be interactive. But what does that mean? Well, when the state in the Model changes we need to notify the View to refresh itself so the user can see the latest state graphically. Also, the Presenter needs to be notified whenever the state changes in the Model so it can react quickly to user interactions. For example the Presenter might need to validate a user input field as they are typing it into a form. How do we achieve all of these? There are many solutions however my favourite is sometimes referred to as data binding.

At its core data binding is the Model allowing any other piece of code to subscribe so that it will start recieving future changes that occur. This notification can then be used to refresh the View or for input validation in the Presenter. For example this subscription process might look like the following:

```
// in the presenter
usernameChanged() {
    console.log("username has changed");
}

model.username.subscribe(usernameChanged);
```

Notice how we have subscribed to changes to the username variable in the Model. We pass a function (commonly referred to as the callback function) that is called every time the model.username variable changes. This is the secret to allowing the Presenter and View to react to the model changing.

A more complete version of databinding can be found in the `./Presenter.ts` file. All the logic to implement databinding with React is written in the file `./DatabindingUtils.ts` however it's ok if not everything in this file makes sense to you the first time. Just know that the `useSyncExternalStore()` method is from the React library and it does all the magic to implement a basic data binding approach to any React view.

