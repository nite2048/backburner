<section style="gap: 2rem;">
    <span style="text-decoration: underline;">backburner.</span>
    <div id="description">
        <p>catch a show or movie you want to watch? just screenshot it. backburner instantly adds it to your watchlist and quietly deletes the image. <br> <br> chat with your watchlist, get recommendations, and keep notes. <br> <br> backburner is cross platform, so your next binge is always at your fingertips.</p>
    </div>
    <button style="margin-bottom: min(5svh, 5rem);" class="btn-striped-shadow" on:click={() => {window.location.href = '/register'}}>Get started</button>
</section>


<style>
    #description{
          max-width: 32rem;

          padding: 2rem;
          padding-top: 0;
          padding-bottom: 0;

          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
     }

     @media (max-width: 600px) {
          #description {
              padding: 0.6rem;
               padding-bottom: 0;
               padding-top: 0;
               width: 95%;
          }
     }
</style>