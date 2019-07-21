import { browser } from 'protractor';
import { appHost, testName } from '@console/integration-tests/protractor.conf';
import * as crudView from '@console/integration-tests/views/crud.view';

describe('Demo integration test', () => {
  it(`will delete namespace ${testName}`, async () => {
    // Use projects if OpenShift so non-admin users can run tests.
    const resource = browser.params.openshift === 'true' ? 'projects' : 'namespaces';
    await browser.get(`${appHost}/k8s/cluster/${resource}`);
    await crudView.isLoaded();

    const exists = await crudView.rowForName(testName).isPresent();
    expect(exists).toBeFalsy();
  });
});
