// export const add = (a,b) => a+b;
// export const multiply = (a,b) => a*b;
// export const IDDD = 29;

import {elements} from "./base" ;

export const getInput = () => elements.searchInput.value ;

export const clearInput = () => {elements.searchInput.value = ""};

export const clearResults = () => {
       elements.searchResList.innerHTML = "";
       elements.searchResPages.innerHTML = "";
};

export const highlightSelected = id => {
       const resultsArray = Array.from(document.querySelectorAll(".results__link"));
       
       resultsArray.forEach(el => {
           el.classList.remove("results__link--active");
       })

    document.querySelector(`.results__link[href="#${id}"]`).classList.add("results__link--active");
}

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [] ;
    if(title.length > limit){
          title.split(" ").reduce((acc, curr) => {
              if(acc+curr.length <= limit){
                  newTitle.push(curr);
              }
              return acc+ curr.length ;
          },0);
          //vracanje rezultata
          return `${newTitle.join(" ")}...`;
    }
    return title ;
};


const renderRecipe = recipe => {
    const markup = `
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend",markup);
};

// tip moze biti  "prev" ili "next"
const createButton = (page, type) => `

<button class="btn-inline results__btn--${type}" data-goto=${type === "prev" ? page - 1 : page + 1 }>
<span>Page ${type === "prev" ? page - 1 : page + 1 }</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" : "right" }"></use>
    </svg>
   
</button>
`;


const renderButtons = (page, numResults, resPerPage) => {
      const pages = Math.ceil( numResults / resPerPage )  ;
      
      let button;
      if (page === 1 && pages > 1) {
          // dugme ide samo na sledecu stranicu 
       button =   createButton(page, "next" );

      } else if (page === pages && pages > 1){
          // dugme ide samo na prethodnu stanicu
          button =   createButton(page, "prev" );
      } else {
          // oba dugmeta
           button = `
           ${createButton(page, "prev" )}
           ${createButton(page, "next" )}
           `;
      }

     elements.searchResPages.insertAdjacentHTML("afterbegin", button);

};

export const renderResults = (recipes , page = 1 , resPerPage = 10 ) => {
    // render results of the current page
    const start = (page - 1) * resPerPage ;
    const end = page * resPerPage ;

    recipes.slice(start,end).forEach(renderRecipe);

    //render pagination button
    renderButtons(page, recipes.length, resPerPage);
};



