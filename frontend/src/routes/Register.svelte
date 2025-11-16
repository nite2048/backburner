<script>
	import { token } from '../lib/stores';
	import { onMount } from 'svelte';
     import Card from '../lib/Card.svelte';

	onMount(() => {
		if ($token) {
			window.location.href = '/dashboard';
		}
	});
</script>

{#if !$token}
	<main>
		<div class="login-container glow">
			<span>login.</span>
			<button class="btn-striped-shadow github" on:click={() => {window.location.href = 'http://localhost:3000/auth/github';}}>with github.</button>
			<button class="btn-striped-shadow google" on:click={() => {window.location.href = 'http://localhost:3000/auth/google';}}>with google.</button>
			<p on:click={() => ($token = 'DEV-MODE-ONLY')}>cant login?</p>
		</div>
	</main>
{/if}

<style>
	main {
		width: 100svw;
		height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
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

	span {
		color: var(--primary);
		text-shadow: rgba(241, 231, 53, 0.45) 0px 0px 35px;
		text-decoration: underline;
		text-align: center;
		font-size: 2rem;
		margin-bottom: max(7rem, 58%);
	}

	p {
		color: var(--hidden);
		font-size: 0.65rem;
		text-decoration: underline;
		cursor: pointer;
	}

	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 90%;
		height: 90%;
		max-width: 20rem;
		max-height: 45rem;
		gap: 2rem;
		padding: 3rem;
		margin: 1rem;
		background-color: rgba(0, 0, 0, 0.13);
		border: 0.12rem dashed rgba(255, 255, 255, 0.12);
		border-radius: 0.75rem;
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5),
			inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0px 0px rgba(255, 255, 255, 0),
			0px 0px 40px 0px rgba(0, 0, 0, 1);
		position: relative;
		overflow: hidden;
		transition: transform 0.3s ease-in-out;
	}

	.glow {
		box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 1);
	}


	.btn-striped-shadow {
		--btn-color: #333;
		display: inline-block;
		position: relative;
		overflow: visible;
		background-color: var(--btn-color);
		color: var(--accent);
		border-radius: 0.4rem;
		width: 100%;
		height: 48px;
		z-index: 1;
		cursor: pointer;
		line-height: 38px;
		letter-spacing: 1px;
		transition: opacity 0.3s, z-index 0.3s step-end, transform 0.3s;
	}

	.github {
		--btn-color: darkgreen;
	}

	.google {
		--btn-color: #353ff1;
		margin-bottom: auto;
	}

	.btn-striped-shadow:after,
	.btn-striped-shadow:before {
		content: '';
		display: block;
		position: absolute;
		z-index: 1;
		background-image: linear-gradient(
			135deg,
			transparent 0,
			transparent 5px,
			var(--btn-color) 5px,
			var(--btn-color) 10px,
			transparent 10px
		);
		border-radius: 0.75rem;
		transition: transform 0.3s, max-height 0.3s, width 0.3s;
	}

	.btn-striped-shadow:after {
		width: calc(100% - 4px);
		height: 8px;
		left: -10px;
		bottom: -9px;
		background-size: 15px 8px;
		background-repeat: repeat-x;
	}

	.btn-striped-shadow:before {
		width: 8px;
		max-height: calc(100% - 5px);
		height: 100%;
		left: -12px;
		bottom: -5px;
		background-size: 8px 15px;
		background-repeat: repeat-y;
		background-position: 0 100%;
	}

	.btn-striped-shadow:hover {
		transform: translate(-12px, 12px);
		z-index: 3;
	}

	.btn-striped-shadow:hover:before {
		max-height: calc(100% - 10px);
	}

	.btn-striped-shadow:hover:after,
	.btn-striped-shadow:hover:before {
		transform: translate(12px, -12px) scale(0.975);
	}

	@keyframes stripes {
		to {
			background-position: 100% 100%;
		}
	}

	@media (max-width: 600px) {
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