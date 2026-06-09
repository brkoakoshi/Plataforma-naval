<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" :width="size" :height="size"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 17l1.5-4.5h15L21 17" />
    <path d="M3 17c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0" />
    <path d="M12 12.5V4h5l-2 4.5" />
    <line x1="12" y1="4" x2="7" y2="8.5" />
  </svg>
</template>

<script>
export default { name: 'ShipIcon', props: { size: { type: [Number, String], default: 22 } } };
</script>
