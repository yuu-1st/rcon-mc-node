import { _test_, nbtDataParser } from './parser'

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
        parsedData: 123,
        usedLength: 4
      }
    ],
    [
      ' 64b}',
      {
        unParsedStr: '}',
        parsedData: 64,
        usedLength: 4
      }
    ],
    [
      ' 4.5f,',
      {
        unParsedStr: ',',
        parsedData: 4.5,
        usedLength: 5
      }
    ]
  ])('value(%s)', (str, expected) => {
    test('returns expected', () => {
      expect(_test_.nbtDataValueParser(str)).toEqual(expected)
    })
  })

  describe.each([
    [
      '[1, 2, 3]',
      {
        unParsedStr: '',
        parsedData: [1, 2, 3],
        usedLength: 9
      }
    ],
    [
      '[1, 2, 3], [4, 5, 6]',
      {
        unParsedStr: ', [4, 5, 6]',
        parsedData: [1, 2, 3],
        usedLength: 9
      }
    ],
    [
      '[B; 1, 2, 3]',
      {
        unParsedStr: '',
        parsedData: [1, 2, 3],
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
        HurtByTimestamp: 0,
        SleepTimer: 0
      }
    ],
    [
      '{Attributes: [{Base: 0.10000000149011612d, Name: "minecraft:generic.movement_speed"}]}',
      {
        Attributes: [
          {
            Base: 0.10000000149011612,
            Name: 'minecraft:generic.movement_speed'
          }
        ]
      }
    ],
    [
      '{warden_spawn_tracker: {warning_level: 0, ticks_since_last_warning: 1921, cooldown_ticks: 0}}',
      {
        warden_spawn_tracker: {
          warning_level: 0,
          ticks_since_last_warning: 1921,
          cooldown_ticks: 0
        }
      }
    ],
    [
      '{UUID: [I; -1180357045, 2050965858, -1402996988, -1150411163]}',
      {
        UUID: [-1180357045, 2050965858, -1402996988, -1150411163]
      }
    ],
    [
      '[{Slot: 6b, id: "minecraft:smooth_basalt", Count: 1b}, {Slot: 8b, id: "minecraft:calcite", Count: 1b}]',
      [
        {
          Slot: 6,
          id: 'minecraft:smooth_basalt',
          Count: 1
        },
        {
          Slot: 8,
          id: 'minecraft:calcite',
          Count: 1
        }
      ]
    ]
  ])('nbtData(%s)', (str, expected) => {
    test('returns expected', () => {
      expect(nbtDataParser(str)).toEqual(expected)
    })
  })
})
