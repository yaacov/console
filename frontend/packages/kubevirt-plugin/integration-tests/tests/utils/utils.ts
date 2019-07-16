/* eslint-disable no-unused-vars, no-undef, no-await-in-loop, no-console, no-underscore-dangle */
import { execSync } from 'child_process';
import { $, by, ElementFinder, browser, ExpectedConditions as until, element } from 'protractor';

import { config } from '../../../../../integration-tests/protractor.conf';
import {
  nameInput as loginNameInput,
  passwordInput as loginPasswordInput,
  submitButton as loginSubmitButton,
} from '../../../../../integration-tests/views/login.view';
import { PAGE_LOAD_TIMEOUT } from './consts';

export async function tryNTimes(attempts: number, func: Function) {
  let _attempts = attempts;
  let success: boolean;
  do {
    success = true;
    try {
      await func();
    } catch (e) {
      success = false;
    }
  } while (!success && --_attempts > 0);
}

export function removeLeakedResources(leakedResources: Set<string>) {
  const leakedArray: string[] = [...leakedResources];
  if (leakedArray.length > 0) {
    console.error(`Leaked ${leakedArray.join()}`);
    leakedArray
      .map((r) => JSON.parse(r) as { name: string; namespace: string; kind: string })
      .forEach(({ name, namespace, kind }) => {
        try {
          execSync(`kubectl delete -n ${namespace} --cascade ${kind} ${name}`);
        } catch (error) {
          console.error(`Failed to delete ${kind} ${name}:\n${error}`);
        }
      });
  }
  leakedResources.clear();
}

export function addLeakableResource(leakedResources: Set<string>, resource) {
  leakedResources.add(
    JSON.stringify({
      name: resource.metadata.name,
      namespace: resource.metadata.namespace,
      kind: resource.kind,
    }),
  );
}

export function removeLeakableResource(leakedResources: Set<string>, resource) {
  leakedResources.delete(
    JSON.stringify({
      name: resource.metadata.name,
      namespace: resource.metadata.namespace,
      kind: resource.kind,
    }),
  );
}

export function createResource(resource) {
  execSync(`echo '${JSON.stringify(resource)}' | kubectl create -f -`);
}

export function createResources(resources) {
  resources.forEach(createResource);
}

export function deleteResource(resource) {
  const kind = resource.kind === 'NetworkAttachmentDefinition' ? 'net-attach-def' : resource.kind;
  execSync(
    `kubectl delete -n ${resource.metadata.namespace} --cascade ${kind} ${resource.metadata.name}`,
  );
}

export function deleteResources(resources) {
  resources.forEach(deleteResource);
}

export async function withResource(
  resourceSet: Set<string>,
  resource: any,
  callback: Function,
  keepResource: boolean = false,
) {
  addLeakableResource(resourceSet, resource);
  await callback();
  if (!keepResource) {
    deleteResource(resource);
    removeLeakableResource(resourceSet, resource);
  }
}

export async function click(elem: ElementFinder, timeout?: number, conditionFunc?: Function) {
  const _timeout = timeout !== undefined ? timeout : config.jasmineNodeOpts.defaultTimeoutInterval;
  if (conditionFunc === undefined) {
    await browser.wait(until.elementToBeClickable(elem), _timeout);
    await elem.click();
  } else {
    do {
      await browser.wait(until.elementToBeClickable(elem), _timeout);
      await elem.click();
    } while ((await conditionFunc()) === false);
  }
}

export async function selectDropdownOption(dropdownId: string, option: string) {
  await click($(dropdownId));
  await browser.wait(until.presenceOf(element(by.linkText(option))));
  await $(`${dropdownId} + ul`)
    .element(by.linkText(option))
    .click();
}

export async function getDropdownOptions(dropdownId: string): Promise<string[]> {
  const options = [];
  await $(`${dropdownId} + ul`)
    .$$('li')
    .each((elem) => {
      elem
        .getText()
        .then((text) => {
          options.push(text);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    });
  return options;
}

export async function fillInput(elem: ElementFinder, value: string) {
  // Sometimes there seems to be an issue with clear() method not clearing the input
  let attempts = 3;
  do {
    --attempts;
    if (attempts < 0) {
      throw Error(`Failed to fill input with value: '${value}'.`);
    }
    await browser.wait(until.elementToBeClickable(elem));
    // TODO: line below can be removed when pf4 tables in use.
    await elem.click();
    await elem.clear();
    await elem.sendKeys(value);
  } while ((await elem.getAttribute('value')) !== value && attempts > 0);
}

export async function getInputValue(elem: ElementFinder) {
  return elem.getAttribute('value');
}

export async function logIn() {
  await fillInput(loginNameInput, process.env.BRIDGE_AUTH_USERNAME);
  await fillInput(loginPasswordInput, process.env.BRIDGE_AUTH_PASSWORD);
  await click(loginSubmitButton);
  await browser.wait(until.visibilityOf($('img.pf-c-brand')), PAGE_LOAD_TIMEOUT);
}

export const resolveTimeout = (timeout, defaultTimeout) =>
  // eslint-disable-next-line eqeqeq
  timeout != undefined ? timeout : defaultTimeout;

export function getRandStr(length: number) {
  return Math.random()
    .toString(36)
    .replace(/[.]/g, '')
    .substr(1, length); // First char is always 0
}

export function getRandomMacAddress() {
  const getRandByte = () => {
    let byte: string;
    do {
      byte = Math.random()
        .toString(16)
        .substr(2, 2);
    } while (byte.length !== 2);
    return byte;
  };
  return `30:24:${getRandByte()}:${getRandByte()}:${getRandByte()}:${getRandByte()}`;
}

export function getResourceObject(name: string, namespace: string, kind: string) {
  const resourceJson = execSync(`oc get -o json -n ${namespace} ${kind} ${name}`).toString();
  return JSON.parse(resourceJson);
}

export const waitForCount = (elementArrayFinder, targetCount) => {
  return async () => {
    const count = await elementArrayFinder.count();
    return count === targetCount;
  };
};

export async function asyncForEach(iterable, callback) {
  const array = [...iterable];
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const waitForStringInElement = (elem: ElementFinder, needle: string) => {
  return async () => {
    const content = await elem.getText();
    return content.includes(needle);
  };
};

export const waitForStringNotInElement = (elem: ElementFinder, needle: string) => {
  return async () => {
    const content = await elem.getText();
    return !content.includes(needle);
  };
};
