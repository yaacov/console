import { PluginPackage, Package, filterActivePluginPackages } from '../plugin-resolver';
import { pluginIntegrationTests } from '../plugin-integration-tests';
import { templatePackage } from './plugin-resolver.spec';

const appPackage: Package = {
  ...templatePackage,
  name: 'app',
  dependencies: {
    '@console/bar-plugin': '1.2.3',
    '@console/qux-plugin': '2.3.4',
  },
};
const monorepoRootDir = process.cwd();

describe('pluginIntegrationTests', () => {
  it('will not fail on missing tests.', () => {
    const pluginPackages: PluginPackage[] = [
      {
        ...templatePackage,
        name: '@console/qux-plugin',
        version: '2.3.4',
        consolePlugin: { entry: 'plugin.ts' },
      },
    ];
    const pluginFilter = () => filterActivePluginPackages(appPackage, pluginPackages);
    const expectedTests = {};

    expect(pluginIntegrationTests(monorepoRootDir, pluginFilter)).toEqual(expectedTests);
  });

  it('will not pick none active packages.', () => {
    const pluginPackages: PluginPackage[] = [
      {
        ...templatePackage,
        name: '@console/foo-plugin',
        version: '1.2.3',
        consolePlugin: {
          entry: 'plugin.ts',
          integrationTests: {
            foo: ['integration-tests/tests/foo.scenario.ts'],
          },
        },
      },
    ];
    const pluginFilter = () => filterActivePluginPackages(appPackage, pluginPackages);
    const expectedTests = {};

    expect(pluginIntegrationTests(monorepoRootDir, pluginFilter)).toEqual(expectedTests);
  });

  it('returns a map of short-plugin-name to a list of its integration tests.', () => {
    const pluginPackages: PluginPackage[] = [
      {
        ...templatePackage,
        name: '@console/bar-plugin',
        version: '1.2.3',
        consolePlugin: {
          entry: 'plugin.ts',
          integrationTests: {
            bar: [
              '@console/integration-tests/tests/base.scenario.ts',
              'integration-tests/tests/bar.scenario.ts',
            ],
          },
        },
      },
      {
        ...templatePackage,
        name: '@console/foo-plugin',
        version: '1.2.3',
        consolePlugin: {
          entry: 'plugin.ts',
          integrationTests: {
            foo: ['integration-tests/tests/foo.scenario.ts'],
          },
        },
      },
      {
        ...templatePackage,
        name: '@console/qux-plugin',
        version: '2.3.4',
        consolePlugin: { entry: 'plugin.ts' },
      },
    ];
    const pluginFilter = () => filterActivePluginPackages(appPackage, pluginPackages);
    const expectedTests = {
      bar: [
        'tests/base.scenario.ts',
        `${monorepoRootDir}/packages/bar-plugin/integration-tests/tests/bar.scenario.ts`,
      ],
    };

    expect(pluginIntegrationTests(monorepoRootDir, pluginFilter)).toEqual(expectedTests);
  });
});
