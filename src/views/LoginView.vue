<template>
  <div class="login-view">
    <div class="bg-sea" />
    <div class="bg-overlay" />
    <Login />
  </div>
</template>

<script>
import Login from '@/components/Login.vue';

export default { name: 'LoginView', components: { Login } };
</script>

<style scoped>
.login-view {
  position: relative; display: flex; justify-content: center; align-items: center;
  min-height: 100dvh; overflow: hidden;
}
.bg-sea {
  position: absolute; inset: 0; z-index: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(13,148,136,0.35), transparent 45%),
    radial-gradient(circle at 80% 80%, rgba(4,66,69,0.6), transparent 50%),
    linear-gradient(135deg, #022b2d 0%, #04494d 45%, #0a6a6e 100%);
}
.bg-sea::after {
  content: ""; position: absolute; inset: 0;
  background-image: repeating-linear-gradient(115deg, transparent 0 38px, rgba(255,255,255,0.025) 38px 40px);
}
.bg-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(135deg, rgba(4,66,69,0.78) 0%, rgba(4,66,69,0.55) 50%, rgba(0,0,0,0.7) 100%);
}
</style>
