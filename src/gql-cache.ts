import { InMemoryCache, Reference } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                sets: {
                    keyArgs: false,
                    merge(existing, incoming) {
                        // todo
                        let sets: Reference[] = [];
                        if (existing && existing.sets) {
                            sets = sets.concat(existing.sets);
                        }
                        if (incoming && incoming.sets) {
                            sets = sets.concat(incoming.sets);
                        }
                        return {
                            ...incoming,
                            sets,
                        };
                    },
                },
            },
        },
    },
});
