import axios from 'axios';

const API_KEY = 'AIzaSyDCYasArcOwcALFhIj2szug5aD2PgUQu1E';

async function authenticate(mode, email, password) {
  const url = `http://localhost:4000/auth/${mode}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  console.log(response.data);
}

export async function createUser(email, password) {
  await authenticate('signUp', email, password);
}

export async function login(email, password) {
  await authenticate('register', email, password);
}































// const getHeader = async (type) => {
//     const token = await AsyncStorage.getItem('userToken');
//     const token_json = JSON.parse(token);
//     if (type === 'refresh') {
//         return token_json.refreshToken;
    
//     } else {
//         return token_json.accessToken;
//     }
// }

// export default axios.create({
//     baseURL: 'http://localhost:4000'
// })