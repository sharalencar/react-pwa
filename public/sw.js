import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute, Route } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

self.skipwaiting();
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

const imageRoute = new Route(
  ({ request }) => {
    return request.destionation === "image";
  },
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

const stylesRoute = new Route(
  ({ request }) => {
    return request.destination === "style";
  },
  new NetworkFirst({
    cacheName: "styles",
  })
);

registerRoute(imageRoute);
registerRoute(stylesRoute);
