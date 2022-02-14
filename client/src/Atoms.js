import { atom } from "jotai";

//
//
// this is the global state
// that can be imported into any component
// using useAtom()

export const isLoggedInAtom = atom(false);
export const userAtom = atom({});t
