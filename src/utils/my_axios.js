import axios from 'axios';
import {axios_URL} from "../my_config";

let instance = axios.create({
  baseURL: axios_URL
})


export default instance;
