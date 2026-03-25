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