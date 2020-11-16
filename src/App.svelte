<script lang="ts">

	import Header from './components/Header/index.svelte'
	import Display from './components/Display/index.svelte';
	import { reviews } from './stores/reviews'
</script>
<style>	
:global(body) {
	margin: 0;
	padding: 0;
}
</style>
<div id="main">
	<Header />
	<Display />
</div>

