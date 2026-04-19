<script>
     import { onDestroy, onMount } from "svelte";

     const minOpacity = 0.1; // Base fade floor so navbar never becomes fully invisible while scrolling.
     let fadeSpeed = 0.3; // Higher = faster fade response per scroll delta.
     let scrollOpacity = 1;     // `scrollOpacity` tracks scroll-based fade, while `opacity` is the rendered value.
     let opacity = 1;

     let lastScrollY = 0;
     let ticking = false;
     let isHovering = false;

     let header;
     let scrollTarget;
     let scrollObserver;

     const mediaQuery = window.matchMedia('(min-width: 600px)');
     if (mediaQuery.matches) {
          console.log("Desktop view active!");
          fadeSpeed = 1;
     }


     function addScrollListener(target) {
          if (target === window) {
               window.addEventListener("scroll", onScroll, { passive: true });
          } else if (target) {
               target.addEventListener("scroll", onScroll, { passive: true });
          }
     }

     function removeScrollListener(target) {
          if (target === window) {
               window.removeEventListener("scroll", onScroll);
          } else if (target) {
               target.removeEventListener("scroll", onScroll);
          }
     }

     function readScrollTop() {
          if (!scrollTarget || scrollTarget == window){
               return window.scrollY;
          }

          return scrollTarget.scrollTop;
     }

     function isScrollable(el) {
          const styles = getComputedStyle(el);
          const canScrollY = styles.overflowY === "auto" || styles.overflowY === "scroll";
          return canScrollY;
     }

     function resolveScrollTarget() {
          if (!header || !header.parentElement) return window;
          const candidates = Array.from(header.parentElement.children).filter((el) => el !== header);
          const localScrollable = candidates.find((el) => isScrollable(el));
          return localScrollable ?? window;
     }

     function refreshScrollTarget() {
          const nextTarget = resolveScrollTarget();
          if (nextTarget === scrollTarget) return;

          removeScrollListener(scrollTarget);
          scrollTarget = nextTarget;
          addScrollListener(scrollTarget);
          lastScrollY = readScrollTop();
          handleScroll();
     }

     function handleScroll() {
          const current = readScrollTop();
                    const delta = current - lastScrollY;

                    if (current <= 8) {
                         opacity = 1;
                         scrollOpacity = 1;
                     } else if (delta > 0) {
                         const fadeOut = Math.min((delta / 220) * fadeSpeed, 0.06 * fadeSpeed);
                         opacity = Math.max(minOpacity, opacity - fadeOut);
                         scrollOpacity = Math.max(minOpacity, scrollOpacity - fadeOut);
                     } else if (delta < 0) {
                         const fadeIn = Math.min((Math.abs(delta) / 80) * fadeSpeed, 0.14 * fadeSpeed);
                         opacity = Math.min(1, opacity + fadeIn);
                         scrollOpacity = Math.min(1, scrollOpacity + fadeIn);
                     }

                    // Hover temporarily restores full opacity without losing scroll fade state.
                    opacity = isHovering ? 1 : scrollOpacity;
                    lastScrollY = current;
                    ticking = false;
               }

               function handleHeaderEnter() {
                    isHovering = true;
                    opacity = 1;
               }

               function handleHeaderLeave() {
                    isHovering = false;
                    opacity = scrollOpacity;
               }

               function onScroll() {
                    if (ticking) return;

                    ticking = true;
          requestAnimationFrame(handleScroll);
     }

     function handleUploadClick() {
          window.location.href = '/upload';
               }

               onMount(() => {
                     // Find the actual scroll container and bind fade updates to it.
                     scrollTarget = resolveScrollTarget();
                     lastScrollY = readScrollTop();

                     if (header) {
                          header.addEventListener("mouseenter", handleHeaderEnter);
                          header.addEventListener("mouseleave", handleHeaderLeave);

                          scrollObserver = new MutationObserver(refreshScrollTarget);
                          scrollObserver.observe(header.parentElement, { childList: true });
                     }

                     addScrollListener(scrollTarget);

                     handleScroll();
                         });

                        onDestroy(() => {
                             if (header) {
                                  header.removeEventListener("mouseenter", handleHeaderEnter);
                                  header.removeEventListener("mouseleave", handleHeaderLeave);
                             }

                             removeScrollListener(scrollTarget);

                             if (scrollObserver) {
                                  scrollObserver.disconnect();
                             }
      });

     function logout() {
          fetch('http://localhost:3000/auth/logout', {
               method: 'GET',
               credentials: 'include'
          })
          .then(res => {
               if (res.ok) {
                    window.location.href = '/';
               }
          })
          .catch(err => {
               console.error('Logout failed:', err);
          });
     }
