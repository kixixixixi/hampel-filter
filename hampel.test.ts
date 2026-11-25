import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hampel } from './hampel.ts'

test('外れ値を検出して中央値で置換', () => {
  const data = [1, 2, 3, 2, 1, 100, 3, 2, 1, 3]
  const { filtered, outliers } = hampel(data)
  assert.deepEqual(outliers, [5])
  assert.equal(filtered[5], 2)
})

test('一定値の系列は変更なし', () => {
  const { filtered, outliers } = hampel([5, 5, 5, 5])
  assert.deepEqual(outliers, [])
  assert.deepEqual(filtered, [5, 5, 5, 5])
})
