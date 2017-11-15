import axios from 'axios';

const instance = axios.create({
  baseURL: "https://react-my-burger-97a1b.firebaseio.com/"
});

export default instance;