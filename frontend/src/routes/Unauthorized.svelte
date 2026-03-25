<main>
     <span>401, Unauthorized</span>
     <p>try again after logging in</p>
</main>

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

          animation:stripes 120s linear infinite;
     }

     span{
          text-align: center;
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary);
          font-family: 'Saygon', sans-serif;
     }
     
    	p {
		color: rgba(255, 255, 255, 0.7);
		text-shadow: rgba(241, 231, 53, 0.45) 0px 0px 35px;
		text-decoration: underline;
		text-align: center;
		font-size: 1rem;
		width: 40%
	}

     @keyframes stripes {
          to {
               background-position : 100% 100%;
          }
     }


</style>