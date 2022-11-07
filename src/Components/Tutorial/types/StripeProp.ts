// TODO: move this into a `types/` folder
import type { Elements } from '@stripe/react-stripe-js';

export type StripeProp = Parameters<typeof Elements>[0]['stripe'];