</script>

<section bind:this={header} class="header glass" style={`opacity: ${opacity};`}>
     <button class="rounded profile" type="button" aria-label="Logout" on:click={logout} >
          <svg class="logout-icon" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
               <polyline points="16 17 21 12 16 7"/>
               <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
     </button>

     <button class="rounded action" type="button" aria-label="Upload" on:click={handleUploadClick}>
          <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true">
               <g>
                    <path d="M336.5,495.1c7.9,7.9,20.6,7.9,28.5,0c7.9-7.9,7.9-20.6,0-28.5l-34.2-34.2l-28.5,28.5L336.5,495.1z" />
                    <path d="M401.5,430c7.9,7.9,20.6,7.9,28.5,0c7.9-7.9,7.9-20.6,0-28.5l-34.2-34.2l-28.5,28.5L401.5,430z" />
                    <path d="M466.6,365c7.9,7.9,20.6,7.9,28.5,0c7.9-7.9,7.9-20.6,0-28.5l-34.2-34.2l-28.5,28.5L466.6,365z" />
                    <path d="M456.7,204l-136-4.5l-118.1-118.2c-33.5-33.5-148.3-94-181.8-60.5s27,148.3,60.5,181.8l118.1,118.2l4.5,135.8c0.5,16,19.9,23.7,31.3,12.3l233.8-233.6C480.3,223.9,472.7,204.5,456.7,204z" />
               </g>
          </svg>
     </button>
</section>

<style>
     .header {
          width: 100%;
          position: fixed;
          top: 0;
          height: 64px;

          padding: 0 clamp(0.75rem, 2vw, 1.25rem);

          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: row;

          gap: 1rem;
          z-index: 5;
          border: none;

          transition: opacity 0.12s linear;
     }

     .glass {
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);

          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0px 0px rgba(255, 255, 255, 0),
          0px 0px 40px 0px rgba(0, 0, 0, 1);

          overflow: hidden;
          border: 0;
     }

     .rounded {
          height: 1rem;
          width: 1rem;

          color: var(--bg);
          background: rgba(241, 231, 53, 0.94);
          border-radius: 40%;

          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;

          padding: 1.3rem;

          border: none;
          cursor: pointer;
          box-shadow: 0px 0px 35px rgba(0, 0, 0, 0.45);

          z-index: 5;
          /* Improve hover/click feedback with subtle animation/color changes */
          transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, filter 0.15s ease;
     }

     .rounded:hover {
          /* reduce bounciness a bit (~10% less) */
          transform: translateY(-2.7px) scale(1.036);
          box-shadow: 0px 6px 28px rgba(0, 0, 0, 0.55);
          background-color: rgba(241, 231, 53, 0.98);
          filter: brightness(1.05);
     }

     .rounded:active {
          transform: translateY(-1px) scale(0.99);
          background-color: rgba(241, 231, 53, 0.92);
          filter: brightness(0.97);
     }

     .profile {
          margin-right: auto;
     }

     .action {
          margin-left: auto;
     }

     .upload-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin: 0;
          fill: var(--bg);
          filter: none;
    }

    .logout-icon {
         height: 1.3rem;
         width: 1.3rem;
         display: inline-block;
         vertical-align: middle;
         margin-left: 1.5rem;
    }
</style>
