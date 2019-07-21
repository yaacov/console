import * as _ from 'lodash';
import {
  PluginPackage,
  filterActivePluginPackages,
  PluginPackageFilter,
  resolvePluginPackages,
} from './plugin-resolver';

const CONSOLE_PLUGIN_PREFIX = '@console/';
const CONSOLE_INEGRATION_TESTS_PREFIX = '@console/integration-tests/';

/**
 * Return a map of integration tests.
 */
export const pluginIntegrationTests = (
  monorepoRootDir: string = process.cwd(),
  pluginFilter: PluginPackageFilter = filterActivePluginPackages,
) => {
  const shortName = (plugin: PluginPackage) => plugin.name.slice(CONSOLE_PLUGIN_PREFIX.length);

  const integrationTests = (plugin: PluginPackage) =>
    plugin.name.startsWith(CONSOLE_PLUGIN_PREFIX) &&
    plugin.consolePlugin.integrationTests &&
    _.mapValues(plugin.consolePlugin.integrationTests, (paths) =>
      _.map(paths, (path) =>
        path.startsWith(CONSOLE_INEGRATION_TESTS_PREFIX)
          ? path.slice(CONSOLE_INEGRATION_TESTS_PREFIX.length)
          : `${monorepoRootDir}/packages/${shortName(plugin)}/${path}`,
      ),
    );

  const plugins = resolvePluginPackages(monorepoRootDir, pluginFilter);
  const pluginTests = plugins.reduce(
    (map, plugin) => Object.assign(map, integrationTests(plugin)),
    {},
  );

  return _.pickBy(pluginTests, (tests) => !!tests);
};
