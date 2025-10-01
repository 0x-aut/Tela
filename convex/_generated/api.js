/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { makeApi, anyApi } from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api = makeApi(
  anyApi,
  {
    designFiles: {
      createDesignFile: { isQuery: false, isAction: false },
      getDesignFileByOwner: { isQuery: true, isAction: false },
      getDesignFileByShareLink: { isQuery: true, isAction: false },
      updateShapes: { isQuery: false, isAction: false },
      addCollaborator: { isQuery: false, isAction: false },
      markCollaboratorActive: { isQuery: false, isAction: false },
      getActiveCollaborators: { isQuery: true, isAction: false },
      cleanupInactiveCollaborators: { isQuery: false, isAction: false },
    },
  }
);
export const internal = anyApi;
