/* eslint-disable no-undef */

export type provisionOption = {
  method: string;
  source?: string;
};

export type networkResource = {
  name: string;
  mac: string;
  binding: string;
  networkDefinition: string;
};

export type storageResource = {
  name: string;
  size: string;
  storageClass: string;
  attached?: boolean;
};

export type cloudInitConfig = {
  useCloudInit: boolean;
  useCustomScript?: boolean;
  customScript?: string;
  hostname?: string;
  sshKey?: string;
};

export type vmConfig = {
  name: string;
  namespace: string;
  description: string;
  template?: string;
  provisionSource?: provisionOption;
  operatingSystem?: string;
  flavor?: string;
  workloadProfile?: string;
  startOnCreation: boolean;
  cloudInit: cloudInitConfig;
  storageResources: storageResource[];
  networkResources: networkResource[];
};
