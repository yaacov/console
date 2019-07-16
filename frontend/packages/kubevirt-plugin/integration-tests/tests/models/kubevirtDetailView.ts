/* eslint-disable no-unused-vars, no-undef, no-await-in-loop */
import { browser } from 'protractor';
import { storageResource, networkResource } from '../utils/types';
import { fillInput, selectDropdownOption, click, tryNTimes } from '../utils/utils';
import * as kubevirtDetailView from '../../views/kubevirtDetailView.view';
import { confirmAction } from '../../views/vm.actions.view';
import { isLoaded, resourceRows } from '../../../../../integration-tests/views/crud.view';
import { DetailView } from './detailView';
import { TABS, diskTabCol, networkTabCol } from '../utils/consts';

export class KubevirtDetailView extends DetailView {
  async getAttachedDisks(): Promise<storageResource[]> {
    await this.navigateToTab(TABS.DISKS);
    const resources = [];
    for (const row of await resourceRows) {
      const cells = row.$$('div');
      resources.push({
        name: await cells.get(diskTabCol.name).getText(),
        size: (await cells.get(diskTabCol.size).getText()).match(/^\d*/)[0],
        storageClass: await cells.get(diskTabCol.storageClass).getText(),
      });
    }
    return resources;
  }

  async getAttachedNics(): Promise<networkResource[]> {
    await this.navigateToTab(TABS.NICS);
    const resources = [];
    for (const row of await resourceRows) {
      const cells = row.$$('div');
      resources.push({
        name: await cells.get(networkTabCol.name).getText(),
        mac: await cells.get(networkTabCol.mac).getText(),
        networkDefinition: await cells.get(networkTabCol.networkDefinition).getText(),
        binding: await cells.get(networkTabCol.binding).getText(),
      });
    }
    return resources;
  }

  async waitForNewResourceRow() {
    // TODO: Remove when https://bugzilla.redhat.com/show_bug.cgi?id=1709939 is fixed
    const newRowInput = kubevirtDetailView.newResourceRowInput;
    const inputPresent = (await newRowInput.isPresent()) && (await newRowInput.isEnabled());
    await browser.sleep(300);
    // eslint-disable-next-line no-return-await
    return inputPresent && ((await newRowInput.isPresent()) && (await newRowInput.isEnabled()));
  }

  async addDisk(disk: storageResource) {
    await this.navigateToTab(TABS.DISKS);
    await click(kubevirtDetailView.createDisk, 1000, this.waitForNewResourceRow);
    await fillInput(kubevirtDetailView.diskName, disk.name);
    await fillInput(kubevirtDetailView.diskSize, disk.size);
    await selectDropdownOption(kubevirtDetailView.diskStorageClassDropdownId, disk.storageClass);
    await click(kubevirtDetailView.applyBtn);
    await isLoaded();
  }

  async removeDisk(name: string) {
    await this.navigateToTab(TABS.DISKS);
    await kubevirtDetailView.selectKebabOption(name, 'Delete');
    await confirmAction();
  }

  async addNic(nic: networkResource) {
    await this.navigateToTab(TABS.NICS);
    await tryNTimes(3, async () => {
      await click(kubevirtDetailView.createNic, 1000, this.waitForNewResourceRow);
      await fillInput(kubevirtDetailView.nicName, nic.name);
      await selectDropdownOption(kubevirtDetailView.networkTypeDropdownId, nic.networkDefinition);
      await selectDropdownOption(kubevirtDetailView.networkBindingId, nic.binding);
      await fillInput(kubevirtDetailView.macAddress, nic.mac);
      await click(kubevirtDetailView.applyBtn);
    });
    await isLoaded();
  }

  async removeNic(name: string) {
    await this.navigateToTab(TABS.NICS);
    await kubevirtDetailView.selectKebabOption(name, 'Delete');
    await confirmAction();
  }
}
