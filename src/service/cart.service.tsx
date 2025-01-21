import axios from "axios";
import { ROUTES } from "./api.service";

export const ReadCart = async () => {
    try {
      const {data} = await axios.get(ROUTES.READCART);

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

export const AddCart = async (id: number) => {    
    try {
        const response = await axios.post(ROUTES.ADDCART(id));
        return {
        error:false,
        data:response.data
        }
    } catch (error) {
        return {
        error:true,
        data: []
        }
    }
};