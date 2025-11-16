<script>
     import { onMount } from "svelte";
     import Card from "../lib/Card.svelte";

     let container
     let altText, currentUrl, json
     let isUploading = false, isImageInBlob = false;
     let UPLOAD_ENDPOINT = "http://localhost:3000/postman/upload64";

     async function blobToBase64(blob) {
          return new Promise((resolve, reject) => {
               const reader = new FileReader();
               reader.onloadend = () => resolve(reader.result);
               reader.onerror = reject;
               reader.readAsDataURL(blob); // produces "data:image/jpeg;base64,AAA..."
          });
     }

     async function sendImage(blobUrl) {
          isUploading = true;

          const blob = await fetch(blobUrl).then(r => r.blob());
          const base64 = await blobToBase64(blob);

          const response = await fetch(UPLOAD_ENDPOINT, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                    filename: altText,
                    data: base64
               })
          });

          json = await response.json(); //Do something with JSON
          isUploading = false;
     }

     function removeImage() {
          isImageInBlob = false;
          container.setAttribute("data-present", "false");
          container.removeEventListener('click', oneClickPost)

          if (currentUrl) URL.revokeObjectURL(currentUrl);
          currentUrl = undefined;
     }

     function onChange(e) {
          removeImage();
          const file = e.target.files[0];
          if (!file || !file.type.startsWith("image/")) return;

          currentUrl = URL.createObjectURL(file);
          altText = file.name;

          isImageInBlob = true;
          container.setAttribute("data-present", "true");
          container.addEventListener('click', oneClickPost)
          // document.getElementById('close').addEventListener("click", e => close(e))
     }

     const oneClickPost = () => { if (currentUrl) sendImage(currentUrl)}
     const close = (e) => {
          e.preventDefault()
          e.stopPropagation()
          removeImage()
     }
     onMount(() => {container.addEventListener("change", onChange)})
</script>

