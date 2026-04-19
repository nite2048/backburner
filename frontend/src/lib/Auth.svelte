<script>
     import { onMount } from 'svelte';
     import Error from './Error.svelte';

     export let currentRoute;
     export let routeConfig = {};

     let authState = 'loading';
     let message = '';
     let errorMessage = '';

     $: requiresAuth = routeConfig[currentRoute]?.requiresAuth ?? false;
     $: redirectIfAuth = routeConfig[currentRoute]?.redirectIfAuth ?? false;
     $: redirectTarget = routeConfig[currentRoute]?.redirectTarget ?? '/dashboard';

     async function checkAuthStatus() {
          authState = 'loading';
          errorMessage = '';

          try {
               const res = await fetch('http://localhost:3000/auth/status', {
                    credentials: 'include',
                    headers: {
                         'Accept': 'application/json',
                    }
               });

               if (res.status === 200) {
                    authState = 'authenticated';

                    if (redirectIfAuth) {
                         window.location.href = redirectTarget;
                    }
               } else if (res.status === 401 || res.status === 403) {
                    authState = 'unauthenticated';

                    if (requiresAuth) {
                         window.location.href = '/unauthorized';
                    }
               } else {
                    throw new Error(`unexpected status: ${res.status}`);
               }
          } catch (err) {
               console.error('auth check failed:', err);
               authState = 'error';
               errorMessage = 'server error, failed to connect';
          }
     }

     onMount(() => {
          const timer = setTimeout(() => {
                message = "checking auth";
          }, 1000);

          checkAuthStatus();
          return () => clearTimeout(timer);
     });
</script>

{#if authState === 'loading'}
     <section>
          <div class="loader"></div>
          <p> {message} </p>
     </section>
{:else if authState === 'error'}
     <Error message={errorMessage} />
{:else}
     <slot/>
{/if}

<style>
     *{
          font-family: "Spock";
     }

     section{
          background: radial-gradient(circle,rgba(0, 0, 0, 0.3) 10%, transparent 100%);
          z-index: -1;
     }
</style>
