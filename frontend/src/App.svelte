<main>
    <Auth {currentRoute} {routeConfig}>
         <svelte:component this={current}/>
    </Auth>
</main>

<script>
     import page from 'page';
     import Auth from './lib/Auth.svelte';

     let current;
     let currentRoute = '/';

     import Redirect from './routes/Redirect.svelte';
     import Upload from './routes/Upload.svelte';
     import Register from './routes/Register.svelte';
     import Dashboard from './routes/Dashboard.svelte';
     import Unauthorized from './routes/Unauthorized.svelte';
     import NotFound from './routes/NotFound.svelte';
     import Home from './routes/Home.svelte';

     // Route configuration - fine-grained control over auth behavior
     const routeConfig = {
          '/': {
               requiresAuth: false,
               redirectIfAuth: true,
               redirectTarget: '/dashboard'
          },
          '/register': {
               requiresAuth: false,
               redirectIfAuth: true,     // Redirect to dashboard if already logged in
               redirectTarget: '/dashboard'
          },
          '/dashboard': {
               requiresAuth: true,       // Protected route
               redirectIfAuth: false
          },
          '/upload': {
               requiresAuth: true,       // Protected route
               redirectIfAuth: false
          },
          '/unauthorized': {
               requiresAuth: false,      // Public route
               redirectIfAuth: false
          },
          '/redirect': {
               requiresAuth: false,      // Public route
               redirectIfAuth: false
          },
          '*': {
               requiresAuth: false,      // Public route (404)
               redirectIfAuth: false
          }
     };

     page('/', () => {
          currentRoute = '/';
          current = Home;
     });

     page('/register', () => {
          currentRoute = '/register';
          current = Register;
     });

     page('/dashboard', () => {
          currentRoute = '/dashboard';
          current = Dashboard;
     });

     page('/upload', () => {
          currentRoute = '/upload';
          current = Upload;
     });

     page('/unauthorized', () => {
          currentRoute = '/unauthorized';
          current = Unauthorized;
     });

     page('/redirect', () => {
          currentRoute = '/redirect';
          current = Redirect;
     });

     page('*', () => {
          currentRoute = '*';
          current = NotFound;
     });

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
