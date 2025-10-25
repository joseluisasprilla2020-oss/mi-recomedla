<template>
  <div>
    <div style="display:flex; gap:8px; margin-bottom:12px">
      <input v-model="q" placeholder="Buscar..." />
      <button @click="search">Buscar</button>
    </div>
    <div v-if="items.length === 0">No hay resultados.</div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px">
      <ItemCard v-for="it in items" :key="it.id" :item="it" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import ItemCard from '../components/ItemCard.vue';
export default {
  components: { ItemCard },
  setup() {
    const q = ref('');
    const items = ref([]);
    async function search() {
      const url = (import.meta.env.VITE_API_URL || '') + '/api/media?q=' + encodeURIComponent(q.value);
      const r = await axios.get(url);
      items.value = r.data;
    }
    return { q, items, search };
  }
}
</script>
