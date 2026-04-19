<script>
     import { onMount } from 'svelte';
     onMount(() => {
          setTimeout(() => {
               window.location.href = '/dashboard';
          }, 950);
     });
</script>


<section>
     <div class="loader"></div>
     <p>your'e being redirected, please wait a moment </p>
</section>

<style>
     section{
          background: radial-gradient(circle,rgba(0, 0, 0, 0.3) 10%, transparent 100%);
          z-index: -1;
     }
</style>