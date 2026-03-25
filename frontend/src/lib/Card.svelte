<script>
     export let item;
</script>

<div class="item">
     <img src={item.coverImage} alt={item.title.name} />
     <p>{item.description}</p>
     <p class="heading">{item.title.name}</p>
</div>

<style>
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

     .heading{
          font-size: 1.25rem;

          color: rgba(255, 255, 255, 0.8);
          text-shadow: rgba(241, 231, 53, 0.4) 0px 0px 35px;

          text-decoration: underline;
          font-family: 'Saygon', sans-serif;

          padding: 0 0 1rem 1rem;

          white-space: nowrap;
          text-overflow: ellipsis;
     }
     
     
    	p {
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.7rem;
		width: 100%;
		padding: 0 1rem;
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
	}
</style>
