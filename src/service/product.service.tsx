import axios from "axios";
import { ROUTES } from "./api.service";

export const ReadProducts = async () => {
    try {
      const {data} = await axios.get(ROUTES.READPRODUCTS);        
      return {
        error: false ,
        data: data
      };
    } catch (error) {
  
      return {
        error: true ,
        data: []
      }
    }
  };
  