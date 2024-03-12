import type { OnHomePageHandler } from '@metamask/snaps-sdk';
import { panel, copyable, heading, text } from '@metamask/snaps-sdk';
import { InternalError } from '@metamask/snaps-sdk'; 

async function getFC() { 
  const response = await fetch("https://homerow.club/fc/?fid=4275"); 
  return response.json() 
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onHomePage: OnHomePageHandler = async () => {
  return getFC().then(fc => {
    // format data! 
    try { 
      const casts = fc.data.casts; 
      return { content:  panel([
        heading("Your feed"), 
       ...casts.map((cast:any) => text(cast.content as string)),
      ]) };
    }
    catch (error) { 
      throw new InternalError(); 
    }
  }); 
};
