<template>
  <div style="max-width:420px">
    <h2>Login</h2>
    <div><input v-model="email" placeholder="Email" /></div>
    <div><input v-model="password" placeholder="Password" type="password" /></div>
    <button @click="doLogin">Entrar</button>
    <div v-if="error" style="color:red">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    async function doLogin(){
      try {
        const url = (import.meta.env.VITE_API_URL || '') + '/api/auth/login';
        const r = await axios.post(url, { email: email.value, password: password.value });
        alert('Token: ' + r.data.accessToken);
      } catch(e){
        error.value = e.response?.data?.message || e.message;
      }
    }
    return { email, password, doLogin, error };
  }
}
</script>
