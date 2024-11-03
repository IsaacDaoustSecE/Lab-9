const categories = ["Elephants", "Canada", "Guitar", "Concert"];
let filter = null;

const filterButtons = categories.flatMap((name) => {
    return $("#filter-" + name.toLowerCase())[0];
});

filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const thisButton = e.currentTarget;
        if (thisButton.classList.contains("active")) {
            showAllImages();
            thisButton.classList.remove("active");
        } else {
            const currentActive = $(".filter-button.active");
            if (currentActive) {
                currentActive.removeClass("active");
            }

            thisButton.classList.add("active");
            showImagesFromCategory(thisButton.id.split("-")[1]);
        }
    });
});

function showAllImages() {
    $("img.hidden").removeClass("hidden");
}

function showImagesFromCategory(category) {
    $(`img[data-category=${category.toLowerCase()}]`).removeClass("hidden");
    $(`img:not([data-category=${category.toLowerCase()}])`).addClass("hidden");
}

function getAllImages() {
    const images = [];
    for (const cat of categories) {
        for (let i = 1; i < 7; i++) {
            images.push(`images/${cat.toLowerCase()}/wide_${i}.webp`);
        }

        for (let i = 1; i < 4; i++) {
            images.push(`images/${cat.toLowerCase()}/tall_${i}.webp`);
        }
    }

    return images;
}

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
}

function createGallery() {
    const section = document.createElement("section");
    section.setAttribute("id", "gallery");
    section.classList.add("gallery");

    const images = getAllImages();
    shuffle(images);

    for (const imgSrc of images) {
        const imgElement = document.createElement("img");
        imgElement.src = imgSrc;
        imgElement.setAttribute("data-category", imgSrc.split("/").at(1));

        // Abstract art?!
        if (Math.random() > 0.5) {
            imgElement.style.marginLeft = "auto";
        }

        section.append(imgElement);
    }

    return section;
}

function hideEffectsBar() {
    $("#effects-bar").hide();
}

function showEffectsBar() {
    $("#effects-bar").show();
}

const gallery = createGallery();
document.body.append(gallery);

const effectsBar = $("#effects-bar");

hideEffectsBar();

$("#effects-close").on("click", (e) => {
    $("img").removeClass("opacityhide");
    hideEffectsBar();
});

$("body").on("click", (e) => {
    if (e.target.tagName === "SECTION") {
        unhighlight();
    }
});

$(".effect-button").on("click", (e) => {
    const button = e.currentTarget;

    const img = $("img.highlighted");
    const imgUrl = img.attr("src");

    const effectName = button.textContent;

    if (effectName === "Sepia") {
        img.css("filter", "sepia()");
    } else if (effectName === "Hue Rotate") {
        img.css("filter", "hue-rotate(90deg)");
    } else if (effectName === "Invert") {
        img.css("filter", "invert()");
    }
});

function unhighlight() {
    if ($("img.highlighted")) {
        $("img.highlighted").removeClass("highlighted");
        $("img").removeClass("opacityhide");
        hideEffectsBar();
    }
}

$("img").on("click", (e) => {
    const img = e.currentTarget;
    const imgRect = img.getBoundingClientRect();

    if ($(img).hasClass("highlighted")) {
        unhighlight();
        return;
    }

    $(img).addClass("highlighted");
    showEffectsBar();

    $("img").addClass("opacityhide");
    img.classList.remove("opacityhide");

    const effectsLeft = imgRect.left + "px";
    const effectsTop = imgRect.top + imgRect.height + window.scrollY + "px";
    effectsBar.animate(
        {
            top: effectsTop,
            left: effectsLeft,
        },
        200
    );
});
