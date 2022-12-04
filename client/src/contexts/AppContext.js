import { createContext } from 'react';

// Nous fournissons ainsi à toute l'application l'URL de notre API (là ou sont stockées via le seed nos images)
export const ApiContext = createContext('https://restapi.fr/api/recipes');

// Owner du contrat
export const Owner = "0x0e977eA26E7C528109B0Ac6E3dAAa87967b71ca6";

// isOwner
export const IsOwner = false;