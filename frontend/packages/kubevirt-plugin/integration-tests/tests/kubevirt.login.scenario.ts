import { browser } from 'protractor';
import { execSync } from 'child_process';
import { appHost } from '../../../../integration-tests/protractor.conf';
import { logIn } from './utils/utils';

describe('Authentication', () => {
  it('Web console logs in.', async () => {
    await browser.get(appHost);
    if (process.env.BRIDGE_BASE_ADDRESS !== undefined) {
      await logIn();
      execSync(
        `oc login -u ${process.env.BRIDGE_AUTH_USERNAME} -p ${
          process.env.BRIDGE_AUTH_PASSWORD
        } --config=${process.env.KUBECONFIG}`,
      );
    }
  });
});
