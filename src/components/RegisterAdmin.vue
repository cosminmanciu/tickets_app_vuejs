<template>
  <div class="register">
    <h1>Register</h1>
    <form @submit.prevent="register" class="form">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required class="form-input" />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required class="form-input" />
      </div>
      <button type="submit" class="submit-button">Register</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p class="redirect">
      Already have an account? <router-link to="/login">Login here</router-link>.
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async register() {
      try {
        await axios.post('http://localhost:80/api/users/register', {
          username: this.email,
          password: this.password,
        });
        await this.login();
      } catch (err) {
        this.error = err.response.data.error || 'Registration failed. Please try again.';
      }
    },
    async login() {
      try {
        const response = await axios.post('http://localhost:80/api/login_check', {
          username: this.email,
          password: this.password
        });

        const token = response.data.token;
        this.$store.dispatch('login', token);
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = 'Login after registration failed. Please try logging in manually.';
      }
    }
  }
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #218838;
}

.error {
  color: red;
  text-align: center;
}

.redirect {
  text-align: center;
}
</style>