<main>
     {#if json}
          <Card displayData={json} />
     {:else}
          {#if isUploading}
               <div id="uploading">
                    <div class="loader"></div>
                    <p><span style="color: var(--primary); text-decoration: underline;"> please wait.</span> this may take a few seconds</p>
               </div>
          {:else}
               <form id="container" bind:this={container} data-present="false">
                    {#if isImageInBlob}
                         <img id='preview' src={currentUrl} alt={altText}/>
                         <button id="close" on:click={() => removeImage()}>
                         <svg xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              class="close-icon">
                              <line x1="100" y1="100" x2="412" y2="412"
                                   stroke="black" stroke-width="90" stroke-linecap="round"/>
                              <line x1="412" y1="100" x2="100" y2="412"
                                   stroke="black" stroke-width="90" stroke-linecap="round"/>
                         </svg>
                         </button>

                         <div id="preview--hover">
                              <p>click to upload</p>
                         </div>
                    {:else}
                         <div role="button" id="overlay">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                   <g>
                                        <path d="M336.5,495.1c7.9,7.9,20.6,7.9,28.5,0c7.9-7.9,7.9-20.6,0-28.5l-34.2-34.2l-28.5,28.5L336.5,495.1z"/>
                                        <path d="M401.5,430c7.9,7.9,20.6,7.9,28.5,0c7.9-7.9,7.9-20.6,0-28.5l-34.2-34.2l-28.5,28.5L401.5,430z"/>
                                        <path d="M466.6,365c7.9,7.9,20.6,7.9,28.5,0c7.9-7.9,7.9-20.6,0-28.5l-34.2-34.2l-28.5,28.5L466.6,365z"/>
                                        <path d="M456.7,204l-136-4.5l-118.1-118.2c-33.5-33.5-148.3-94-181.8-60.5s27,148.3,60.5,181.8l118.1,118.2l4.5,135.8
                                                  c0.5,16,19.9,23.7,31.3,12.3l233.8-233.6C480.3,223.9,472.7,204.5,456.7,204z"/>
                                   </g>
                              </svg>
                              <p>click anywhere to <span style="color: var(--primary); text-decoration: underline;"> upload.</span></p>
                              <input type="file" accept="image/*" hidden/>
                         </div>
                    {/if}
               </form>
          {/if}
     {/if}
</main>

<style>
    main {
		width: 100svw;
		height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-family: 'Spock';
		user-select: none;
		z-index: 2;
		background: repeating-linear-gradient(135deg, transparent 0 5px, var(--pattern) 5px 10px);
		background-size: 200% 200%;
		background-position: 0% 0%;
		animation: stripes 120s linear infinite;
	}

	main::before {
		all: revert;
		content: '';
		position: absolute;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 15%;
		z-index: -1;
		box-shadow: 0px -20px 20px 10px rgb(0 0 0 / 70%);
		background: var(--bg);
	}

	main::after {
		all: revert;
		content: '';
		position: absolute;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 20%;
		z-index: -1;
		background: rgba(241, 231, 53);
		mask: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50% / 50px 100%;
	}

    #container {
          display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		width: 90%;
		height: 90%;
		max-width: 20rem;
		max-height: 45rem;

		padding: 1rem;
		background-color: rgba(0, 0, 0, 0.13);
		border: 0.12rem dashed rgba(255, 255, 255, 0.12);
		background-size: contain;

		cursor: pointer;

		border-radius: 0.75rem;
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);

		box-shadow: inset 0px 0px 40px 0px rgba(0, 0, 0, 0), 0px 0px 40px 0px rgba(0, 0, 0, 1);

		position: relative;
		transition:all 0.2s ease-in;
	}

	#uploading{
     	display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          width: 95%;
          height: 90%;
          max-width: 20rem;
          max-height: 45rem;

          padding: 1rem;
	}

	#container[data-present="false"]:hover{
	     box-shadow: inset 0px 0px 40px 0px rgba(0, 0, 0, 0.25), 0px 0px 50px 0px rgba(241, 231, 53, 0.2);
	}

	svg{
          width: 15%;
     	fill: var(--primary);
          margin: 1rem;
          margin-right: 1.5rem;
          overflow: visible;
	}

	path{
	    	filter: drop-shadow(0px 0px 45px rgba(241, 231, 53, 0.3));
	}

	p {
		color: rgba(255, 255, 255, 0.7);
		text-shadow: rgba(241, 231, 53, 0.45) 0px 0px 35px;
		text-decoration: underline;
		text-align: center;
		font-size: 0.7rem;
		width: 40%
	}

	#overlay{
	     width: 100%;
		height: 100%;
     	position: absolute;

          display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
	}

	input{
          width: 100%;
          height: 100%;

          position: absolute;
          display: flex;

         	opacity: 0;
         	z-index: 2;
	}

    .glow {
		box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 1);
	}

    #preview{
        width: 100%;
        height: 100%;
        font-size: 1.5rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        color: var(--accent);
        box-sizing: border-box;
        object-fit: contain;
    }

    #preview--hover{
        	display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          width: 100%;
          height: 100%;
          max-width: 20rem;
          max-height: 45rem;
          border-radius: 0.75rem;
          background-color: transparent;

          position: absolute;
          z-index: 2;
          transition:all 0.2s ease-in;
    }

    #preview--hover > * {
         color: transparent !important;
         font-size: 1.15rem;
         width: 100%;
         transition:all 0.2s ease-in;
         text-decoration: underline;
    }


    #preview--hover:hover{
         background-color: rgba(0, 0, 0, 0.7);
         box-shadow: 0px 0px 50px 0px rgba(241, 231, 53, 0.2);
    }

    #preview--hover:hover p{
         color: var(--primary) !important;
    }

   form{
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
    }

    #close {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: rgba(255,255,255,0.2);
        color: var(--accent);
        font-size: 16px;
        line-height: 1;
        padding: 0.3rem;
        z-index: 3;
        border-radius: 1rem;
        cursor: pointer;
    }

    #close svg {
        width: 100%;
        height: 100%;
        display: block;
        margin-left: 1.475rem;
    }

    #close > svg > * {
         stroke:  rgba(241, 231, 53, 1) !important;
         filter: opacity(0.75);
         z-index: 4;
    }

    #close:hover {
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0px 0px 50px 0px rgba(241, 231, 53, 0.6);
    }

    #close:active {
        background: var(--primary);
    }

    .loader {
        width: 60px;
        aspect-ratio: 2;
        --gradient: no-repeat radial-gradient(circle closest-side, white 90% ,black);
        background:
                var(--gradient) 0   50%,
                var(--gradient) 50%  50%,
                var(--gradient) 100% 50%;
        background-size: calc(100%/3) 50%;
        animation: load 1s infinite linear;
    }

    @keyframes load {
        20%{background-position:0   0, 50%  50%,100%  50%}
        40%{background-position:0 100%, 50%   0,100%  50%}
        60%{background-position:0  50%, 50% 100%,100%   0}
        80%{background-position:0 50%, 50%  50%,100% 100%}
    }
    @keyframes stripes {
		to {
			background-position: 100% 100%;
		}
	}

    @keyframes wave {
        0%   { transform: translateY(0) rotate(var(--rot, 0deg)); }
        25%  { transform: translateY(-6px) rotate(var(--rot, 0deg)); }
        50%  { transform: translateY(0) rotate(var(--rot, 0deg)); }
        75%  { transform: translateY(6px) rotate(var(--rot, 0deg)); }
        100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
    }

    @media (max-width: 650px) {
		.glow {
			box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.35);
		}

		main::after {
			all: revert;
			content: '';
			position: absolute;
			z-index: -1;
			bottom: -1px;
			right: 0;
			width: 100%;
			height: 21%;
			background: rgba(241, 231, 53);
			mask: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50% / 50px 100%;
		}
	}
</style>
