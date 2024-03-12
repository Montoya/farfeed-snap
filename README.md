# farfeed-snap
Farcaster feed in a Snap! Displays the latest 10 casts from the [/metamask](https://warpcast.com/~/channel/metamask) channel on Warpcast.

## How it's done 

First, a proxy endpoint is set up to use the Neynar API to retrieve the latest casts from the `metamask` channel. Here is the code: 

```php title="index.php"
<?php 
  /* return JSON */
	header('Content-Type: application/json; charset=utf-8');
  /* allow any origin because Snaps run in a "null" origin */
	header("Access-Control-Allow-Origin:*");

	$curl = curl_init();

	curl_setopt_array($curl, [
		CURLOPT_URL => "https://api.neynar.com/v2/farcaster/feed/channels?channel_ids=metamask&with_recasts=true&with_replies=false&limit=10",
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "GET",
		CURLOPT_HTTPHEADER => [
			"accept: application/json",
			"api_key: [neynar API key]"
		],
	]);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		echo $response;
	}
?>
```

This endpoint is deployed at `https://homerow.club/fc/index.php`. Please do not abuse it, it's just for this example. 

Next, the Snap. Starting from a fresh Snap: 

```bash 
yarn create @metamask/snap farfeed-snap
cd farfeed-snap 
yarn install
yarn run allow-scripts auto
yarn start
```

The Snap is running at `localhost:8080` and the companion dapp is running at `localhost:8000`. 

Next, update the manifest permissions: 

```json title="snap.manifest.json"
"initialPermissions": {
  "endowment:page-home": {},
  "endowment:lifecycle-hooks": {},
  "endowment:network-access": {},
  "snap_dialog": {}
},
```

Finally, the code for the Snap to display the feed in a homepage: 

```typescript title="index.ts"
import type { OnHomePageHandler } from '@metamask/snaps-sdk';
import { panel, heading, divider, text } from '@metamask/snaps-sdk';
import { InternalError } from '@metamask/snaps-sdk'; 

async function getFC() { 
  const response = await fetch("https://homerow.club/fc/"); 
  return response.json(); 
}

export const onHomePage: OnHomePageHandler = async () => {
  return getFC().then(fc => {
    // format data! 
    try { 
      const casts = fc.casts; 

      const feed = casts.map((cast:any) => [
        divider(),
        text(cast.text), 
        text(`_by ${cast.author.username}_ [ ](https://warpcast.com/${cast.author.username}/${cast.hash.slice(0,11)})`),
      ]); 
      
      return { content:  panel([
        heading("Latest casts in /metamask"), 
        ...feed.flat(),
        divider(),
        text("[Visit channel](https://warpcast.com/~/channel/metamask)"),
      ]) };
    }
    catch (error) { 
      console.log(error); 
      throw new InternalError(); 
    }
  }); 
};
```

That's it! When opening the Snap in the MetaMask menu, it displays the latest posts from the `metamask` channel!

This approach can be modified for any number of use cases 😁

_Ready to build your own Snap? Visit the [docs](https://docs.metamask.io/snaps/)!_
