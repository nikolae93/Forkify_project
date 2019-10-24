// Global app controller

// import x from "./test";

// import {add, multiply,IDDD}  from "./views/searchView";

/* ******************************************************************* */
/* *************************PROJEKAT********************************** */
/* ******************************************************************* */

import Search from "./models/Search" ;
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import *  as searchView  from "./views/searchView" ;
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import {elements, renderLoader, clearLoader } from "./views/base" ;


/* Global State */ 
/** U njenu imamo search objekat
 *  trenutni recept
 * soping lista objekat,
 * favorite recipes
  */
const state = {};

// za testiranje
// window.state = state;


/* *** KONTROLOR TRAZNJE *** */

const controleSearch = async () => {
     //  1 vdobijamo query od view
     const query = searchView.getInput();
       console.log(query);

     if(query){
         // 2 novi search objekat i dodatak u stanje
         state.search = new Search(query);

         // 3  priprema UI za rezultat
            searchView.clearInput();
            searchView.clearResults();
             renderLoader(elements.searchRes);
          
             try{
               // 4  trazenje recepta
         await state.search.getResults();

         // 5  render rezultata u UI
             clearLoader();
         console.log(state.search.result);
         searchView.renderResults(state.search.result);
             } 
             catch (err) {alert("Something went wrong with the search..."); 
             clearLoader();
            }
     }
};

 elements.searchForm.addEventListener("submit", e=> {
    e.preventDefault();
    controleSearch();
});

//const search = new Search("pizza");
//console.log(search);
//search.getResults();
//getResults("pizza");

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if(btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    console.log(goToPage);
    searchView.renderResults(state.search.result , goToPage);
  }
});

/* ***  KONTROLOR RECEPATA  *** */

/*     Test primerak
const r = new Recipe(47746);
r.getRecipe();
console.log (r);

*/
const controlRecipe = async () => {
    const id = window.location.hash.replace("#", "" );  // ovako dobijamo hash, window.location je ceo url
    console.log(id);

    if(id){
      // priprema UI za promenu
         recipeView.clearRecipe();
            renderLoader(elements.recipe);
          // highlight 
     if (state.search) {searchView.highlightSelected(id);}

      //kreiranje novog recipe objekta
          state.recipe = new Recipe(id) ;
          window.r = state.recipe;

           try {
               // pribavljanje podataka o receptu
          await   state.recipe.getRecipe();
          state.recipe.parseIngredients();
          //pozivanje funkcija
              state.recipe.calcTime();
              state.recipe.calcServings();
          //render
          clearLoader();
          recipeView.renderRecipe(
              state.recipe,
              state.likes.isLiked(id)
              );
       //   console.log(state.recipe);
           } catch (err) {
             alert("Error processing recipe");
           }

     
    }

};

window.addEventListener("hashchange", controlRecipe);
window.addEventListener("load", controlRecipe);

// KONTROLOR LISTE

const controlList = () => {
    // kreiranje nove liste ako nema 
       if(!state.list){state.list = new List();}

    // dodavanje svakog sastojka u listu
      state.recipe.ingredients.forEach(el => {
        const item =  state.list.additem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
      });
}

// delete i update
elements.shopping.addEventListener("click", e => {
    const id = e.target.closest(".shopping__item").dataset.itemid;
    // delete button
    if (e.target.matches(".shopping__delete, .shopping__delete *")){
        // brisanje iz state i ui-a
        state.list.deleteitem(id);
        listView.deleteItem(id);
    } else if(e.target.matches(".shopping__count-value")){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// kraj kontrolora liste

// KONTROLOR LAJKOVA

// samo za testiranje
//state.likes = new Likes();
//likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if(!state.likes){state.likes = new Likes();}
    const currID =state.recipe.id ;
    if(!state.likes.isLiked(currID)){
           // dodavanje u state
     const newLike = state.likes.addLike(currID,
        state.recipe.title,state.recipe.author,state.recipe.img);
           // toggle like button
              likesView.toggleLikeBtn(true);
           // dodavanje u ui
           likesView.renderLike(newLike);
        console.log(state.likes);
    } else {
        // isto kako i u if-u samo obrnuto
        state.likes.deleteLike(currID);
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// kraj kontrolora lajkova

// Restore like recipe
window.addEventListener("load", () => {
    state.likes = new Likes();
    state.likes.readStorage();
likesView.toggleLikeMenu(state.likes.getNumLikes());

state.likes.likes.forEach(like => likesView.renderLike(like));
});


// dodavanje istog event 
// ["hashchange","load"].forEach(event => window.addEventListener(event, controlRecipe));

// recipe button click
elements.recipe.addEventListener("click", e => {

     if (e.target.matches(".btn-decrease, .btn-decrease *")){
         if(state.recipe.servings>1){
          state.recipe.updateServings("dec");
          recipeView.updateServingsIng(state.recipe);
        }
     } 
     else if (e.target.matches(".btn-increase, .btn-increase *")){
        state.recipe.updateServings("inc");
        recipeView.updateServingsIng(state.recipe);
    }  else if (e.target.matches(".recipe__btn--add, recipe__btn--add *")){
       // dodavanje sastojaka u listu
        controlList();
    } else if(e.target.matches(".recipe__love, .recipe__love *")){
          controlLike();
    }
  //  console.log(state.recipe);
});


window.l = new List();
