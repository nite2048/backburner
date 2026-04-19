<script>
    import Navbar from "../lib/Navbar.svelte";
    import Card from "../lib/Card.svelte";
    import Error from "../lib/Error.svelte";


    // Only for testing
    // import * as data from "../lib/dashboardData.json";
    // const items = data.default;

     const items =  fetch('http://localhost:3000/dashboard/getAll', {
          credentials: 'include'
     }).then(res => res.json());     
</script>


<section>
          <Navbar/>
          {#await items}
               <section style="background: radial-gradient(circle,rgba(0, 0, 0, 0.3) 10%, transparent 100%); z-index: -1;">
                    <div class="loader"></div>
               </section>
          {:then data}
               <section class="width-limiter shadow snaps-height">
                    <!-- <div class="nav-padding"></div> --> <!-- Nav padding, Broken -->
                    {#each data as item}
                         <Card item={item} />
                    {/each}
               </section>
          {:catch error}
               <Error code={error.code} message={error.message.toLowerCase()}/>
          {/await}
</section>

<style>
     .width-limiter{
           width: min(85%, 700px);
           display: grid;
           height: 100%;

           border-radius: 0.4rem;

           grid-auto-rows: 65%; /* For subsequent implicit rows after the first explicit row */
           gap: 1.5rem;
           background-color: rgba(0, 0, 0, 0.5);

           z-index: 3;
      }

     .nav-padding{
          height: 10%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: end;
          align-items: start;
          background: transparent;
          z-index: 7;
     }

     .snaps-height{
          overflow-y: scroll;
          scroll-behavior: smooth;
          scroll-snap-type: y none;

     }

    	.shadow {
		box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 1);
	}

     @media (max-width: 600px) {
          .shadow {
			box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.35);
		}

          .width-limiter{
               grid-auto-rows: 80%;
               gap: 1rem;
               background-color: rgba(0, 0, 0, 0.2);
          }

          .snaps-height{
               scroll-snap-type: y mandatory;
          }
	}
</style>