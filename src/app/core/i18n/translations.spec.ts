import { TRANSLATIONS } from '../../../testing/i18n';

interface Tree {
  readonly [key: string]: string | Tree;
}

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((all, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string'
      ? { ...all, [path]: value }
      : { ...all, ...flatten(value, path) };
  }, {});
}

const en = flatten(TRANSLATIONS.en);
const ptBr = flatten(TRANSLATIONS['pt-BR']);

/** Naming standard (docs/conhecimento/modulos/i18n.md): lowerCamelCase ASCII segments; enum values keep the API value. */
const SEGMENT = /^[a-z][a-zA-Z0-9]*$/;
const ENUM_VALUE = /^[A-Z][A-Z0-9_]*$/;
const SCOPES = [
  'app',
  'common',
  'contracts',
  'dashboard',
  'enum',
  'error',
  'pendencies',
  'responsiblePersons',
  'shell',
  'validation',
];

describe('translation files', () => {
  it('have exactly the same keys in every language (parity)', () => {
    const missingInPtBr = Object.keys(en).filter((key) => !(key in ptBr));
    const extraInPtBr = Object.keys(ptBr).filter((key) => !(key in en));
    expect(missingInPtBr).toEqual([]);
    expect(extraInPtBr).toEqual([]);
  });

  it('have no empty values', () => {
    const empty = [...Object.entries(en), ...Object.entries(ptBr)]
      .filter(([, value]) => value.trim() === '')
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });

  it('keep the same interpolation parameters in every language', () => {
    const params = (text: string) =>
      (text.match(/{{\s*\w+\s*}}/g) ?? []).map((p) => p.replace(/\s/g, '')).sort();
    const different = Object.keys(en).filter(
      (key) => JSON.stringify(params(en[key])) !== JSON.stringify(params(ptBr[key] ?? '')),
    );
    expect(different).toEqual([]);
  });

  it('follow the key naming standard', () => {
    const invalid = Object.keys(en).filter((key) => {
      const segments = key.split('.');
      if (!SCOPES.includes(segments[0]) || segments.length < 2 || segments.length > 5) {
        return true;
      }
      return segments.some((segment, index) =>
        segments[0] === 'enum' && index === segments.length - 1
          ? !ENUM_VALUE.test(segment)
          : !SEGMENT.test(segment),
      );
    });
    expect(invalid).toEqual([]);
  });

  it('keep keys sorted alphabetically at every level, as the standard asks', () => {
    const unsorted = (tree: Tree, path = ''): string[] => {
      const keys = Object.keys(tree);
      const here = keys.join() === [...keys].sort().join() ? [] : [path || '(root)'];
      return keys.reduce((all, key) => {
        const value = tree[key];
        return typeof value === 'string'
          ? all
          : [...all, ...unsorted(value, path ? `${path}.${key}` : key)];
      }, here);
    };
    expect(unsorted(TRANSLATIONS.en)).toEqual([]);
    expect(unsorted(TRANSLATIONS['pt-BR'])).toEqual([]);
  });
});
