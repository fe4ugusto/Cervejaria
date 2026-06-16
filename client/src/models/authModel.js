/**
 * Modelo de Autenticação (Auth Model)
 * Lida com as operações da camada de dados para Autenticação.
 */

const USER_STORAGE_KEY = "brewery_user";

export const authModel = {
  /**
   * Carrega o usuário conectado atualmente do local storage
   * @returns {object|null} Usuário logado ou nulo
   */
  loadUser() {
    try {
      const s = localStorage.getItem(USER_STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  },

  /**
   * Valida as credenciais locais (Simulação/Mock) e retorna o perfil com papel (role)
   * @param {string} email 
   * @param {string} password 
   * @returns {object|null} Detalhes do usuário com a role ("admin" ou "cliente") ou nulo
   */
  authenticate(email, password) {
    if (email === "admin@cervejaria.com" && password === "1234") {
      return { email, name: "Mestre Cervejeiro", role: "admin" };
    }
    if (email === "cliente@cervejaria.com" && password === "1234") {
      return { email, name: "Consumidor Cervejeiro", role: "cliente" };
    }
    return null;
  },

  /**
   * Persiste o usuário conectado no local storage
   * @param {object} user 
   */
  persistUser(user) {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Falha ao salvar sessão do usuário:", e);
    }
  },

  /**
   * Remove as credenciais do usuário conectado do local storage
   */
  clearUser() {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.error("Falha ao limpar sessão do usuário:", e);
    }
  }
};
