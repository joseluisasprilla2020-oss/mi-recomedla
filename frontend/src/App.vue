<template>
  <div>
    <header style="padding:16px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center">
      <h1>RecoMedia (Postgres)</h1>
      <nav>
        <router-link to="/" style="margin-right:16px">Inicio</router-link>
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" style="margin-right:16px">Login</router-link>
          <router-link to="/register">Registro</router-link>
        </template>
        <template v-else>
          <span style="margin-right:16px">Hola, {{ authStore.user?.name }}</span>
          <button @click="authStore.logout()">Logout</button>
        </template>
      </nav>
    </header>
    <main style="padding:16px">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from './stores/auth.js';
import { onMounted } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    onMounted(() => {
      authStore.fetchUser();
    });
    return { authStore };
  }
}
</script>
