<script lang="ts">
	import { queryParamState, strOptions } from "$lib/QueryParamsStore.svelte.js";

	let myText = queryParamState("my-text", ...strOptions(""));
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
</svelte:head>
<header class="container">
	<hgroup>
		<h1>svelte-query-param-manager</h1>
		<p>Lightweight query param store for state.</p>
	</hgroup>
</header>
<main class="container">
	<section>
		<pre>
            <code>
                {`<`}script lang="ts"{`>`}
                {`  import { queryParamState, strOptions } from "$lib/QueryParamsStore.svelte.js";`}
                {`  let myText = queryParamState("my-text", ...strOptions(""));`}
                {`</script>`}
                {`<input type="text" bind:value={$myText} />`}
            </code>
        </pre>
		<label for="">
			<input type="text" bind:value={$myText} />
		</label>
	</section>
</main>
