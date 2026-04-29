<script>
     export let item;

     const getTitle = (title) => {
          if (typeof title === "string") return title;
          return title?.name || title?.english || title?.romaji || "Unknown";
     }
     
     function cleanHTML(html) {
       const temp = document.createElement('div');
       temp.innerHTML = html;
       return temp.textContent || temp.innerText || '';
     }

     $: safeTitle = getTitle(item?.title);
     $: safeCoverImage = typeof item?.coverImage === "string" ? item.coverImage : item?.coverImage?.extraLarge || item?.coverImage?.large || "";
     $: safeAverageScore = typeof item?.averageScore === "number" ? ((item.averageScore > 10) ? Math.round(item.averageScore) / 10 : Math.round(item.averageScore * 10) / 10 ) : "N/A";
     $: safeDescription = item?.description || "No description available.";
</script>

<div class="item">
     <img src={safeCoverImage} alt={safeTitle} />

     <div class="info-col">
          <p class="heading">{safeTitle}</p>
          <div class="metadata">
               <div class="score">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                     </svg>
                     <span>{safeAverageScore}</span>
                </div>
                {#if item?.genres && item.genres.length > 0}
                     {#each item.genres.slice(0, 2) as genre}
                          <span class="genre">{genre.name || 'Unknown'}</span>
                    {/each}
                    {#if item.genres.length > 2}
                         <span class="genre">+{item.genres.length - 2}</span>
                    {/if}
               {:else}
                    <span class="genre unknown">Unknown</span>
               {/if}
          </div>
     </div>

     <p class="description">{cleanHTML(safeDescription)}</p>

</div>

<style>
     span{
          text-decoration: none;
     }
     
     *{
          font-family: "Switzer";
     }
     
     .item{
          height: 100%;
          width: 100%;

          display: flex;
          flex-direction: column;
          justify-content: end;
          align-items: start;

          gap: 0.5rem;
          overflow: hidden;

          border-left: 0.1px solid rgba(255, 255, 255, 0.2);
          border-right: 0.1px solid rgba(255, 255, 255, 0.2);
          border-bottom: 0.1px solid rgba(255, 255, 255, 0.3);

          scroll-snap-align: center;
          border-radius: 0.4rem;
          z-index: 2;
     }

     .item::before{
          content: '';
          display: block;
          position: absolute;
          height: 100%;
          width: 100%;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 0.94) 85%);
          z-index: -1
     }

     .item > img{
          height: 100%;
          width: 100%;
          object-fit: cover;
          background-position: center 100%;
          position: absolute;
          z-index: -2;

     }

     .info-col{
          height: 6%;
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 0.5rem;
          padding: 0 1rem 0 1rem;
     }

     .heading{
          text-align: left;
          text-decoration: underline;


          font-size: 1.4rem;
          height: 100%;
          min-width: 50%;
          flex: 1;

          color: rgba(241, 231, 53, 0.8);
          text-shadow:none;

          text-decoration: underline;
          font-family: 'Switzer';

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0;
          margin: 0;

     }

    	.description {
          display: -webkit-box;
          line-clamp: 6;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;

          margin: 0 1rem 1rem 1rem;

          color: rgba(255, 255, 255, 0.6);

          font-family: "Author";
		font-size: 0.8rem;

          text-align: left;
          text-shadow: none;
          text-decoration: none;
	}

     .score {
          display: flex;
          align-items: center;
          justify-content: space-between;

          height: 100%;
          min-width: 3rem;
          padding: 0.4rem;
          background: rgba(241, 231, 53, 0.12);
          border: 1px solid rgba(241, 231, 53, 0.4);
          border-radius: 0.3rem;
     }

     .score > svg {
          width: 0.7rem;
          height: 0.7rem;

          margin: 0;

          fill: rgba(241, 231, 53, 0.95);
          stroke: rgba(241, 231, 53, 0.95);
     }

     .score > span {
          font-size: 0.75rem;

          color: rgba(255, 255, 255, 0.95);
          text-shadow: rgba(241, 231, 53, 0.8) 0px 0px 20px;
     }

     .metadata {
          display: flex;
          align-items: center;
          justify-content: end;

          height: 100%;
          min-width: 40%;

          gap: 0.4rem;
     }

     .genre {
          height: 100%;
          min-width: 2rem;
          max-width: 8rem;
          padding: 0.4rem 0.4rem;

          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.85);

          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
          font-size: 0.7rem;

          border-radius: 0.25rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
     }


     @media (max-width: 600px) {
          .item::before{
               content: '';

               display: block;
               position: absolute;

               height: 100%;
               width: 100%;

               background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0.98) 90%);

               z-index: -1
          }

         	.description {
               font-size: 0.7rem;
               line-clamp: 4;
               -webkit-line-clamp: 4;
               -webkit-box-orient: vertical;

               overflow: hidden;
               mask-image: linear-gradient(
                   to bottom,
                   black 0%,
                   black 60%,
                   rgba(0,0,0,0.9) 70%,
                   rgba(0,0,0,0.7) 80%,
                   rgba(0,0,0,0.4) 90%,
                   transparent 100%
               );

               -webkit-mask-image: linear-gradient(
                   to bottom,
                   black 0%,
                   black 60%,
                   rgba(0,0,0,0.9) 70%,
                   rgba(0,0,0,0.7) 80%,
                   rgba(0,0,0,0.4) 90%,
                   transparent 100%
               );
          }

          .info-col{
               flex-wrap: wrap;
               height: 10%;
               gap: 0.2rem;
          }

          .heading{
               height: 55%;
               min-width: 100%;
          }

          .genre{
               min-width: 2rem;
               max-width: 9rem;
               padding: 0.3rem;
          }

          .metadata{
               height: 45%;
               min-width: 100%;
               justify-content: start;
          }
	}
</style>
