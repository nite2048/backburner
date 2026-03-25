
<main>
    <svelte:component this={current} />
</main>


<script>
     import page from 'page';
     let current;

     import Redirect from './routes/Redirect.svelte';
     import Upload from './routes/Upload.svelte';
     import Register from './routes/Register.svelte';
     import Dashboard from './routes/Dashboard.svelte';
     import Unauthorized from './routes/Unauthorized.svelte';
     import NotFound from './routes/NotFound.svelte';
     import Home from './routes/Home.svelte';


     page('/', redirectIfAuthenticated, () => current = Home);
     page('/register', redirectIfAuthenticated, () => current = Register);
     page('/dashboard',  () => current = Dashboard);
     page('/upload', requireAuth, () => current = Upload);
     page('/unauthorized', () => current = Unauthorized);
     page('/redirect', () => current = Redirect);
     page('*', () => current = NotFound);

     async function requireAuth(ctx, next) {
          try {
               const res = await fetch('http://localhost:3000/auth/status', {
                    credentials: 'include'
               });

               if (res.status === 200) {
                    // const data = await res.json();
                    // ctx.user = data.user;

                    next();
               } else {
                    current = Unauthorized;
               }
          } catch (err) {
               current = Unauthorized;
          }
     }

     // TODO remove the error logs in unprotected routes
     async function redirectIfAuthenticated(ctx, next, component = Dashboard) {
          try {
               const res = await fetch('http://localhost:3000/auth/status', {
                    credentials: 'include'
               });

               if (res.status === 200) {
                    current = component;
               } else {
                    next();
               }
          } catch (err) {
               next();
          }
     }

     page.start();
</script>
<style>
       main {
            width: 100svw;
            height: 100svh;

            background: repeating-linear-gradient(135deg, transparent 0 5px, var(--pattern) 5px 10px);
            background-size: 200% 200%;
            background-position: 0% 0%;

            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            user-select: none;
            z-index: -2;
            animation:stripes 120s linear infinite;
       }

       /* this element is created to bypass the mask and create a shadow effect on the background */
      	main::before {
    		content: '';

    		position: absolute;
    		bottom: 0;
    		right: 0;

    		width: 100%;
    		height: 15%;

    		z-index: -1;

    		box-shadow: 0px -20px 50px 20px rgba(0, 0, 0, 0.7);
    		background: var(--bg);
       }

    	main::after {
    		content: '';

    		position: absolute;
    		bottom: 0;
    		right: 0;

    		width: 100%;
    		height: 20%;

    		z-index: -1;
    		background: rgba(241, 231, 53);
    		box-shadow: 0px -20px 50px 20px rgba(0, 0, 0, 0.7);
    		mask: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50% / 50px 100%;
        }

        @keyframes stripes {
                to {
                    background-position : 100% 100%;
                }
        }

        @media (max-width: 600px) {
            /* a fix for unexplainable linet that appears at the top boundary of the conic mask in lower screen sizes */
            main::after {
    			bottom: -2px;
    			height: 22%;
    		}
        }
</style>
