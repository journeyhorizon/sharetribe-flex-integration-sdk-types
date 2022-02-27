/// <reference path="types.d.ts" />

import { IntegrationSdk } from "./integration_sdk";
import { fileStore, memoryStore } from "./tokenStore";
import { types } from "./types";
import { objectQueryString } from "./utils";

export = SharetribeFlexIntegrationSdk;
declare namespace SharetribeFlexIntegrationSdk {
  const types: types;
  const tokenStore: {
    memoryStore: typeof memoryStore;
    fileStore: typeof fileStore;
  };
  const util: {
    objectQueryString: typeof objectQueryString;
  };
  function createInstance(config: {
    clientId: string;
    clientSecret?: string;
    transitVerbose?: boolean;
  }): IntegrationSdk;
}
