<script>
     import { onMount } from "svelte";
     import Card from "../lib/Card.svelte";

     let container
     let altText, currentUrl, json
     let isUploading = false, isImageInBlob = false;

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

          const response = await fetch("http://localhost:3000/dashboard/upload", {
               method: "POST",
               credentials: 'include',
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                    filename: altText,
                    data: base64
               })
          });

          json = await response.json(); //Do something with JSON
          console.log(json);
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

<section>
     {#if json}
          <Card item={json} />
     {:else}
          {#if isUploading}
                    <div class="loader"></div>
                    <p><span style="color: var(--primary); text-decoration: underline;"> please wait.</span></p> <p>this might take upwards of a minute</p> <p>you may close the page now.</p>
          {:else}
               <form class="container" bind:this={container} data-present="false">
                    {#if isImageInBlob}
                         <img id='preview' src={currentUrl} alt={altText}/>
                         <button id="close" class="close-btn" on:click={() => removeImage()}>
                         <svg xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              class="close-icon">
                              <line x1="100" y1="100" x2="412" y2="412"
                                   stroke="black" stroke-width="90" stroke-linecap="round"/>
                              <line x1="412" y1="100" x2="100" y2="412"
                                   stroke="black" stroke-width="90" stroke-linecap="round"/>
                         </svg>
                         </button>

                         <div class="hovercard">
                              <p>click anywhere to upload.</p>
                         </div>
                    {:else}
                        <input type="file" accept="image/*" hidden/>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                             <g>
                                  <path d="M336.5,495.1c7.9,7.9,20.6,7.9,28.5,0c7.9-7.9,7.9-20.6,0-28.5l-34.2-34.2l-28.5,28.5L336.5,495.1z"/>
                                  <path d="M401.5,430c7.9,7.9,20.6,7.9,28.5,0c7.9-7.9,7.9-20.6,0-28.5l-34.2-34.2l-28.5,28.5L401.5,430z"/>
                                  <path d="M466.6,365c7.9,7.9,20.6,7.9,28.5,0c7.9-7.9,7.9-20.6,0-28.5l-34.2-34.2l-28.5,28.5L466.6,365z"/>
                                  <path d="M456.7,204l-136-4.5l-118.1-118.2c-33.5-33.5-148.3-94-181.8-60.5s27,148.3,60.5,181.8l118.1,118.2l4.5,135.8
                                            c0.5,16,19.9,23.7,31.3,12.3l233.8-233.6C480.3,223.9,472.7,204.5,456.7,204z"/>
                             </g>
                        </svg>
                        <p style="text-shadow: none;">click anywhere to <span style="text-shadow: none; text-decoration: underline;"> upload.</span></p>
                    {/if}
               </form>
          {/if}
     {/if}
</section>

<style>
    .container{
        border: 0.12rem solid rgba(255, 255, 255, 0.2);
    }

    .container[data-present="false"]:hover{
	     box-shadow: inset 0px 0px 40px 0px rgba(0, 0, 0, 0.25), 0px 0px 50px 0px rgba(241, 231, 53, 0.2);
	}

	.container[data-present="false"]{
	    border: 0.12rem dashed rgba(255, 255, 255, 0.12);
	}

	span{
		font-size: 1rem;
	}

	input{
        width: 100%;
        height: 100%;

        position: absolute;
        display: flex;

       	opacity: 0;
       	z-index: 2;
	}

    img{
        width: 100%;
        height: 100%;

        position: relative;

        border-radius: 0.5rem;
        border: 0.12rem dashed rgba(255, 255, 255, 0.18);

        aspect-ratio: 1;
        object-fit: cover;
    }

    .hovercard{
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

    .hovercard > * {
         color: transparent !important;
         font-size: 1.15rem;
         width: 100%;
         transition:all 0.2s ease-in;
         text-decoration: underline;
    }


    .hovercard:hover{
         background-color: rgba(0, 0, 0, 0.7);
         box-shadow: 0px 0px 50px 0px rgba(241, 231, 53, 0.2);
    }

    .hovercard:hover p{
         color: var(--primary) !important;
    }


   form{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
    }

    .close-btn{
        position: absolute;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        width: 1.5rem;
        height: 1.5rem;
        top: 0;
        right: 0;

        transform: translate(50%, -50%);
        padding: 0.3rem;

        border-radius: 1rem;

        border: none;
        background: rgba(255,255,255,0.2);
        color: var(--accent);

        font-size: 16px;
        line-height: 1;

        z-index: 3;
        cursor: pointer;
    }

    .close-btn svg {
        width: 100%;
        height: 100%;
        display: block;
        margin-left: 1.5rem;
    }

    .close-btn > svg > * {
         stroke:  rgba(241, 231, 53, 1) !important;
         filter: opacity(0.75);
         z-index: 4;
    }

    .close-btn:hover {
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0px 0px 50px 0px rgba(241, 231, 53, 0.3);
    }

    .close-btn:active {
        background: var(--primary);
    }
</style>
