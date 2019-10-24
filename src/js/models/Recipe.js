import axios from "axios";
import { key } from "../config";

export default class Recipe {
    constructor(id) {
        this.id = id ;
    }

   async getRecipe(){
       try{

             const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);

                this.title = res.data.recipe.title;
                this.author = res.data.recipe.publisher;
                this.img = res.data.recipe.image_url ;
                this.url = res.data.recipe.source_url ;
                this.ingredients = res.data.recipe.ingredients ;

            //   console.log(res);
       } catch (error) {
           console.log(error);
           alert("Something went wrong");
       }
   }


   calcTime() {
       // Ako pretpostavimo da nam za 3 sastojka treba oko 15 min , aproksimacija
       const numIng = this.ingredients.length;
       const periods = Math.ceil( numIng / 3 );
       this.time = periods * 15 ;
   }

   calcServings (){
       this.servings = 4 ;
   }

   parseIngredients(){
      const unitsLong = ["tablespoons","tablespoon","ounces","ounce","teaspoons","teaspoon","cups","pounds"];
      const unitsShort = ["tbsp","tbsp","oz","oz","tsp","tsp","cup","pound"];
      const units = [...unitsShort, "kg","g"];

       const newIngredients = this.ingredients.map(el => {
           // 1) unuform units
            let ingredient =el.toLowerCase();
            unitsLong.forEach((unit,i)=>{
                  ingredient =ingredient.replace(unit,unitsShort[i]);
            }) ;
           // rem parents
           ingredient =ingredient.replace(/ *\([^)]*\) */g, " ");
           //parse ingred into count unit ....
           const arrIng = ingredient.split(" ");
           const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

           let objIng ;
             if (unitIndex >-1){
                 
                 const arrCount = arrIng.slice(0, unitIndex); // ex 4 1/2 cups arrCount =[4 1/2]
                 let count ;
                 if (arrCount ===1 ){count=eval(arrIng[0].replace("-","+"));} else {
                     count = eval(arrIng.slice(0,unitIndex).join("+"));
                 }

                 objIng = {
                     count, unit:arrIng[unitIndex], ingredient:arrIng.slice(unitIndex+1).join(" ")
                 }

             }else if (parseInt(arrIng[0], 10)){
                 objIng = {      couunt: parseInt(arrIng[0], 10),
                       unit:"",   ingredient: arrIng.slice(1).join(" ")
                 }
             }  else  {
             objIng = {
               count:1, unit:"",  ingredient: ingredient
             };
             }

           return objIng ;
       });
       this.ingredients=newIngredients ;
   }
       updateServings (type)  {
           const newServings = type ==="dec" ? this.servings -1 : this.servings +1 ;

            this.ingredients.forEach(ing => {
                ing.count = ing.count * (newServings/this.servings);
            });
            
           this.servings = newServings ;
       }
}