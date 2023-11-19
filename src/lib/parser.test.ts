import { NbtByte, NbtDouble, NbtFloat, NbtInt, NbtShort } from './NbtType.js'
import { _test_, nbtDataParser } from './parser.js'

describe('key', () => {
  describe.each([
    [
      '"foo":"bar"',
      {
        unParsedStr: '"bar"',
        parsedData: 'foo',
        usedLength: 6
      }
    ],
    [
      'foo:"bar"',
      {
        unParsedStr: '"bar"',
        parsedData: 'foo',
        usedLength: 4
      }
    ],
    [
      ' foo:"bar"',
      {
        unParsedStr: '"bar"',
        parsedData: 'foo',
        usedLength: 5
      }
    ],
    [
      ' "foo":"bar"',
      {
        unParsedStr: '"bar"',
        parsedData: 'foo',
        usedLength: 7
      }
    ]
  ])('key(%s)', (str, expected) => {
    test('returns expected', () => {
      expect(_test_.nbtDataKeyParser(str)).toEqual(expected)
    })
  })

  describe.each([
    [
      ' "bar"',
      {
        unParsedStr: '',
        parsedData: 'bar',
        usedLength: 6
      }
    ],
    [
      '"bar", "baz"',
      {
        unParsedStr: ', "baz"',
        parsedData: 'bar',
        usedLength: 5
      }
    ],
    [
      ' 123,',
      {
        unParsedStr: ',',
        parsedData: new NbtInt(123),
        usedLength: 4
      }
    ],
    [
      ' 64b}',
      {
        unParsedStr: '}',
        parsedData: new NbtByte(64),
        usedLength: 4
      }
    ],
    [
      ' 4.5f,',
      {
        unParsedStr: ',',
        parsedData: new NbtFloat(4.5),
        usedLength: 5
      }
    ]
  ])('value(%s)', (str, expected) => {
    test('returns expected', () => {
      expect(_test_.nbtDataValueParser(str, null)).toEqual(expected)
    })
  })

  describe.each([
    [
      '[1, 2, 3]',
      {
        unParsedStr: '',
        parsedData: [new NbtInt(1), new NbtInt(2), new NbtInt(3)],
        usedLength: 9
      }
    ],
    [
      '[1, 2, 3], [4, 5, 6]',
      {
        unParsedStr: ', [4, 5, 6]',
        parsedData: [new NbtInt(1), new NbtInt(2), new NbtInt(3)],
        usedLength: 9
      }
    ],
    [
      '[B; 1, 2, 3]',
      {
        unParsedStr: '',
        parsedData: [new NbtByte(1), new NbtByte(2), new NbtByte(3)],
        usedLength: 12
      }
    ]
  ])('array(%s)', (str, expected) => {
    test('returns expected', () => {
      expect(_test_.nbtDataArrayParser(str)).toEqual(expected)
    })
  })

  describe.each([
    [
      '{foo:"bar"}',
      {
        unParsedStr: '',
        parsedData: { foo: 'bar' },
        usedLength: 11
      }
    ],
    [
      '{foo:"bar"}, {baz:"qux"}',
      {
        unParsedStr: ', {baz:"qux"}',
        parsedData: { foo: 'bar' },
        usedLength: 11
      }
    ]
  ])('object(%s)', (str, expected) => {
    test('returns expected', () => {
      expect(_test_.nbtDataObjectParser(str)).toEqual(expected)
    })
  })

  describe.each([
    [
      '{Brain: {memories: {}}, HurtByTimestamp: 0, SleepTimer: 0s}',
      {
        Brain: { memories: {} },
        HurtByTimestamp: new NbtInt(0),
        SleepTimer: new NbtShort(0)
      }
    ],
    [
      '{Attributes: [{Base: 0.10000000149011612d, Name: "minecraft:generic.movement_speed"}]}',
      {
        Attributes: [
          {
            Base: new NbtDouble(0.10000000149011612),
            Name: 'minecraft:generic.movement_speed'
          }
        ]
      }
    ],
    [
      '{warden_spawn_tracker: {warning_level: 0, ticks_since_last_warning: 1921, cooldown_ticks: 0}}',
      {
        warden_spawn_tracker: {
          warning_level: new NbtInt(0),
          ticks_since_last_warning: new NbtInt(1921),
          cooldown_ticks: new NbtInt(0)
        }
      }
    ],
    [
      '{UUID: [I; -1180357045, 2050965858, -1402996988, -1150411163]}',
      {
        UUID: [
          new NbtInt(-1180357045),
          new NbtInt(2050965858),
          new NbtInt(-1402996988),
          new NbtInt(-1150411163)
        ]
      }
    ],
    [
      '[{Slot: 6b, id: "minecraft:smooth_basalt", Count: 1b}, {Slot: 8b, id: "minecraft:calcite", Count: 1b}]',
      [
        {
          Slot: new NbtByte(6),
          id: 'minecraft:smooth_basalt',
          Count: new NbtByte(1)
        },
        {
          Slot: new NbtByte(8),
          id: 'minecraft:calcite',
          Count: new NbtByte(1)
        }
      ]
    ]
  ])('nbtData(%s)', (str, expected) => {
    test('returns expected', () => {
      expect(nbtDataParser(str)).toEqual(expected)
    })
  })
})
