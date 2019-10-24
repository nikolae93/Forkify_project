// export default "I am an exported String";

import axios from "axios";
import { key } from "../config";

export default class Search {
    constructor(query){
        this.query=query;
    }

    async  getResults() {
     //   const key= "28057636d4e2316cc60af03cf84888ad";
    
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes
          //  console.log(this.result);
        } catch (error) {
           alert(error)
        }
    }
}