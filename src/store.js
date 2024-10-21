import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('token') || null,
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        clearToken(state) {
            state.token = null;
            localStorage.removeItem('token');
        }
    },
    actions: {
        login({ commit }, token) {
            commit('setToken', token);
        },
        logout({ commit }) {
            commit('clearToken');
        }
    },
    getters: {
        isAuthenticated: state => !!state.token
    }
});
