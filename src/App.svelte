<script lang="ts">

import Header from './components/Header/index.svelte'
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
	<p>Reviews:{$reviews}</p>
</div>

