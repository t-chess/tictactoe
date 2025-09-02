import axios from "axios";
import { APIURL } from "../utils";
import { useToast } from "./useToast";

export const useAPI = () => {
    const { show } = useToast();
    const apiCall = async (method:string, endpoint:string, data?:any) => {
        try {
            let config = {
                method: method,
                url: APIURL + endpoint,
                headers: method === 'post'?{'Content-Type': 'application/json'}:undefined,
                data: JSON.stringify(data)
            }
            const response = await axios(config);
            show(response.data.message ?? endpoint,'success')
            return response.data.body
        } catch (error:any) {
            console.error(error);
            show(error.response.data.error || endpoint,'error')
        }
    }
    const post = async (endpoint:string, data:any) => apiCall('post', endpoint, data);
    const get = async (endpoint:string) => apiCall('get', endpoint);

    return { post, get };
}
