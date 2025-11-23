import axios from "axios";

const authApiService = axios.create({
  // Para o Emulador Android, use 10.0.2.2 para se conectar ao localhost do seu computador.
  // Se estiver usando um celular físico, substitua '10.0.2.2' pelo IP da sua máquina na rede.
  // Ex: baseURL: "http://192.168.1.10:8900"
  baseURL: "http://192.168.100.134:8765", // Apontando para o API Gateway
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Realiza o cadastro de um novo usuário.
 * @param {string} name - O nome do usuário.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @param {string} currency - A moeda preferida do usuário.
 * @param {number} userType - O tipo de usuário (ex: 1 para Leitor).
 * @returns {Promise<any>} A resposta da API.
 */
export async function signup(name, email, password, currency, userType) {
  const response = await authApiService.post("/auth/signup", {
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    type: userType,
    preferedCurrency: currency, // Tentando o padrão camelCase para o DTO Java
  });
  return response.data;
}

/**
 * Realiza o login do usuário.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<any>} A resposta da API, que deve incluir o token de acesso.
 */
export async function signin(email, password) {
  const response = await authApiService.post("/auth/signin", {
    email: email.toLowerCase(),
    password,
  });
  return response.data;
}