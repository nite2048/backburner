<script lang="ts">
  export let displayData: any;

  // An error is assumed if 'error' key exists, or if 'message' key exists and there are 2 or fewer keys.
  $: error = displayData?.error || (displayData?.message && Object.keys(displayData).length <= 2);
  console.log(displayData.error)

  // Data is successfully loaded if it exists, is not empty, and is not an error.
  $: isLoaded = displayData && Object.keys(displayData).length > 0 && !error;

  // Reactive assignments for card data, only computed if data is loaded.
  $: title = isLoaded ? displayData.title || {} : {};
  $: description = isLoaded ? displayData.description || '' : '';
  $: category = isLoaded ? displayData.category || '' : '';
  $: genres = isLoaded ? displayData.genres || [] : [];
  $: startDate = isLoaded ? displayData.startDate || '' : '';
  $: averageScore = isLoaded ? displayData.averageScore || 0 : 0;
  $: coverImage = isLoaded ? displayData.coverImage || '' : '';

  // Format the start date into a readable string.
  $: formattedStartDate = startDate
    ? new Date(startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A';
</script>

<div class="card-wrapper">
  {#if error}
    <div class="container error-container">
      <h2>API Error</h2>
      <p>{error}</p>
    </div>
  {:else if isLoaded}
    <div class="container">
      <div class="cover-image-wrapper">
        <img src={coverImage} alt={title.name} class="cover-image" />
        {#if category}
            <div class="category-badge">{category.toUpperCase()}</div>
        {/if}
      </div>
      <div class="content">
        <h1 class="title">{title.name}</h1>
        {#if title.originalName && title.originalName !== title.name}
          <p class="subtitle">({title.originalName} - {title.transliteratedName})</p>
        {/if}

        {#if description}
            <p class="description">{description}</p>
        {/if}

        <div class="details-grid">
          {#if genres.length > 0}
          <div class="detail-item">
            <span class="detail-label">Genres:</span>
            <span>{genres.join(', ')}</span>
          </div>
          {/if}
          {#if startDate}
          <div class="detail-item">
            <span class="detail-label">Release:</span>
            <span>{formattedStartDate}</span>
          </div>
          {/if}
          {#if averageScore}
          <div class="detail-item score-item">
            <span class="detail-label">Score:</span>
            <span class="score">{averageScore}</span>
          </div>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <div class="container loading-container">
        <div class="loader"></div>
        <p>Loading data...</p>
    </div>
  {/if}
</div>

<style>
    .card-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Spock', 'Roboto', sans-serif;
        padding: 1rem;
        box-sizing: border-box;
    }

    .container {
        display: flex;
        flex-direction: row;
        width: 100%;
        max-width: 55rem; /* 900px */
        height: auto;
        padding: 0.5rem;
        background-color: rgba(0, 0, 0, 0.13);
        border: 0.12rem dashed rgba(255, 255, 255, 0.12);
        border-radius: 0.75rem;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        box-shadow: inset 0px 0px 40px 0px rgba(0, 0, 0, 0), 0px 0px 40px 0px rgba(0, 0, 0, 1);
        transition: all 0.2s ease-in-out;
        color: rgba(255, 255, 255, 0.8);
    }

    .loading-container, .error-container {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        text-align: center;
        font-size: 1rem;
        min-height: 20rem;
        color: rgba(255, 255, 255, 0.7);
		text-shadow: rgba(241, 231, 53, 0.45) 0px 0px 35px;
    }

    .error-container h2 {
        color: var(--primary, #f1e735);
        font-size: 1.5rem;
        text-decoration: underline;
    }

    .cover-image-wrapper {
        position: relative;
        flex-shrink: 0;
        width: 17.5rem; /* 280px */
        height: 25rem; /* 400px */
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 0 1.25rem 0.3rem rgba(0,0,0,0.3);
    }

    .cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .category-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background-color: var(--primary, #f1e735);
        color: black;
        padding: 0.25rem 0.6rem;
        border-radius: 0.3rem;
        font-size: 0.75em;
        font-weight: bold;
        text-transform: uppercase;
    }

    .content {
        padding: 0 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
        min-width: 0;
    }

    .title {
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 0.3rem;
        color: var(--primary, #f1e735);
        text-shadow: rgba(241, 231, 53, 0.45) 0px 0px 1.25rem;
        line-height: 1.2;
    }

    .subtitle {
        font-size: 0.9em;
        font-style: italic;
        color: #ccc;
        margin-bottom: 1.25rem;
    }

    .description {
        font-size: 0.9em;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        max-height: 7.5rem; /* 120px */
        overflow-y: auto;
        padding-right: 0.6rem;
        color: #e0e0e0;
    }

    .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(8.75rem, 1fr)); /* 140px */
        gap: 1rem;
        font-size: 0.85em;
    }

    .detail-item {
        background-color: rgba(0,0,0,0.2);
        padding: 0.6rem;
        border-radius: 0.375rem;
        border: 1px solid rgba(255,255,255,0.1);
    }

    .detail-label {
        color: var(--primary, #f1e735);
        font-weight: 500;
        margin-bottom: 0.3rem;
        display: block;
        font-size: 0.85em;
    }

    .score-item .score {
        font-size: 1.1em;
        font-weight: bold;
        color: black;
        background-color: var(--primary, #f1e735);
        padding: 0.1rem 0.5rem;
        border-radius: 0.25rem;
        display: inline-block;
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

    @media (max-width: 768px) {
        .container > *{
             font-size: 10px;
        }

        .container {
            flex-direction: column;
            max-width: 25rem; /* 400px */
            padding: 1rem;
        }

        .cover-image-wrapper {
            width: 100%;
            height: 15.6rem; /* 250px */
            margin-bottom: 1rem;
        }

        .content {
            padding: 0;
        }

        .title {
            font-size: 1.5em;
            text-align: center;
        }

        .subtitle {
            text-align: center;
            margin-bottom: 1rem;
        }
        .description {
            max-height: 6.25rem; /* 100px */
        }
    }
</style>
