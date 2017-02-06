const overlay = document.getElementById("over");
const dialog = document.getElementById("dialog");
dialog.name = document.querySelector("#dialog h1");
dialog.container = document.querySelector("#dialog .container");
dialog.options = document.querySelector("#dialog .options");

dialog.show = function() {
    this.container.innerHTML = "";
    this.options.innerHTML = "";
    hoverBalloon.style.display = "none";

    overlay.style.display = "block";
    overlay.style.pointerEvents = "auto";
    setTimeout(() => overlay.style.opacity = .8, 10);

    dialog.style.display = "block";
    setTimeout(() => {
        dialog.focus();
        dialog.style.opacity = 1;
        dialog.style.transform = "scale(1)";
        dialog.style.top = "16%";
    },10);
}

dialog.hide = function() {
    overlay.style.opacity = 0;
    overlay.style.pointerEvents = "none";
    setTimeout(() => {
        if(overlay.style.opacity == "0") {
            overlay.style.display = "none";
        }
    }, 500);

    dialog.style.opacity = 0;
    dialog.style.top = "100%";
    setTimeout(() => {
        if(dialog.style.opacity == "0") {
            dialog.style.display = "none";
        }
    }, 200);

    c.focus();
}

dialog.addOption = function(text,onclick) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.onmousedown = onclick;
    button.onmouseup = dialog.hide;
    dialog.options.appendChild(button);
}

dialog.onkeydown = function(e) {
    if(e.which == 13) {         // Enter
        dialog.options.children[dialog.options.children.length - 1].onmousedown();
        dialog.options.children[dialog.options.children.length - 1].onmouseup();
    } else if(e.which == 27) {  // Esc.
        this.hide();
    }
}

dialog.welcome = function(component) {
    dialog.show();
    dialog.name.innerHTML = "Welcome";

    dialog.container.innerHTML += "<i class='material-icons' style='font-size: 60px'>memory<i>";
    dialog.container.innerHTML += "<p>Welcome to <span style='font-size: 20px; font-weight: 600'>BOOLR</span> !</p>";
    dialog.container.innerHTML += "<p>If you are new to this application, you can take a tour to see how this application works</p>";
    dialog.addOption("Take a tour", () => dialog.warning("This function is not yet available"));
    dialog.addOption("Just start");
}

dialog.update = function(component) {
    dialog.show();
    dialog.name.innerHTML = "Update " + VERSION;

    dialog.container.innerHTML += "<i class='material-icons' style='font-size: 60px'>update<i>";
    dialog.container.innerHTML += "<p>What's new:</p>";
    dialog.container.innerHTML +=
        "<ul style='width: 200px;'>" +
        "<li>Finally a name!</li>" +
        "<li><span style='font-family: Fancy; font-size: 25px'>New design</span></li>" +
        "<li>Create custom components</li>" +
        "<li>Components have input and output pins now</li>" +
        "<li>Merge wires</li>" +
        "</ul>";
    dialog.addOption("Close");
}

dialog.confirm = function(text,callback) {
    dialog.show();
    dialog.name.innerHTML = "Confirm";
    dialog.container.innerHTML += "<i class='material-icons' style='font-size: 60px'>?<i>";
    dialog.container.innerHTML += "<p>" + text + "</p>";

    dialog.addOption("Cancel");
    dialog.addOption("OK", callback);
}

dialog.warning = function(text) {
    dialog.show();
    dialog.name.innerHTML = "Warning";
    dialog.container.innerHTML += "<i class='material-icons' style='font-size: 60px'>warning<i>";
    dialog.container.innerHTML += "<p>" + text + "</p>";

    dialog.addOption("OK");
}

dialog.editName = function(component) {
    if(!component) return;
    dialog.show();
    dialog.name.innerHTML = "Edit name";
    dialog.container.innerHTML += `<p>Enter a new name for component <i>${component.name}</i></p>`;
    const input = document.createElement("input");
    dialog.container.appendChild(input);
    setTimeout(() => input.focus());

    dialog.addOption("Cancel");
    dialog.addOption("OK",  () => {
        if(input.value.length > 0 && input.value.length < 16) component.name = input.value
    });
}

dialog.colorPicker = function(callback = a => a) {
    dialog.show();
    dialog.name.innerHTML = "Color Picker";
    dialog.container.innerHTML += "<i class='material-icons' style='font-size: 60px'>color_lens<i>";
    dialog.container.innerHTML += `<p>Pick a color:</p>`;

    const el = document.createElement("div");
    el.style.width = 70;
    el.style.height = 50;
    el.style.display = "inline-block";
    el.style.margin = 10;
    el.onclick = function() {
        callback(this.style.background);
        dialog.hide()
    }

    const colors = [
        "#f33","#37f","#5b5","#ff5",
        "#f90","#60f","#0fc","#f0f",
        "#222","#555","#888","#ddd"];
    for(let i = 0; i < colors.length; ++i) {
        const color = el.cloneNode();
        color.style.background = colors[i];
        color.onclick = el.onclick;
        dialog.container.appendChild(color);
    }

    dialog.addOption("Cancel");
    dialog.addOption("OK",  () => component.name = input.value);
}

dialog.editCustom = function(component) {
    if(!component) return;
    dialog.show();
    dialog.name.innerHTML = "Edit " + component.name;

    dialog.container.appendChild(
        document.createTextNode("Name: ")
    );
    const name = document.createElement("input");
    dialog.container.appendChild(name);
    name.value = component.name;

    dialog.container.appendChild(document.createElement("br"));

    dialog.container.appendChild(
        document.createTextNode("Description (optional): ")
    );
    const description = document.createElement("input");
    dialog.container.appendChild(description);
    description.value = component.properties.description;

    dialog.addOption("Cancel");
    dialog.addOption("OK",  () => {
        if(name.value.length > 0 && name.value.length < 20) component.name = name.value;
        if(description.value.length > 0) component.properties.description = description.value;
    });
}

dialog.editComponent = function(component) {

}

dialog.savedCustomComponents = function() {
    dialog.show();
    dialog.name.innerHTML = "Saved components";

    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.margin = 0;

    for(let i = 0; i < savedCustomComponents.length; ++i) {
        const component = savedCustomComponents[i];

        const listItem = document.createElement("li");
        listItem.innerHTML = component.name;
        listItem.style.padding = 10;
        listItem.style.borderBottom = "2px solid rgba(255,255,255,.1)";

        listItem.onclick = function() {
            select(
                class {
                    constructor() {
                        return cloneComponent(
                            component,
                            mouse.grid.x - component.pos.x,
                            mouse.grid.y - component.pos.y
                        )
                    }
                }
            );
            dialog.hide();
        }
        list.appendChild(listItem);
    }
    dialog.container.appendChild(list);

    dialog.addOption("Close");
}

dialog.save = function(text) {
    dialog.show();
    dialog.name.innerHTML = "Save board";
    dialog.container.innerHTML += "<i class='material-icons' style='font-size: 60px'>save<i>";
    dialog.container.innerHTML += "<p>This board will be saved as a .board file</p>";
    dialog.container.innerHTML += "Name: ";

    let input = document.createElement("input");
    input.setAttribute("placeholder","PWS-Save-" + new Date().toLocaleString());
    dialog.container.appendChild(input);
    setTimeout(() => input.focus());

    dialog.container.innerHTML += "<span>.board</span>";
    input = document.querySelector("#dialog input");

    dialog.addOption("Cancel");
    dialog.addOption("OK", () => {
        saveBoard(input.value);
    });
}
