import { goto } from "$app/navigation";
import { page } from "$app/state";
import { derived, writable } from "svelte/store";

/**
 * Adds state to the search params of the url.
 * 
 * Actually returns a store.
 * 
 * @param key The key for your state, used in the URL.
 * @param defaultValue The default value for your state. The URL will hide this param if it equals this value after encoding.
 * @param encode Encode your value as a string.
 * @param decode Decode your value from a string or null. Return null to use the defaultValue.
 * @returns 
 */
export function queryParamState<T = any>(key: string, defaultValue: T, encode: (value: T) => string | undefined, decode: (value: string | null) => T | null) {
    let val = writable(decode(page.url.searchParams.get(key)) ?? defaultValue);
    let encodedVal = derived(val, (s) => encode(s));
    encodedVal.subscribe((encodedState) => {
        pageStateStore.update((pageState) => {
            if (encodedState === encode(defaultValue)) pageState[key] = null;
            else pageState[key] = encodedState ?? null;
            return pageState;
        })
    });
    pageStateStore.subscribe((pageState) => {
        val.set(decode(pageState[key]) ?? defaultValue);
    })
    return val;
}
const pageStateStore = writable<Record<string, string | null>>({});
let timeout: number | null = null;
pageStateStore.subscribe((val) => {
    try {
        let url = new URL(page.url);
        for (let k of Object.keys(val)) {
            if (val[k] == null) url.searchParams.delete(k);
            else url.searchParams.set(k, val[k]);
        }
        if (timeout !== null) clearTimeout(timeout);
        if (window) timeout = setTimeout(() => goto(url, { replaceState: true, keepFocus: true }), 500);
    } catch { }
})

/**
 * 
 * Spread the return of this function as a parameter to searchParamState.
 * 
 * `let myState = searchParamState("my-boolean", ...boolOptions(true));`
 * 
 * @param def The default value for the state.
 * @returns 
 */
export const boolOptions = (def: boolean) => [def, (v: any) => v.toString(), (v: any) => JSON.parse(v ?? def.toString()) ?? def] as const;
/**
 * 
 * Spread the return of this function as a parameter to searchParamState.
 * 
 * `let myState = searchParamState("my-string", ...strOptions("Hello World!"));`
 * 
 * @param def The default value for the state.
 * @returns 
 */
export const strOptions = (def: string) => [def, (v: any) => v, (v: any) => v ?? def] as const;