# Retreat Time
Retreat time is the app for Yoga's that are doing a multi session mediatation. It is like the clock app but tailered for people that are doing a full day of mediatation and don't want the distraction of needing to check their phone to see the time.

# Folder Structure
frontend - contains the User Interface logic and 95% of the busness logic specific for the Retreat Time app (e.g. how Alarms should be scheduled, what sound should happen with they go off).
Android - contains the configuration needed to build a Android app and the remaining 5% of logic that is specific to just Android phones such as registering alarms events with the Android OS.
build.sh - contains logic so that setting up, building or running the app is a one line command.

# Getting started
The quickest and easiest way to start is to just build and run the frontend via the command `./build.sh frontend`. This will translate the Typescript/Typescript XML (TSX) in the folder `./frontend/src/*` into Javascript and HTML respectively. The output files are placed in `./build/frontend/`.

If you want intellisense with your local VSCode run this command once `./build.sh setup_dev`

However to build a native binary for Android (also known as a .apk file) you can run `./build.sh all`

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

