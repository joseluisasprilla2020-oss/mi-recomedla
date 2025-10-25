<template>
  <div style="max-width:420px">
    <h2>Registro</h2>
    <div><input v-model="name" placeholder="Nombre" /></div>
    <div><input v-model="email" placeholder="Email" /></div>
    <div><input v-model="password" placeholder="Password" type="password" /></div>
    <button @click="doRegister">Registrar</button>
    <div v-if="error" style="color:red">{{ error }}</div>
    <div style="margin-top:16px">
      <router-link to="/login">¿Ya tienes cuenta? Inicia sesión</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

export default {
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();
    const authStore = useAuthStore();

    async function doRegister() {
      try {
        await authStore.register(name.value, email.value, password.value);
        router.push('/login');
      } catch (e) {
        error.value = e.message;
      }
    }

    return { name, email, password, doRegister, error };
  }
}
</script>
