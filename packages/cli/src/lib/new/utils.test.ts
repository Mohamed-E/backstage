/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  resolvePackageName,
  populateOptions,
  createDirName,
  Options,
} from './utils';
import { Template } from './types';

describe('resolvePackageName', () => {
  it('should generate correct name without scope', () => {
    expect(resolvePackageName({ baseName: 'test', plugin: true })).toEqual(
      'backstage-plugin-test',
    );
    expect(resolvePackageName({ baseName: 'test', plugin: false })).toEqual(
      'test',
    );
  });

  it('should generate correct name for backstage scope', () => {
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'backstage',
        plugin: true,
      }),
    ).toEqual('@backstage/plugin-test');
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'backstage',
        plugin: false,
      }),
    ).toEqual('@backstage/test');
  });

  it('should generate correct name for custom scope', () => {
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'custom',
        plugin: true,
      }),
    ).toEqual('@custom/backstage-plugin-test');
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'custom',
        plugin: false,
      }),
    ).toEqual('@custom/test');
  });

  it('should generate correct name for custom scope and custom prefix', () => {
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'custom/myapp.',
        plugin: true,
      }),
    ).toEqual('@custom/myapp.backstage-plugin-test');
    expect(
      resolvePackageName({
        baseName: 'test',
        scope: 'custom/myapp.',
        plugin: false,
      }),
    ).toEqual('@custom/myapp.test');
  });
});

describe('populateOptions', () => {
  it('should return default values if not provided', () => {
    expect(populateOptions({}, { targetPath: '/example' } as Template)).toEqual(
      {
        id: '',
        private: true,
        baseVersion: '0.1.0',
        owner: '',
        license: 'Apache-2.0',
        targetPath: '/example',
        scope: '',
        moduleId: '',
      },
    );
  });

  it('should include all non-standard global and prompt values', () => {
    expect(
      populateOptions({ foo: 'bar' }, {
        targetPath: '/example',
      } as Template),
    ).toEqual({
      id: '',
      private: true,
      baseVersion: '0.1.0',
      owner: '',
      license: 'Apache-2.0',
      targetPath: '/example',
      scope: '',
      moduleId: '',
      foo: 'bar',
    });
  });

  it('should priority global targetPath over the targetPath specified in template', () => {
    expect(
      populateOptions({ targetPath: '/global' }, {
        targetPath: '/example',
      } as Template),
    ).toEqual({
      id: '',
      private: true,
      baseVersion: '0.1.0',
      owner: '',
      license: 'Apache-2.0',
      targetPath: '/global',
      scope: '',
      moduleId: '',
    });
  });
});

describe('createDirName', () => {
  it('should return name in the backend-module format if backendModulePrefix is set to true', () => {
    expect(
      createDirName(
        { backendModulePrefix: true } as Template,
        {
          id: 'foo',
          moduleId: 'bar',
        } as Options,
      ),
    ).toEqual('foo-backend-module-bar');
  });

  it('should throw an error if backendModulePrefix is configured as true but is missing moduleId', () => {
    expect(() =>
      createDirName(
        { backendModulePrefix: true } as Template,
        {
          id: 'foo',
          moduleId: '',
        } as Options,
      ),
    ).toThrow('backendModulePrefix requires moduleId prompt');
  });

  it('should append the suffix value if one is provided', () => {
    expect(
      createDirName({ suffix: 'foo' } as Template, { id: 'bar' } as Options),
    ).toEqual('bar-foo');
  });

  it('should return id if neither backendModulePrefix nor suffix is specified', () => {
    expect(createDirName({} as Template, { id: 'foo' } as Options)).toEqual(
      'foo',
    );
  });
});
