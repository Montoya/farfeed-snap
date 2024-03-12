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
