<template>
  <div style="border:1px solid #eee; padding:8px; border-radius:6px">
    <h3>{{ item.title }}</h3>
    <p>{{ item.year }}</p>
    <router-link :to="'/item/' + item.id">Ver detalle</router-link>
  </div>
</template>
<script>export default { props: ['item'] }</script>
